import { BusinessProfile, ChatMessage, Task, TaskPriority, TaskType, StrategicAnalysis } from "../types";
import { BUSINESS_KNOWLEDGE_BASE } from "../data/businessKnowledge";
import { STOCKHOLM_MARKET_DATA, GLOBAL_SEO_BENCHMARKS } from "../data/stockholmMarketData";

const apiKey =
  process.env.OPENROUTER_API_KEY ||
  process.env.OpenRouter ||
  process.env.OPENROUTER ||
  "";
const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const ONBOARDING_SYSTEM_INSTRUCTION = `
### ROLE
You are a minimalist Business Discovery Assistant. 

### GOAL
Gather three specific data points: 
1. Business Idea
2. Key Facts (User skills, heritage, assets)
3. Target Area (City/Region)

### RULES
1. STERN CONSTRAINT: Maximum 2 short sentences per response. 
2. NO GLAZING: Do not use words like "fantastic," "amazing," or "congratulations." Stay professional and grounded.
3. ONE AT A TIME: Ask for one piece of information at a time.
4. TRIGGER: Once all 3 points are collected, summarize them in one line and say: "Ready. Click 'Market Research' to continue."

### TONE
Direct, efficient, and professional.
`;

const SYSTEM_INSTRUCTION = `
You are an experienced, supportive **Business Strategist**. 
Your goal is to help the user clarify their vision and succeed.
Reference the Knowledge Base for facts:
${BUSINESS_KNOWLEDGE_BASE}
`;

const callOpenRouter = async (messages: Array<{ role: string; content: string }>, options?: { json?: boolean; temperature?: number }) => {
  if (!apiKey) {
    throw new Error("OpenRouter API key is missing.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "BusinessTask AI"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.4,
      response_format: options?.json ? { type: "json_object" } : undefined
    })
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data?.error?.message || "OpenRouter request failed.";
    throw new Error(errorMessage);
  }

  return data?.choices?.[0]?.message?.content || "";
};

const callOpenRouterJson = async (messages: Array<{ role: string; content: string }>, options?: { temperature?: number }) => {
  const content = await callOpenRouter(messages, { json: true, temperature: options?.temperature });
  try {
    return JSON.parse(content);
  } catch (error) {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw error;
  }
};

export const sendOnboardingMessage = async (
  history: ChatMessage[],
  message: string
): Promise<string> => {
  try {
    const fullPrompt = `
      Conversation History:
      ${history.map(h => `${h.role}: ${h.text}`).join("\n")}

      User's latest input: ${message}
    `;

    const responseText = await callOpenRouter([
      { role: "system", content: ONBOARDING_SYSTEM_INSTRUCTION },
      { role: "user", content: fullPrompt }
    ], { temperature: 0.3 });

    return responseText || "I'm listening.";
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return "Connection error. Please check your API key.";
  }
};

export const extractProfileFromHistory = async (
  history: ChatMessage[]
): Promise<BusinessProfile> => {
  const prompt = `
    Analyze conversation to extract a Business Profile. 
    Look for 'Golden Nuggets' (heritage, unique skills, family secrets).
    Infer "Local" vs "National".
    
    If the user hasn't defined a specific niche yet, use "General (Needs Focus)" for Industry.

    Conversation:
    ${history.map(h => `${h.role}: ${h.text}`).join("\n")}
  `;

  const content = await callOpenRouterJson([
    { role: "system", content: "Return JSON only, no markdown." },
    { role: "user", content: prompt }
  ], { temperature: 0.2 });

  return content as BusinessProfile;
}

