import { NextResponse } from "next/server";
import { performMarketResearch } from "../../../../market-research/market-research";

const API_KEY = process.env.OPENROUTER_API_KEY ?? "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const businessDescription: string = body.businessDescription ?? "";

    if (!businessDescription.trim()) {
      return NextResponse.json(
        { success: false, error: "businessDescription is required." },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Server missing OPENROUTER_API_KEY." },
        { status: 500 }
      );
    }

    const result = await performMarketResearch(businessDescription, API_KEY);

    if (!result.success) {
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Market research route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Failed to process request." },
      { status: 500 }
    );
  }
}
