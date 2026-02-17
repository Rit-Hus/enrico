import { BusinessProfile, ChatMessage, Task, StrategicAnalysis } from "../types";

export const sendOnboardingMessage = async (
  history: ChatMessage[],
  message: string
): Promise<string> => {
  try {
    const response = await fetch("/api/ai/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, message })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch onboarding response");
    }

    const data = await response.json();
    return data.reply || "I'm listening.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. Please check your API key.";
  }
};

export const extractProfileFromHistory = async (
  history: ChatMessage[]
): Promise<BusinessProfile> => {
  try {
    const response = await fetch("/api/ai/extract-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history })
    });

    if (!response.ok) {
      throw new Error("Failed to extract profile");
    }

    return response.json();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      industry: "General (Needs Focus)",
      targetAudience: "",
      productType: "",
      budget: "",
      launchDate: "",
      businessType: "New Startup",
      targetRegion: "National",
      goldenNuggets: []
    };
  }
}

// --- MODULE 2 & 3: STRATEGIC ANALYSIS ---
export const generateStrategicAnalysis = async (
  profile: BusinessProfile,
  history: ChatMessage[]
): Promise<StrategicAnalysis> => {
  try {
    const response = await fetch("/api/ai/strategic-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, history })
    });

    if (!response.ok) {
      throw new Error("Failed to generate analysis");
    }

    return response.json();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      elevatorPitch: "",
      unfairAdvantage: "",
      currentFocus: "",
      complianceRisks: [],
      marketIntelligence: {
        type: "LOCAL",
        summary: "",
        metrics: [],
        topCompetitors: [],
        inferredCompetitorCount: 0,
        viabilityScore: 0,
        marketGap: ""
      },
      suggestedNames: [],
      legalStructure: "Aktiebolag",
      legalReasoning: "",
      setupChecklist: [],
      financialFeasibility: {
        estimatedStartupCost: 0,
        monthlyBreakEvenRevenue: 0,
        isAchievable: false,
        reasoning: ""
      }
    };
  }
};

export const sendMessageToGemini = async (
  history: ChatMessage[],
  profile: BusinessProfile,
  message: string
): Promise<string> => {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, profile, message })
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const data = await response.json();
    return data.reply || "I'm sorry, I couldn't generate a response.";
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
    const response = await fetch("/api/ai/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, chatHistory, currentTasks })
    });

    if (!response.ok) {
      throw new Error("Failed to generate tasks");
    }

    const data = await response.json();
    return {
      tasks: data.tasks || [],
      analysis: data.analysis || "Could not generate analysis."
    };
  } catch (error) {
    console.error("Task Generation Error:", error);
    return { tasks: [], analysis: "Could not generate analysis." };
  }
};