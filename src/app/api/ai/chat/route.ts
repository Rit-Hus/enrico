import { NextResponse } from "next/server";
import { sendMessageToGemini } from "@/business-task/server/gemini";

export async function POST(request: Request) {
  try {
    const { history, profile, message } = await request.json();

    if (!message || !profile) {
      return NextResponse.json({ error: "Message and profile are required." }, { status: 400 });
    }

    const reply = await sendMessageToGemini(history || [], profile, message);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}