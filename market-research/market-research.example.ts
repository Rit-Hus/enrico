import { performMarketResearch } from "./market-research";

// Usage example
async function main() {
  const result = await performMarketResearch(
    "Bakery shop focusing on artisan sourdough breads, located in Södermalm, Stockholm. " +
      "Targeting local residents and nearby offices. Planning to offer subscription bread deliveries. " +
      "Not planning to scale globally, just a cozy neighborhood bakery.",
    process.env.OPENROUTER_API_KEY!
  );

  if (result.success) {
    console.log("Market Summary:", result.data.marketSummary.overview);
    console.log("Viability Score:", result.data.marketViabilityScore.overall, "/10");
    console.log("Competitors found:", result.data.keyCompetitors.length);
    console.log("\nFull result:");
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.error("Error:", result.error);
  }
}

main();