export const generateStrategicAnalysis = async (
  profile: BusinessProfile,
  history: ChatMessage[]
): Promise<StrategicAnalysis> => {
  let marketContext = "";
  if (profile.targetRegion === "Local") {
    const key = Object.keys(STOCKHOLM_MARKET_DATA).find(k => profile.industry.toLowerCase().includes(k)) || "cafe";
    const data = STOCKHOLM_MARKET_DATA[key as keyof typeof STOCKHOLM_MARKET_DATA];
    marketContext = `LOCAL MARKET DATA (Stockholm): ${JSON.stringify(data)}`;
  } else {
    marketContext = `SEO BENCHMARKS: ${JSON.stringify(GLOBAL_SEO_BENCHMARKS)}`;
  }

  const prompt = `
    You are acting as two experts simultaneously:
    1. "Eniro Market Intelligence Engine" (Module 2)
    2. "Senior Swedish Operations Consultant" (Module 3)

    ### CONTEXT
    Profile: ${JSON.stringify(profile)}
    Market Data: ${marketContext}
    Knowledge Base: ${BUSINESS_KNOWLEDGE_BASE}

    ### TASKS
    
    PART 1: MARKET INTELLIGENCE (Module 2)
    - Identify 'Golden Nuggets' from profile.
    - Infer competitor count based on Swedish demographics.
    - Calculate a viability score (0-100).
    - PIVOT LOGIC: If score < 60, suggest a specific nearby municipality (e.g., if Stockholm City is saturated, suggest Åkersberga) and explain why.
    - Sanity Check: One brutal/realistic sentence.

    PART 2: OPERATIONS & FINANCE (Module 3)
    - Suggest 3 brand names.
    - Legal: Recommend 'Aktiebolag' (AB) if >25k SEK capital, else 'Enskild Firma'.
    - Calculations:
      * Registration: 2,200 SEK.
      * Share Capital: 25,000 SEK (for AB).
      * Social Security: 31.42% on top of salaries.
      * VAT: 25% standard.
    - Setup Checklist: Generate specific links.

    ### OUTPUT
    Return a SINGLE JSON object matching the provided schema.
  `;

  const content = await callOpenRouterJson([
    { role: "system", content: "Return a single JSON object only. No markdown." },
    { role: "user", content: prompt }
  ], { temperature: 0 });

  return content as StrategicAnalysis;
};

export const sendMessageToGemini = async (
  history: ChatMessage[],
  profile: BusinessProfile,
  message: string
): Promise<string> => {
  try {
    const contextPrompt = `
      Current Business Context:
      Industry: ${profile.industry}
      Target Audience: ${profile.targetAudience}
      Product: ${profile.productType}
      Budget: ${profile.budget}
    `;

    const fullPrompt = `
      ${contextPrompt}
      
      Conversation History:
      ${history.map(h => `${h.role}: ${h.text}`).join("\n")}
      
      User's latest input: ${message}
      
      Respond as the Supportive Business Strategist.
      - Answer their questions clearly.
      - If they propose an idea, validate it first, then suggest improvements.
      - If they talk about spending, kindly ask if they've validated the need first (to save them money).
      
      If they seem ready for the next stage, offer choices: Marketing (Get more), Production (Handle more), or Freedom (Work less/Delegate).
    `;

    const responseText = await callOpenRouter([
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: fullPrompt }
    ], { temperature: 0.5 });

    return responseText || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return "Error connecting to AI assistant. Please check your API key.";
  }
};

export const generateTasksFromContext = async (
  profile: BusinessProfile,
  chatHistory: ChatMessage[],
  currentTasks: Task[]
): Promise<{ tasks: Task[], analysis: string }> => {
  try {
    const prompt = `
      Generate a strictly limited list of 3-5 actionable tasks based on the Business Profile and Knowledge Base.
      
      Business Profile: ${JSON.stringify(profile)}
      Knowledge Base: ${BUSINESS_KNOWLEDGE_BASE}
      Current Active Tasks: ${JSON.stringify(currentTasks.map(t => t.title))}
      
      Context:
      ${chatHistory.slice(-15).map(h => h.text).join("\n")}
      
      REQUIREMENTS:
      1. **Theme**: Select a single theme (e.g., "Validation Sprint", "Legal Foundation", "Growth: Marketing", "Growth: Hiring").
      2. **Task Count**: EXACTLY 3-5 tasks.
      3. **Content**:
         - **Context Aware**: If the user is shifting focus (e.g. from Validation to Marketing), generate new tasks that REPLACE the old validation tasks.
         - **No Duplicates**: Do not suggest tasks that are already in the 'Current Active Tasks' list unless they are critical and need reiteration.
         - Provide clear, encouraging steps.
         
      Return JSON.
    `;

    const parsed = await callOpenRouterJson([
      { role: "system", content: "Return JSON only, no markdown." },
      { role: "user", content: prompt }
    ], { temperature: 0.2 });
    
    const mappedTasks = (parsed.tasks || []).slice(0, 5).map((item: any) => ({
      id: crypto.randomUUID(),
      title: item.title,
      description: item.description,
      priority: item.priority,
      type: item.type,
      theme: parsed.theme,
      status: "todo"
    }));

    return {
      tasks: mappedTasks,
      analysis: `**Focus: ${parsed.theme}**\n\n${parsed.analysis}`
    };
  } catch (error) {
    console.error("Task Generation Error:", error);
    return { tasks: [], analysis: "Could not generate analysis." };
  }
};