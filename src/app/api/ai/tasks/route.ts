import { NextResponse } from "next/server";
import { generateTasksFromContext } from "@/business-task/server/gemini";

export async function POST(request: Request) {
  try {
    const { profile, chatHistory, currentTasks } = await request.json();

    if (!profile) {
      return NextResponse.json({ error: "Profile is required." }, { status: 400 });
    }

    const result = await generateTasksFromContext(profile, chatHistory || [], currentTasks || []);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Tasks API Error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}