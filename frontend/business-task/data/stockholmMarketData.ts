// This acts as a simulated "MCP" database or external API for market data.
// In a real app, this would be an API call to a business registry or map service.

export interface DistrictData {
  district: string;
  activeShops: number;
  openedLastYear: number;
  closedLastYear: number;
  avgRevenue: string;
  saturationLevel: 'Low' | 'Medium' | 'High' | 'Oversaturated';
}

export const STOCKHOLM_MARKET_DATA: Record<string, DistrictData[]> = {
  "bakery": [
    { district: "Södermalm", activeShops: 45, openedLastYear: 8, closedLastYear: 6, avgRevenue: "3.2M SEK", saturationLevel: "High" },
    { district: "Östermalm", activeShops: 32, openedLastYear: 2, closedLastYear: 1, avgRevenue: "5.5M SEK", saturationLevel: "Medium" },
    { district: "Vasastan", activeShops: 38, openedLastYear: 5, closedLastYear: 3, avgRevenue: "4.1M SEK", saturationLevel: "High" },
    { district: "Solna", activeShops: 12, openedLastYear: 4, closedLastYear: 0, avgRevenue: "2.8M SEK", saturationLevel: "Low" }
  ],
  "tattoo": [
    { district: "Södermalm", activeShops: 28, openedLastYear: 10, closedLastYear: 8, avgRevenue: "1.8M SEK", saturationLevel: "Oversaturated" },
    { district: "City", activeShops: 15, openedLastYear: 2, closedLastYear: 2, avgRevenue: "3.5M SEK", saturationLevel: "Medium" },
    { district: "Bromma", activeShops: 3, openedLastYear: 1, closedLastYear: 0, avgRevenue: "1.2M SEK", saturationLevel: "Low" }
  ],
  "cafe": [
    { district: "Södermalm", activeShops: 120, openedLastYear: 25, closedLastYear: 20, avgRevenue: "2.5M SEK", saturationLevel: "Oversaturated" },
    { district: "Kungsholmen", activeShops: 55, openedLastYear: 8, closedLastYear: 5, avgRevenue: "3.1M SEK", saturationLevel: "High" }
  ]
};

export const GLOBAL_SEO_BENCHMARKS = {
  "saas": { difficulty: "Very High", avgBacklinksNeeded: 200, topCompetitorTraffic: "500k/mo" },
  "ecommerce": { difficulty: "High", avgBacklinksNeeded: 50, topCompetitorTraffic: "1M/mo" },
  "service": { difficulty: "Medium", avgBacklinksNeeded: 20, topCompetitorTraffic: "50k/mo" }
};
