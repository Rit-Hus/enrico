import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendOnboardingMessage } from "./ai";
import { ChatMessage } from "./types";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------
// POST /api/chat/onboarding
// -----------------------------------------
app.post("/api/chat/onboarding", async (req, res) => {
  try {
    const { history, message } = req.body as {
      history: ChatMessage[];
      message: string;
    };

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const reply = await sendOnboardingMessage(history || [], message);

    return res.json({
      reply
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Failed to process request."
    });
  }
});

// health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
