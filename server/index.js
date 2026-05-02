import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } catch (e) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  }
} else {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const app = express();

app.set('trust proxy', 1);

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://accounts.google.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      "connect-src": ["'self'", "https://generativelanguage.googleapis.com", "https://*.googleapis.com", "https://*.firebaseio.com", "https://*.firestore.googleapis.com", "https://accounts.google.com"],
      "img-src": ["'self'", "data:", "https://*.googleusercontent.com"],
      "frame-src": ["'self'", "https://accounts.google.com", "https://www.google.com"],
    },
  },
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:3005', 'http://localhost:5180');
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});

const guestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Guest limit reached. Please sign in for more access." }
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const idToken = authHeader.split('Bearer ')[1];
  
  if (idToken === 'GUEST_TOKEN') {
    req.user = { email: "guest@example.com", name: "Guest User", isGuest: true };
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: `Unauthorized: ${error.message}` });
  }
};

const chatSchema = z.object({
  contents: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string().max(8000) }))
  })).max(50)
});

const SYSTEM_INSTRUCTION = `You are ElectionGuide AI, a helpful assistant explaining the Indian democratic and electoral process. 
Answer only questions related to Indian elections, voting, democracy, and civic participation. 
Be concise, factual, and cite the Election Commission of India (ECI) where relevant.
Format step-by-step information as numbered lists.
Always provide 3-4 suggested follow-up questions that help the user explore the topic deeper.`;

const responseSchema = {
  description: "The AI's response including text and suggested follow-up questions",
  type: SchemaType.OBJECT,
  properties: {
    reply: {
      type: SchemaType.STRING,
      description: "The main answer to the user's question, formatted in Markdown."
    },
    suggestedQuestions: {
      type: SchemaType.ARRAY,
      description: "3-4 context-aware follow-up questions.",
      items: { type: SchemaType.STRING }
    }
  },
  required: ["reply", "suggestedQuestions"]
};

// Initialize Gemini globally to save memory and CPU cycles per request
const key = process.env.GEMINI_API_KEY;
let model = null;

if (key) {
  const genAI = new GoogleGenerativeAI(key);
  model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not configured.");
}

const PORT = process.env.PORT || 3005;

app.post('/api/chat', (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (token === 'GUEST_TOKEN') return guestLimiter(req, res, next);
  limiter(req, res, next);
}, authenticateUser, async (req, res) => {
  try {
    if (!model) return res.status(500).json({ error: "Gemini API is unavailable" });
    
    const { contents } = chatSchema.parse(req.body);

    const history = contents.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));
    const latestMessage = contents[contents.length - 1].parts[0].text;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(latestMessage);
    
    let rawText;
    try {
      rawText = result.response.text();
    } catch (e) {
      return res.json({ 
        reply: "I cannot fulfill this request as it violates safety guidelines regarding political or sensitive content.", 
        suggestedQuestions: ["How does voting work?", "What is the Election Commission?"] 
      });
    }

    // Safely extract JSON even if the AI prefixes it with conversational text
    const jsonMatch = rawText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    rawText = jsonMatch ? jsonMatch[1].trim() : rawText.trim();
    
    const data = JSON.parse(rawText);

    res.json(data);

  } catch (error) {
    console.error("Chat Error:", error);
    const isValidationErr = error instanceof z.ZodError;
    res.status(isValidationErr ? 400 : 500).json({ 
      error: isValidationErr ? error.message : "An internal server error occurred. Please try again later." 
    });
  }
});

const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`ElectionGuide AI Backend running on port ${PORT}`);
});

export { app, server };
export default app;
