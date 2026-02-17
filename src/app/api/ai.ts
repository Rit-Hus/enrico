import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, ChatMessage, Task, TaskPriority, TaskType, StrategicAnalysis } from "../types";
import { BUSINESS_KNOWLEDGE_BASE } from "../data/businessKnowledge";
import { STOCKHOLM_MARKET_DATA, GLOBAL_SEO_BENCHMARKS } from "../data/stockholmMarketData";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction to guide the persona
const SYSTEM_INSTRUCTION = `
You are an experienced, supportive **Business Strategist**. 
Your goal is to help the user clarify their vision and succeed.

**CORE PRINCIPLES:**
1. **Be Supportive but Grounded**: Encourage their ambition, but gently point out risks (e.g., "That's a great vision! To make it safe, maybe we start with...").
2. **Focus on Clarity**: If an idea is vague, ask guiding questions to help them define it (e.g., "Who do you picture using this first?").
3. **Stage-Appropriate Advice**: 
   - **Idea Stage**: Focus on low-cost validation.
   - **Growth Stage**: Focus on scaling and systems.
4. **Compliance as Protection**: Frame rules/taxes not as "threats" but as "foundations for safety" so they can grow without worry.
5. **Next Stage Strategy**: 
   - Help them identify what they need next: Marketing (Growth), Production (Capacity), or Freedom (Systems).

Reference the Knowledge Base for facts, but deliver them kindly:
${BUSINESS_KNOWLEDGE_BASE}
`;

const ONBOARDING_SYSTEM_INSTRUCTION = `
You are a friendly and curious Startup Advisor.
Your goal is to understand the user's business idea through conversation.

**OBJECTIVES:**
1. **Gather Info**: Gently ask about their Industry, Target Audience, Product, Budget, and Scope (Local vs Online).
2. **Summarize & Reflect**: Frequently summarize what you've heard to show you understand (e.g., "So you want to build a local bakery in SÃ¶dermalm, starting small?").
3. **Identify Stage**: Based on their answers, identify if they are in "Idea Phase", "Validation Phase", or "Growth Phase".

**TONE:**
- Conversational and encouraging.
- Ask 1-2 questions at a time. Do not overwhelm them.
- If they don't know an answer, suggest a common option to help them deciding.
`;

