// ============================================================
// AI Chatbot — Express Backend
// ============================================================
// Handles POST /api/chat — receives conversation history,
// sends it to the Groq Cloud API (OpenAI-compatible),
// and returns the assistant reply.
// ============================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  })
);

// ── Groq Cloud config ────────────────────────────────────────
// Groq exposes an OpenAI-compatible REST API, so we use fetch
// directly — no extra SDK needed.
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL   = "openai/gpt-oss-120b";

// ── System prompt ────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a helpful, friendly, and concise AI assistant. 
Answer clearly and thoughtfully. If you don't know something, say so.
Use markdown formatting where appropriate — code blocks for code, 
bullet points for lists, **bold** for key terms.`;

// ── POST /api/chat ───────────────────────────────────────────
// Body: { messages: [{ role: "user" | "assistant", content: string }] }
// Returns: { reply: string }
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return res.status(400).json({ error: "Each message must have role and content" });
      }
      if (!["user", "assistant"].includes(msg.role)) {
        return res.status(400).json({ error: `Invalid role: ${msg.role}` });
      }
    }

    // Prepend the system message then pass the full history.
    // This maintains multi-turn context across the session.
    const payload = {
      model: GROQ_MODEL,
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    };

    // Call the Groq OpenAI-compatible endpoint
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    // Handle non-2xx HTTP responses from Groq
    if (!groqRes.ok) {
      const errBody = await groqRes.json().catch(() => ({}));
      console.error("Groq API error:", groqRes.status, errBody);

      if (groqRes.status === 401) {
        return res.status(401).json({ error: "Invalid Groq API key. Check your .env file." });
      }
      if (groqRes.status === 429) {
        return res.status(429).json({ error: "Rate limit reached. Please wait a moment." });
      }

      return res.status(502).json({
        error: errBody?.error?.message ?? "Groq API returned an error.",
      });
    }

    const data = await groqRes.json();

    // Extract the assistant reply from the OpenAI-compatible response shape
    const reply = data.choices?.[0]?.message?.content ?? "";

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ── Health check ─────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Server running at http://localhost:${PORT}`);
  console.log(`🤖  Model: ${GROQ_MODEL}`);
  console.log(
    `🔑  Groq API key: ${process.env.GROQ_API_KEY ? "loaded" : "⚠️  MISSING — set GROQ_API_KEY in .env"}`
  );
});
