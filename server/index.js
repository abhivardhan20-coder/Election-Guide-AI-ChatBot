import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://accounts.google.com", "https://cdn.jsdelivr.net", "'unsafe-inline'", "'unsafe-eval'"],
      "connect-src": ["'self'", "https://generativelanguage.googleapis.com", "https://*.googleapis.com", "https://*.firebaseio.com", "https://*.firestore.googleapis.com", "https://accounts.google.com"],
      "img-src": ["'self'", "data:", "https://*.googleusercontent.com"],
      "frame-src": ["'self'", "https://accounts.google.com"],
    },
  },
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = [
  'http://localhost:3005',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5180',
].filter(Boolean);

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
    req.user = { email: "guest@example.com", name: "Guest User" };
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
    parts: z.array(z.object({ text: z.string() }))
  }))
});

const PORT = process.env.PORT || 3005;

app.post('/api/chat', authenticateUser, async (req, res) => {
  try {
    const { contents } = chatSchema.parse(req.body);
    const key = process.env.GEMINI_API_KEY;
    
    if (!key) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

    console.log(`[DEBUG] Calling Gemini API at: ${url}`);

    const headers = { 
      'Content-Type': 'application/json',
      'X-goog-api-key': key 
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    console.log("Gemini API Response Status:", response.status);

    if (!response.ok) {
      console.error("Gemini API Error Detail:", JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || `Gemini API Error: ${response.status}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error("Gemini Response has no candidates:", JSON.stringify(data, null, 2));
      throw new Error("AI returned an empty response. This might be due to safety filters.");
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
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
