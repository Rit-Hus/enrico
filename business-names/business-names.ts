import type {
  BusinessNameSuggestions,
  BusinessNameResponse,
  BusinessNameError,
} from "./types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-4-5";
const MAX_RETRIES = 2;

const JSON_SCHEMA = `{
  "names": [
    {
      "name": "<string: the business name>",
      "reasoning": "<string: 1 sentence explaining why this name works>"
    }
  ]
}`;

const SYSTEM_PROMPT = `You are a creative brand naming expert specializing in Scandinavian and international business names. Given a business idea and market context, suggest exactly 5 unique, memorable business names.

CRITICAL: You MUST respond with ONLY a raw JSON object. No markdown. No code fences. No explanation. No text before or after. JUST the JSON.

The JSON MUST use EXACTLY this structure:

${JSON_SCHEMA}

STRICT RULES:
- Suggest EXACTLY 5 names in the "names" array
- Each name should be distinct in style (e.g., one modern/tech, one Swedish, one playful, one professional, one descriptive)
- Names should be easy to pronounce, spell, and remember
- Consider availability as a domain name and social media handle
- Each "reasoning" should be 1 concise sentence explaining why the name fits the business
- Names should feel appropriate for the Swedish/Nordic market unless the business is explicitly international
- Do NOT use generic names like "BusinessPro" or "TechSolutions"`;

const RETRY_PROMPT = `Your previous response did NOT match the required schema. Return ONLY a JSON object with a "names" array containing exactly 5 objects, each with "name" and "reasoning" string fields. No markdown, no explanation.`;

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

function validateAndNormalize(raw: unknown): BusinessNameSuggestions {
  const data = raw as Record<string, any>;

  const names = data.names ?? data.suggestions ?? data.options;
  if (!Array.isArray(names) || names.length === 0) {
    throw new Error("Missing or invalid 'names' array");
  }

  const normalized = names.slice(0, 5).map((item: any) => ({
    name: typeof item?.name === "string" ? item.name : String(item?.name ?? "Unknown"),
    reasoning: typeof item?.reasoning === "string" ? item.reasoning : String(item?.reasoning ?? item?.reason ?? item?.description ?? ""),
  }));

  if (normalized.length < 5) {
    throw new Error(`Expected 5 names, got ${normalized.length}`);
  }

  return { names: normalized };
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
      temperature: 0.7,
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

export async function suggestBusinessNames(
  businessDescription: string,
  marketResearchSummary: string,
  apiKey: string
): Promise<BusinessNameResponse | BusinessNameError> {
  if (!businessDescription.trim()) {
    return { success: false, error: "Business description cannot be empty" };
  }

  if (!apiKey) {
    return { success: false, error: "OpenRouter API key is required" };
  }

  const userPrompt = `Suggest 5 business names for this idea:

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
