import { NextResponse } from "next/server";
import { assessBusinessType } from "../../../../business-type/business-type";

const API_KEY = process.env.OPENROUTER_API_KEY ?? "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const businessDescription: string = body.businessDescription ?? "";
    const businessName: string = body.businessName ?? "";
    const marketResearchSummary: string = body.marketResearchSummary ?? "";

    if (!businessDescription.trim()) {
      return NextResponse.json(
        { success: false, error: "businessDescription is required." },
        { status: 400 }
      );
    }

    if (!businessName.trim()) {
      return NextResponse.json(
        { success: false, error: "businessName is required." },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Server missing OPENROUTER_API_KEY." },
        { status: 500 }
      );
    }

    const result = await assessBusinessType(businessDescription, businessName, marketResearchSummary, API_KEY);

    if (!result.success) {
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Business type route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Failed to process request." },
      { status: 500 }
    );
  }
}
