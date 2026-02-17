export interface MarketResearch {
  marketSummary: {
    overview: string;
    estimatedMarketSize: string;
    growthTrend: "growing" | "stable" | "declining";
    keyInsights: string[];
  };
  keyCompetitors: Array<{
    name: string;
    description: string;
    strengths: string[];
    estimatedPriceRange: string;
  }>;
  targetAudience: {
    primarySegment: string;
    demographics: string;
    painPoints: string[];
    buyingBehavior: string;
  };
  marketViabilityScore: {
    overall: number; // 1-10
    demandLevel: number; // 1-10
    competitionIntensity: number; // 1-10
    barrierToEntry: number; // 1-10
    profitPotential: number; // 1-10
    reasoning: string;
  };
  pricingBenchmark: {
    low: string;
    median: string;
    high: string;
    currency: string;
  };
  opportunities: string[];
  risks: string[];
  recommendations: string[];
}

export interface MarketResearchRequest {
  businessDescription: string;
}

export interface MarketResearchResponse {
  success: true;
  data: MarketResearch;
}

export interface MarketResearchError {
  success: false;
  error: string;
}