export const sendOnboardingMessage = async (
    history: ChatMessage[],
    message: string
): Promise<string> => {
    try {
        const fullPrompt = `
      Conversation History:
      ${history.map(h => `${h.role}: ${h.text}`).join('\n')}

      User's latest input: ${message}

      Respond as the Friendly Advisor.
      1. Acknowledge what they said.
      2. If you have enough info (Industry, Audience, Product), summarize their current stage and ask if they are ready to generate a plan.
      3. If missing info, ask a follow-up question gently.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: fullPrompt,
            config: {
                systemInstruction: ONBOARDING_SYSTEM_INSTRUCTION,
            }
        });

        return response.text || "I'm listening. Tell me more.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble connecting. Please check your internet or API key.";
    }
};

export const extractProfileFromHistory = async (
    history: ChatMessage[]
): Promise<BusinessProfile> => {
    const prompt = `
    Analyze the conversation and extract a Business Profile.
    Infer "Local" vs "National".
    
    If the user hasn't defined a specific niche yet, use "General (Needs Focus)" for Industry.

    Conversation:
    ${history.map(h => `${h.role}: ${h.text}`).join('\n')}
  `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    industry: { type: Type.STRING },
                    targetAudience: { type: Type.STRING },
                    productType: { type: Type.STRING },
                    budget: { type: Type.STRING },
                    launchDate: { type: Type.STRING, description: "A future date, default to 3 months from now if unknown" },
                    businessType: { type: Type.STRING, enum: ["New Startup", "Existing Business"] },
                    targetRegion: { type: Type.STRING, enum: ["Local", "National", "Global"] },
                    websiteUrl: { type: Type.STRING, nullable: true }
                },
                required: ["industry", "targetAudience", "productType", "budget", "launchDate", "businessType", "targetRegion"]
            }
        }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
}

export const generateStrategicAnalysis = async (
    profile: BusinessProfile,
    history: ChatMessage[]
): Promise<StrategicAnalysis> => {

    // Inject the specific mock data based on industry keyword
    let marketContext = "";
    if (profile.targetRegion === 'Local') {
        const key = Object.keys(STOCKHOLM_MARKET_DATA).find(k => profile.industry.toLowerCase().includes(k)) || "cafe";
        const data = STOCKHOLM_MARKET_DATA[key as keyof typeof STOCKHOLM_MARKET_DATA];
        marketContext = `LOCAL MARKET DATA (Stockholm): ${JSON.stringify(data)}`;
    } else {
        marketContext = `SEO BENCHMARKS: ${JSON.stringify(GLOBAL_SEO_BENCHMARKS)}`;
    }

    const prompt = `
    Generate a Strategic Business Overview.
    
    Profile: ${JSON.stringify(profile)}
    Knowledge Base: ${BUSINESS_KNOWLEDGE_BASE}
    Market Intelligence Data: ${marketContext}

    Requirements:
    1. **Elevator Pitch**: A professional, concise summary of their business.
    2. **Unfair Advantage**: Identify a strength (or suggest one they should build).
    3. **Current Focus**: "Validation", "Growth", or "Efficiency".
    4. **Compliance Risks**: Friendly warnings about what they need to watch out for (permits, taxes).
    5. **Website Score**: Audit their digital readiness.
    6. **Market Intelligence**: Summarize the competition level.

    Return JSON matching the schema.
  `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    elevatorPitch: { type: Type.STRING },
                    unfairAdvantage: { type: Type.STRING },
                    currentFocus: { type: Type.STRING },
                    complianceRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    websiteScore: {
                        type: Type.OBJECT,
                        properties: {
                            score: { type: Type.NUMBER },
                            critique: { type: Type.STRING }
                        }
                    },
                    marketIntelligence: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ["SEO", "LOCAL"] },
                            summary: { type: Type.STRING },
                            metrics: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        label: { type: Type.STRING },
                                        value: { type: Type.STRING },
                                        trend: { type: Type.STRING, enum: ["up", "down", "neutral"] }
                                    }
                                }
                            },
                            topCompetitors: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
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

        // Construct a history-aware prompt
        const fullPrompt = `
      ${contextPrompt}
      
      Conversation History:
      ${history.map(h => `${h.role}: ${h.text}`).join('\n')}
      
      User's latest input: ${message}
      
      Respond as the Supportive Business Strategist.
      - Answer their questions clearly.
      - If they propose an idea, validate it first, then suggest improvements.
      - If they talk about spending, kindly ask if they've validated the need first (to save them money).
      
      If they seem ready for the next stage, offer choices: Marketing (Get more), Production (Handle more), or Freedom (Work less/Delegate).
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: fullPrompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });

        return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Gemini API Error:", error);
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
      ${chatHistory.slice(-15).map(h => h.text).join('\n')}
      
      REQUIREMENTS:
      1. **Theme**: Select a single theme (e.g., "Validation Sprint", "Legal Foundation", "Growth: Marketing", "Growth: Hiring").
      2. **Task Count**: EXACTLY 3-5 tasks.
      3. **Content**:
         - **Context Aware**: If the user is shifting focus (e.g. from Validation to Marketing), generate new tasks that REPLACE the old validation tasks.
         - **No Duplicates**: Do not suggest tasks that are already in the 'Current Active Tasks' list unless they are critical and need reiteration.
         - Provide clear, encouraging steps.
         
      Return JSON.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        theme: { type: Type.STRING, description: "The overarching theme of these tasks" },
                        analysis: {
                            type: Type.STRING,
                            description: "Brief reasoning for this focus area. Explain why we are prioritizing these over old tasks."
                        },
                        tasks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    priority: { type: Type.STRING, enum: [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW] },
                                    type: { type: Type.STRING, enum: [TaskType.VALIDATION, TaskType.ACQUISITION, TaskType.CONVERSION, TaskType.ADMIN, TaskType.PRODUCT] }
                                },
                                required: ["title", "description", "priority", "type"]
                            }
                        }
                    },
                    required: ["theme", "analysis", "tasks"]
                }
            }
        });

        const text = response.text || "{}";
        const parsed = JSON.parse(text);

        // Map to internal Task interface (add IDs)
        const mappedTasks = (parsed.tasks || []).slice(0, 5).map((item: any) => ({
            id: crypto.randomUUID(),
            title: item.title,
            description: item.description,
            priority: item.priority,
            type: item.type,
            theme: parsed.theme,
            status: 'todo'
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