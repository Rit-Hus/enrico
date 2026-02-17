import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, ChatMessage, Task, TaskPriority, TaskType, StrategicAnalysis } from "../types";
import { BUSINESS_KNOWLEDGE_BASE } from "../data/businessKnowledge";
import { STOCKHOLM_MARKET_DATA, GLOBAL_SEO_BENCHMARKS } from "../data/stockholmMarketData";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- MODULE 1: ONBOARDING ---
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

export const sendOnboardingMessage = async (
  history: ChatMessage[],
  message: string
): Promise<string> => {
  try {
    const fullPrompt = `
      Conversation History:
      ${history.map(h => `${h.role}: ${h.text}`).join('\n')}

      User's latest input: ${message}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: ONBOARDING_SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I'm listening.";
  } catch (error) {
    console.error("Gemini API Error:", error);
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
          websiteUrl: { type: Type.STRING, nullable: true },
          goldenNuggets: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["industry", "targetAudience", "productType", "budget", "launchDate", "businessType", "targetRegion"]
      }
    }
  });
  
  const text = response.text || "{}";
  return JSON.parse(text);
}

// --- MODULE 2 & 3: STRATEGIC ANALYSIS ---
export const generateStrategicAnalysis = async (
  profile: BusinessProfile,
  history: ChatMessage[]
): Promise<StrategicAnalysis> => {
  
  // Inject mock data
  let marketContext = "";
  if (profile.targetRegion === 'Local') {
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

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0, // Critical for stability
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          elevatorPitch: { type: Type.STRING, description: "A concise summary of the business idea" },
          unfairAdvantage: { type: Type.STRING, description: "Extracted golden nuggets/skills" },
          currentFocus: { type: Type.STRING },
          complianceRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
          sanityCheck: { type: Type.STRING, description: "1-sentence realistic/brutal assessment" },
          
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
              topCompetitors: { type: Type.ARRAY, items: { type: Type.STRING } },
              inferredCompetitorCount: { type: Type.NUMBER },
              viabilityScore: { type: Type.NUMBER },
              marketGap: { type: Type.STRING },
              strategicPivot: {
                type: Type.OBJECT,
                properties: {
                   suggestedLocation: { type: Type.STRING },
                   reasoning: { type: Type.STRING }
                },
                nullable: true
              }
            }
          },

          suggestedNames: { type: Type.ARRAY, items: { type: Type.STRING } },
          legalStructure: { type: Type.STRING, enum: ["Aktiebolag", "Enskild Firma"] },
          legalReasoning: { type: Type.STRING },
          setupChecklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING },
                url: { type: Type.STRING }
              }
            }
          },

          financialFeasibility: {
            type: Type.OBJECT,
            properties: {
              estimatedStartupCost: { type: Type.NUMBER },
              monthlyBreakEvenRevenue: { type: Type.NUMBER },
              isAchievable: { type: Type.BOOLEAN },
              reasoning: { type: Type.STRING },
              financialAdvice: { type: Type.STRING }
            },
            required: ["estimatedStartupCost", "monthlyBreakEvenRevenue", "isAchievable", "reasoning"]
          }
        },
        required: ["elevatorPitch", "marketIntelligence", "financialFeasibility", "suggestedNames", "legalStructure"]
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