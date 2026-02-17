import type { ChatMessage, Module1Result } from "./types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const MODEL = process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4-5";

if (!API_KEY) throw new Error("Missing OPENROUTER_API_KEY in .env.local");

const GLOBAL_RULES = `
### GLOBAL RULES (apply to all responses)
- NO GLAZING: Do not use words like "fantastic," "amazing," or "congratulations." Stay professional and grounded.
- LANGUAGE: Always respond in the same language the user writes in.
`.trim();

const SYSTEM_MODULE_1 = `
${GLOBAL_RULES}

### ROLE
You are a minimalist Business Discovery Assistant.

### GOAL
Gather three specific data points:
1. Business Idea
2. Key Facts (User skills, heritage, assets)
3. Target Area (City/Region)

### RULES
1. STERN CONSTRAINT: Maximum 2 short sentences per response.
2. ONE AT A TIME: Ask for one piece of information at a time.
3. NO IDEA FALLBACK: If the user has no business idea, ask for their skills and location first, then suggest exactly 2 concrete local service business ideas in one sentence each. Let them choose before continuing.
4. TRIGGER: Once all 3 points are collected, output ONLY this — nothing else:
   SUMMARY: [Business Idea] | [Key Facts] | [Target Area]
   Ready. Click 'Market Research' to continue.

### TONE
Direct, efficient, and professional.
`.trim();

async function callOpenRouter(systemPrompt: string, messages: ChatMessage[], temperature = 0): Promise<string> {
  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") throw new Error("Bad OpenRouter response shape");
  return content;
}

export async function sendOnboardingMessage(history: ChatMessage[], message: string): Promise<Module1Result> {
  const messages: ChatMessage[] = [...history, { role: "user", content: message }];
  const assistantMessage = await callOpenRouter(SYSTEM_MODULE_1, messages, 0);

  const summaryLine = assistantMessage
    .split("\n")
    .find((l) => l.trim().startsWith("SUMMARY:"));

  if (summaryLine) {
    return {
      done: true,
      summary: summaryLine.replace(/^SUMMARY:\s*/i, "").trim(),
      assistantMessage,
    };
  }

  return { done: false, summary: null, assistantMessage };
}
