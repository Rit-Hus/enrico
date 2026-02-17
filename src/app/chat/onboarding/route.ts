import { NextResponse } from "next/server";
import { sendOnboardingMessage } from "../../api/ai";
import type { ChatMessage } from "../../api/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const history: ChatMessage[] = body.history ?? [];
    const message: string = body.message ?? "";

    if (!message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const result = await sendOnboardingMessage(history, message);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Onboarding route error:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to process request." }, { status: 500 });
  }
}
