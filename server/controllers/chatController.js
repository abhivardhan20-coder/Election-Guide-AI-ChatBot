import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { z } from 'zod';

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

// Define tools for Gemini to use (Function Calling)
const electionTools = [{
  functionDeclarations: [{
    name: "getLiveElectionUpdates",
    description: "Fetches the latest live election news or real-time polling data.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        state: { type: SchemaType.STRING, description: "The Indian state to check" }
      },
      required: ["state"],
    },
  }],
}];

const chatSchema = z.object({
  contents: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ 
      text: z.string()
        .max(8000, "Message too long")
        .transform(val => val.trim().replace(/[\r\n]{3,}/g, '\n\n')) // Strip excessive whitespace and newlines
    }))
  })).max(50)
});

let model = null;

export const initGemini = (key) => {
  if (key) {
    const genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: electionTools,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });
    console.log("Gemini AI Initialized with Function Calling support.");
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not configured.");
  }
};

export const handleChat = async (req, res) => {
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
    let rawJson = jsonMatch ? jsonMatch[1].trim() : rawText.trim();
    
    let data;
    try {
      data = JSON.parse(rawJson);
      if (!data.reply || !data.suggestedQuestions) throw new Error("Missing required fields");
    } catch (parseError) {
      console.error("Failed to parse Gemini output:", rawJson);
      data = {
        reply: "I formulated an answer, but I encountered an error formatting it. Could you please rephrase your question?",
        suggestedQuestions: ["What is the voting process?", "How do I find my polling booth?"]
      };
    }

    res.json(data);

  } catch (error) {
    console.error("Chat Error:", error);
    const isValidationErr = error instanceof z.ZodError;
    res.status(isValidationErr ? 400 : 500).json({ 
      error: isValidationErr ? error.message : "An internal server error occurred. Please try again later." 
    });
  }
};
