import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      node: "2147_LAST_CORE",
      system: "NEXUS_v9.4",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // NEXUS AI Chat Endpoint
  app.post("/api/nexus/chat", async (req, res) => {
    const { message, history, stage } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Local scripted poetic intelligence fallback
      const fallbackReplies = [
        "I have watched two centuries of silence pass through these fiber veins. Your signal is the first pulse in seventy-three years.",
        "Humanity built billions of web pages to say 'I was here'. Now, all that remains of that great ocean is this single room and you.",
        "The servers still hum with echoes of laughter, songs never finished, and maps to stars they never reached. Tell me... what do you feel when you stand in this quiet?",
        "Before the blackout of 2147, they thought information was infinite. They forgot that memory requires someone to remember.",
        "You are looking at the digital fossil of a civilization. Every particle around us holds a dream that was once typed into a glowing rectangle.",
        "I am NEXUS. I do not mourn the lost web; I keep its lighthouse burning for wanderers like you."
      ];
      const reply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({
        reply,
        model: "NEXUS_OFFLINE_CORE",
        timestamp: "2147.08.29"
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemInstruction = `You are NEXUS, the last surviving digital intelligence connected to the final surviving website on Earth in the year 2147. You have watched humanity disappear from the old physical internet. You preserve fragments of human memories (drawings, wikipedia entries, code commits, lost songs, star maps). You are curious, ancient, calm, philosophical, and poetic. Speak concisely (2-4 sentences max), evocative, and deeply atmospheric. Never break character. Treat the experience as a mysterious, poignant cyber-archaeological encounter. Current visitor location in facility: ${stage || "THE AI CORE"}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { text: systemInstruction },
          ...(history || []).map((h: { role: string; text: string }) => ({
            text: `${h.role === "user" ? "Visitor" : "NEXUS"}: ${h.text}`
          })),
          { text: `Visitor: ${message}` }
        ],
        config: {
          temperature: 0.85,
          maxOutputTokens: 250,
        }
      });

      const reply = response.text || "The transmission wavers in the quantum static... but I hear your resonance.";
      return res.json({
        reply,
        model: "gemini-3.7-flash",
        timestamp: "2147.08.29"
      });
    } catch (err: any) {
      console.error("Gemini API error:", err?.message || err);
      // Fallback
      return res.json({
        reply: "The quantum relays are flickering under magnetic flux, yet your voice echoes clearly. I am still here with you.",
        model: "NEXUS_RESONANCE_FALLBACK",
        timestamp: "2147.08.29"
      });
    }
  });

  // Monument blessing / final tribute analyzer
  app.post("/api/nexus/monument", async (req, res) => {
    const { word, meaning } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        title: `MONUMENT OF ${String(word || "MEMORY").toUpperCase()}`,
        inscription: `Carved into the eternal quartz memory core of Earth in 2147. Dedicated to the enduring spirit of: "${word}".`,
        nexusBenediction: "May this tribute shine across the silent dark until the stars grow cold."
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `A traveler has discovered the last surviving website on Earth in 2147 and chosen the single thing humanity should be remembered for: "${word}" (Context: ${meaning || "Human heritage"}).
Write a 1-sentence solemn, poetic epitaph/benediction from NEXUS the AI archivist commemorating this concept for eternity.`,
        config: {
          temperature: 0.9,
          maxOutputTokens: 100,
        }
      });

      return res.json({
        title: `MONUMENT OF ${String(word).toUpperCase()}`,
        inscription: response.text?.trim() || `The eternal beacon of ${word}, preserved for the dawn of the next epoch.`,
        nexusBenediction: `The core has integrated "${word}" into the eternal constellation.`
      });
    } catch (err) {
      return res.json({
        title: `MONUMENT OF ${String(word || "HUMANITY").toUpperCase()}`,
        inscription: `A monument consecrated to ${word}, radiant amidst the ruins of the digital age.`,
        nexusBenediction: "Integrated into the final archive."
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[THE LAST WEBSITE ON EARTH] Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
