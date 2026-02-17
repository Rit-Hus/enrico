import { NextResponse } from "next/server";
import { extractProfileFromHistory } from "@/business-task/server/gemini";

export async function POST(request: Request) {
  try {
    const { history } = await request.json();

    if (!history) {
      return NextResponse.json({ error: "History is required." }, { status: 400 });
    }

    const profile = await extractProfileFromHistory(history);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Extract Profile API Error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}