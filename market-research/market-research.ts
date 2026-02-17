import type {
  MarketResearch,
  MarketResearchResponse,
  MarketResearchError,
} from "./types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-4-5:online";
const MAX_RETRIES = 2;

const JSON_SCHEMA = `{
  "marketSummary": {
    "overview": "<string: 2-3 sentence market overview>",
    "estimatedMarketSize": "<string: e.g. 'SEK 500M locally'>",
    "growthTrend": "<string: EXACTLY one of 'growing', 'stable', 'declining'>",
    "keyInsights": ["<string>", "<string>", "<string>"]
  },
  "keyCompetitors": [
    {
      "name": "<string: real business name>",
      "description": "<string: what they do, 1 sentence>",
      "strengths": ["<string>", "<string>"],
      "estimatedPriceRange": "<string: e.g. '150-300 SEK/hour'>"
    }
  ],
  "targetAudience": {
    "primarySegment": "<string: e.g. 'Young professionals aged 25-40'>",
    "demographics": "<string: brief demographic description>",
    "painPoints": ["<string>", "<string>"],
    "buyingBehavior": "<string: how they typically buy this service>"
  },
  "marketViabilityScore": {
    "overall": "<integer 1-10>",
    "demandLevel": "<integer 1-10>",
    "competitionIntensity": "<integer 1-10>",
    "barrierToEntry": "<integer 1-10>",
    "profitPotential": "<integer 1-10>",
    "reasoning": "<string: 1-2 sentences explaining the scores>"
  },
  "pricingBenchmark": {
    "low": "<string: e.g. '100 SEK'>",
    "median": "<string: e.g. '200 SEK'>",
    "high": "<string: e.g. '350 SEK'>",
    "currency": "<string: e.g. 'SEK'>"
  },
  "opportunities": ["<string>", "<string>", "<string>"],
  "risks": ["<string>", "<string>", "<string>"],
  "recommendations": ["<string>", "<string>", "<string>"]
}`;

const SYSTEM_PROMPT = `You are a market research analyst. Given a business idea, perform concise market research using real web data.

CRITICAL: You MUST respond with ONLY a raw JSON object. No markdown. No code fences. No explanation. No text before or after. JUST the JSON.

The JSON MUST use EXACTLY these property names — do NOT rename, restructure, or add extra properties:

${JSON_SCHEMA}

STRICT RULES:
- The response must be a single JSON object, nothing else
- Use the EXACT property names shown above — not synonyms, not alternatives
- "marketSummary" MUST be an object with "overview", "estimatedMarketSize", "growthTrend", "keyInsights" — NOT a plain string
- "keyCompetitors" MUST be an array of objects each with "name", "description", "strengths", "estimatedPriceRange" — NOT "location", "weaknesses", "pricing"
- "targetAudience" MUST have "primarySegment", "demographics", "painPoints", "buyingBehavior" — NOT "primary", "secondary", "characteristics"
- "marketViabilityScore" MUST be an object with sub-scores — NOT a single number
- "pricingBenchmark" MUST have "low", "median", "high", "currency" — NOT "recommendedRange" or "strategy"
- All scores are integers 1-10
- Keep arrays to 3-5 items
- Use local currency (SEK for Sweden, EUR for EU, etc.)
- Use REAL competitor names and price data from web search
- If location is unspecified, assume Sweden`;

const RETRY_PROMPT = `Your previous response did NOT match the required schema. Common mistakes:
- marketSummary was a string instead of an object with overview/estimatedMarketSize/growthTrend/keyInsights
- keyCompetitors items had wrong keys (location/weaknesses/pricing instead of description/strengths/estimatedPriceRange)
- targetAudience had wrong keys (primary/secondary instead of primarySegment/demographics/painPoints/buyingBehavior)
- marketViabilityScore was a number instead of an object with overall/demandLevel/competitionIntensity/barrierToEntry/profitPotential/reasoning
- pricingBenchmark had wrong keys (recommendedRange instead of low/median/high/currency)

Return ONLY the corrected JSON object using EXACTLY the property names from the schema. No markdown, no explanation.`;

function buildUserPrompt(businessDescription: string): string {
  return `Analyze this business idea and provide market research:\n\n${businessDescription}`;
}

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

const VALID_GROWTH_TRENDS = ["growing", "stable", "declining"] as const;

function clampScore(value: unknown): number {
  const n = Number(value);
  if (isNaN(n)) return 5;
  return Math.max(1, Math.min(10, Math.round(n)));
}

function ensureStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((v) => String(v));
}

function ensureString(value: unknown, fallback: string = ""): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

// Pick the first defined value from a list of candidates
function pickFirst(...candidates: unknown[]): unknown {
  return candidates.find((c) => c !== undefined && c !== null);
}

