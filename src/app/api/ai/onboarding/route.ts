import { NextResponse } from "next/server";
import { sendOnboardingMessage } from "@/business-task/server/gemini";

export async function POST(request: Request) {
  try {
    const { history, message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const reply = await sendOnboardingMessage(history || [], message);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}