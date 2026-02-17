import type {
  BusinessTypeAssessment,
  BusinessTypeResponse,
  BusinessTypeError,
} from "./types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-4-5";
const MAX_RETRIES = 2;

const JSON_SCHEMA = `{
  "recommendedType": "<string: e.g. 'Aktiebolag (AB)'>",
  "reasoning": "<string: 2-3 sentences explaining why this type is best for this business>",
  "alternatives": [
    {
      "type": "<string: e.g. 'Enskild firma'>",
      "pros": ["<string>", "<string>"],
      "cons": ["<string>", "<string>"]
    }
  ],
  "considerations": ["<string: important thing to consider>", "<string>", "<string>"]
}`;

const SYSTEM_PROMPT = `You are a Swedish business registration expert. Given a business idea, name, and market context, recommend the most appropriate Swedish business entity type.

The main Swedish business types are:
- Enskild firma (Sole proprietorship) - simplest, owner personally liable, no minimum capital
- Handelsbolag (HB) (Trading partnership) - 2+ partners, personal liability, no minimum capital
- Kommanditbolag (KB) (Limited partnership) - like HB but some partners have limited liability
- Aktiebolag (AB) (Limited company) - limited liability, requires SEK 25,000 minimum share capital
- Ekonomisk forening (Economic association/cooperative) - at least 3 members, democratic governance

CRITICAL: You MUST respond with ONLY a raw JSON object. No markdown. No code fences. No explanation. No text before or after. JUST the JSON.

The JSON MUST use EXACTLY this structure:

${JSON_SCHEMA}

STRICT RULES:
- "recommendedType" must be a real Swedish business entity type with its abbreviation
- "reasoning" should explain why this type best fits the specific business
- "alternatives" should list 2-3 other viable options with pros and cons
- "considerations" should list 3-4 practical things to consider (tax implications, registration requirements, etc.)
- Keep all text concise and actionable
- Consider the business scale, liability needs, number of founders, and capital requirements`;

const RETRY_PROMPT = `Your previous response did NOT match the required schema. Return ONLY a JSON object with:
- "recommendedType": string
- "reasoning": string
- "alternatives": array of objects with "type", "pros" (string[]), "cons" (string[])
- "considerations": string[]

No markdown, no explanation. Just the JSON.`;

function extractJSON(raw: string): string {
  let cleaned = raw
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function ensureStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((v) => String(v));
}

function validateAndNormalize(raw: unknown): BusinessTypeAssessment {
  const data = raw as Record<string, any>;

  const recommendedType = data.recommendedType ?? data.recommended ?? data.type;
  if (typeof recommendedType !== "string" || !recommendedType) {
    throw new Error("Missing or invalid 'recommendedType'");
  }

  const reasoning = data.reasoning ?? data.explanation ?? data.reason;
  if (typeof reasoning !== "string" || !reasoning) {
    throw new Error("Missing or invalid 'reasoning'");
  }

  const alts = data.alternatives ?? data.options ?? [];
  const alternatives = Array.isArray(alts)
    ? alts.map((a: any) => ({
        type: typeof a?.type === "string" ? a.type : String(a?.type ?? a?.name ?? "Unknown"),
        pros: ensureStringArray(a?.pros ?? a?.advantages, []),
        cons: ensureStringArray(a?.cons ?? a?.disadvantages, []),
      }))
    : [];

  const considerations = ensureStringArray(
    data.considerations ?? data.notes ?? data.tips,
    ["Consult a Swedish business advisor for personalized guidance"]
  );

  return {
    recommendedType,
    reasoning,
    alternatives,
    considerations,
  };
}

async function callOpenRouter(
  messages: Array<{ role: string; content: string }>,
  apiKey: string
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://robin.app",
      "X-Title": "Robin Business Builder",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content in API response");
  }

  return content;
}

export async function assessBusinessType(
  businessDescription: string,
  businessName: string,
  marketResearchSummary: string,
  apiKey: string
): Promise<BusinessTypeResponse | BusinessTypeError> {
  if (!businessDescription.trim()) {
    return { success: false, error: "Business description cannot be empty" };
  }

  if (!apiKey) {
    return { success: false, error: "OpenRouter API key is required" };
  }

  const userPrompt = `Recommend the best Swedish business entity type for this business:

Business name: ${businessName}
Business idea: ${businessDescription}
Market context: ${marketResearchSummary}`;

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const raw = await callOpenRouter(messages, apiKey);
      const cleaned = extractJSON(raw);
      const parsed = JSON.parse(cleaned);
      const data = validateAndNormalize(parsed);
      return { success: true, data };
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown error occurred";

      if (errorMsg.startsWith("OpenRouter API error")) {
        return { success: false, error: errorMsg };
      }

      if (attempt < MAX_RETRIES - 1) {
        messages.push(
          { role: "assistant", content: "(invalid response)" },
          { role: "user", content: RETRY_PROMPT }
        );
        continue;
      }

      return {
        success: false,
        error: `Failed after ${MAX_RETRIES} attempts. Last error: ${errorMsg}`,
      };
    }
  }

  return { success: false, error: "Unexpected: exhausted retries" };
}