function validateAndNormalize(raw: unknown): MarketResearch {
  const data = raw as Record<string, any>;
  const errors: string[] = [];

  // --- marketSummary ---
  // Handle both correct (object) and wrong (string) formats
  let ms = data.marketSummary;
  if (typeof ms === "string") {
    ms = { overview: ms, estimatedMarketSize: "Unknown", growthTrend: "stable", keyInsights: [] };
  }
  if (!ms || typeof ms !== "object") errors.push("marketSummary");
  const marketSummary: MarketResearch["marketSummary"] = {
    overview: ensureString(ms?.overview ?? ms?.summary, "No overview available"),
    estimatedMarketSize: ensureString(
      pickFirst(ms?.estimatedMarketSize, ms?.marketSize, ms?.size),
      "Unknown"
    ),
    growthTrend: VALID_GROWTH_TRENDS.includes(ms?.growthTrend)
      ? ms.growthTrend
      : "stable",
    keyInsights: ensureStringArray(
      pickFirst(ms?.keyInsights, ms?.insights, ms?.key_insights),
      ["No insights available"]
    ),
  };

  // --- keyCompetitors ---
  const kc = data.keyCompetitors ?? data.competitors ?? data.key_competitors;
  if (!Array.isArray(kc) || kc.length === 0) errors.push("keyCompetitors");
  const keyCompetitors: MarketResearch["keyCompetitors"] = Array.isArray(kc)
    ? kc.map((c: any) => ({
        name: ensureString(c?.name, "Unknown competitor"),
        description: ensureString(
          pickFirst(c?.description, c?.about, c?.summary),
          "No description"
        ),
        strengths: ensureStringArray(
          pickFirst(c?.strengths, c?.advantages),
          []
        ),
        estimatedPriceRange: ensureString(
          pickFirst(c?.estimatedPriceRange, c?.priceRange, c?.pricing, c?.price_range),
          "Unknown"
        ),
      }))
    : [
        {
          name: "Unknown",
          description: "No competitor data available",
          strengths: [],
          estimatedPriceRange: "Unknown",
        },
      ];

  // --- targetAudience ---
  const ta = data.targetAudience ?? data.target_audience;
  if (!ta || typeof ta !== "object") errors.push("targetAudience");
  const targetAudience: MarketResearch["targetAudience"] = {
    primarySegment: ensureString(
      pickFirst(ta?.primarySegment, ta?.primary, ta?.primary_segment, ta?.segment),
      "General consumers"
    ),
    demographics: ensureString(
      pickFirst(ta?.demographics, ta?.characteristics, ta?.demographic),
      "Unknown"
    ),
    painPoints: ensureStringArray(
      pickFirst(ta?.painPoints, ta?.pain_points, ta?.challenges),
      []
    ),
    buyingBehavior: ensureString(
      pickFirst(ta?.buyingBehavior, ta?.buying_behavior, ta?.behavior),
      "Unknown"
    ),
  };

  // --- marketViabilityScore ---
  let mvs = data.marketViabilityScore ?? data.viabilityScore ?? data.viability;
  // Handle case where it's a single number instead of an object
  if (typeof mvs === "number") {
    mvs = {
      overall: mvs,
      demandLevel: 5,
      competitionIntensity: 5,
      barrierToEntry: 5,
      profitPotential: 5,
      reasoning: ensureString(
        pickFirst(data.marketViabilityReasoning, data.viabilityReasoning),
        "No reasoning provided"
      ),
    };
  }
  if (!mvs || typeof mvs !== "object") errors.push("marketViabilityScore");
  const marketViabilityScore: MarketResearch["marketViabilityScore"] = {
    overall: clampScore(mvs?.overall ?? mvs?.score ?? mvs?.total),
    demandLevel: clampScore(mvs?.demandLevel ?? mvs?.demand ?? mvs?.demand_level),
    competitionIntensity: clampScore(
      mvs?.competitionIntensity ?? mvs?.competition ?? mvs?.competition_intensity
    ),
    barrierToEntry: clampScore(
      mvs?.barrierToEntry ?? mvs?.barriers ?? mvs?.barrier_to_entry
    ),
    profitPotential: clampScore(
      mvs?.profitPotential ?? mvs?.profit ?? mvs?.profit_potential
    ),
    reasoning: ensureString(mvs?.reasoning ?? mvs?.explanation, "No reasoning provided"),
  };

  // --- pricingBenchmark ---
  const pb = data.pricingBenchmark ?? data.pricing ?? data.pricing_benchmark;
  if (!pb || typeof pb !== "object") errors.push("pricingBenchmark");
  const pricingBenchmark: MarketResearch["pricingBenchmark"] = {
    low: ensureString(pickFirst(pb?.low, pb?.min, pb?.minimum), "Unknown"),
    median: ensureString(pickFirst(pb?.median, pb?.mid, pb?.average, pb?.recommendedRange), "Unknown"),
    high: ensureString(pickFirst(pb?.high, pb?.max, pb?.maximum), "Unknown"),
    currency: ensureString(pb?.currency, "SEK"),
  };

  // --- arrays ---
  const opportunities = ensureStringArray(
    data.opportunities ?? data.opportunity,
    ["No data available"]
  );
  const risks = ensureStringArray(
    data.risks ?? data.risk ?? data.threats,
    ["No data available"]
  );
  const recommendations = ensureStringArray(
    data.recommendations ?? data.recommendation ?? data.suggestions,
    ["No data available"]
  );

  // Only error if a WHOLE section is completely absent (not just renamed)
  if (errors.length > 0) {
    throw new Error(`Missing or invalid sections: ${errors.join(", ")}`);
  }

  return {
    marketSummary,
    keyCompetitors,
    targetAudience,
    marketViabilityScore,
    pricingBenchmark,
    opportunities,
    risks,
    recommendations,
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
      max_tokens: 2048,
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

export async function performMarketResearch(
  businessDescription: string,
  apiKey: string
): Promise<MarketResearchResponse | MarketResearchError> {
  if (!businessDescription.trim()) {
    return { success: false, error: "Business description cannot be empty" };
  }

  if (!apiKey) {
    return { success: false, error: "OpenRouter API key is required" };
  }

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(businessDescription) },
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

      // If it's an API-level error (auth, credits, network), don't retry
      if (errorMsg.startsWith("OpenRouter API error")) {
        return { success: false, error: errorMsg };
      }

      // On parse/validation failure, retry with correction prompt
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
