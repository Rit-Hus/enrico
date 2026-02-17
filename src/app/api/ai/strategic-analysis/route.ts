import { NextResponse } from "next/server";
import { generateStrategicAnalysis } from "@/business-task/server/gemini";

export async function POST(request: Request) {
  try {
    const { profile, history } = await request.json();

    if (!profile) {
      return NextResponse.json({ error: "Profile is required." }, { status: 400 });
    }

    const analysis = await generateStrategicAnalysis(profile, history || []);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Strategic Analysis API Error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}