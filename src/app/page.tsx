"use client";

import { useState } from "react";
import Button from "@/components/Button";

interface MarketResearch {
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
		overall: number;
		demandLevel: number;
		competitionIntensity: number;
		barrierToEntry: number;
		profitPotential: number;
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

interface BusinessNameSuggestions {
	names: Array<{
		name: string;
		reasoning: string;
	}>;
}

interface BusinessTypeAssessment {
	recommendedType: string;
	reasoning: string;
	alternatives: Array<{
		type: string;
		pros: string[];
		cons: string[];
	}>;
	considerations: string[];
}

type AppView =
	| "form"
	| "ready"
	| "loading"
	| "results"
	| "error"
	| "naming-loading"
	| "naming"
	| "business-type"
	| "business-type-loading"
	| "business-type-results";

function ScoreBar({ label, value }: { label: string; value: number }) {
	const percentage = (value / 10) * 100;
	const color =
		value >= 7
			? "bg-emerald-500"
			: value >= 4
				? "bg-amber-500"
				: "bg-red-500";

	return (
		<div className="space-y-1">
			<div className="flex justify-between text-sm">
				<span className="text-[#794b9b]">{label}</span>
				<span className="font-bold text-[#160d1c] dark:text-white">
					{value}/10
				</span>
			</div>
			<div className="h-2 bg-primary/10 dark:bg-primary/5 rounded-full overflow-hidden">
				<div
					className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

function GrowthBadge({ trend }: { trend: "growing" | "stable" | "declining" }) {
	const config = {
		growing: {
			bg: "bg-emerald-100 dark:bg-emerald-900/40",
			text: "text-emerald-700 dark:text-emerald-300",
			icon: "\u2191",
			label: "Growing",
		},
		stable: {
			bg: "bg-blue-100 dark:bg-blue-900/40",
			text: "text-blue-700 dark:text-blue-300",
			icon: "\u2192",
			label: "Stable",
		},
		declining: {
			bg: "bg-red-100 dark:bg-red-900/40",
			text: "text-red-700 dark:text-red-300",
			icon: "\u2193",
			label: "Declining",
		},
	};

	const c = config[trend];
	return (
		<span
			className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}
		>
			{c.icon} {c.label}
		</span>
	);
}

export default function Home() {
	const [view, setView] = useState<AppView>("form");
	const [idea, setIdea] = useState("");
	const [ideaError, setIdeaError] = useState("");
	const [researchData, setResearchData] = useState<MarketResearch | null>(
		null,
	);
	const [errorMessage, setErrorMessage] = useState("");
	const [nameSuggestions, setNameSuggestions] =
		useState<BusinessNameSuggestions | null>(null);
	const [selectedName, setSelectedName] = useState("");
	const [customName, setCustomName] = useState("");
	const [useCustomName, setUseCustomName] = useState(false);
	const [businessTypeData, setBusinessTypeData] =
		useState<BusinessTypeAssessment | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!idea.trim()) {
			setIdeaError("Please describe your idea");
			return;
		}
		if (idea.trim().length < 20) {
			setIdeaError("Please provide more details (at least 20 characters)");
			return;
		}
		setIdeaError("");
		setView("ready");
	};

	const startResearch = async () => {
		setView("loading");
		try {
			const response = await fetch("/chat/market-research", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ businessDescription: idea }),
			});

			const result = await response.json();

			if (result.success && result.data) {
				setResearchData(result.data);
				setView("results");
			} else {
				setErrorMessage(
					result.error || "Something went wrong. Please try again.",
				);
				setView("error");
			}
		} catch (err) {
			console.error("Market research error:", err);
			setErrorMessage("Failed to connect. Please try again later.");
			setView("error");
		}
	};

	const getMarketSummaryText = (): string => {
		if (!researchData) return "";
		return `Market: ${researchData.marketSummary.overview} Size: ${researchData.marketSummary.estimatedMarketSize}. Viability: ${researchData.marketViabilityScore.overall}/10.`;
	};

	const startNameSuggestions = async () => {
		setView("naming-loading");
		try {
			const response = await fetch("/chat/business-names", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					businessDescription: idea,
					marketResearchSummary: getMarketSummaryText(),
				}),
			});

			const result = await response.json();

			if (result.success && result.data) {
				setNameSuggestions(result.data);
				setSelectedName(result.data.names[0]?.name ?? "");
				setView("naming");
			} else {
				setErrorMessage(
					result.error || "Something went wrong. Please try again.",
				);
				setView("error");
			}
		} catch (err) {
			console.error("Business names error:", err);
			setErrorMessage("Failed to connect. Please try again later.");
			setView("error");
		}
	};

	const getChosenName = (): string => {
		return useCustomName ? customName : selectedName;
	};

	const startBusinessTypeAnalysis = async () => {
		setView("business-type-loading");
		try {
			const response = await fetch("/chat/business-type", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					businessDescription: idea,
					businessName: getChosenName(),
					marketResearchSummary: getMarketSummaryText(),
				}),
			});

			const result = await response.json();

			if (result.success && result.data) {
				setBusinessTypeData(result.data);
				setView("business-type-results");
			} else {
				setErrorMessage(
					result.error || "Something went wrong. Please try again.",
				);
				setView("error");
			}
		} catch (err) {
			console.error("Business type error:", err);
			setErrorMessage("Failed to connect. Please try again later.");
			setView("error");
		}
	};

	return (
		<div className="min-h-screen bg-background-light dark:bg-background-dark">
			{/* Header */}
			<header className="border-b border-primary/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<img src="/logo.png" alt="Logo" className="h-12 object-contain" />
						{view !== "form" && (
							<button
								onClick={() => {
									setView("form");
									setIdea("");
									setResearchData(null);
									setErrorMessage("");
									setNameSuggestions(null);
									setSelectedName("");
									setCustomName("");
									setUseCustomName(false);
									setBusinessTypeData(null);
								}}
								className="text-[#794b9b] hover:text-primary transition-colors text-sm"
							>
								Start Over
							</button>
						)}
					</div>
				</nav>
			</header>

			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				{/* -- FORM VIEW -- */}
				{view === "form" && (
					<>
						<div className="text-center mb-12">
							<h2 className="font-poppins text-[38px] leading-[1.1] font-bold text-[#160d1c] dark:text-white mb-6">
								Start Your Company
								<span className="block text-primary">
									With Confidence
								</span>
							</h2>
							<p className="text-lg font-medium text-[#794b9b] max-w-2xl mx-auto">
								Share your business idea and get AI-powered market research
								to validate your startup.
							</p>
						</div>

						<div
							className="max-w-2xl mx-auto bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8 lg:p-10"
							style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
						>
							<div className="mb-8">
								<h3 className="text-2xl sm:text-3xl font-bold text-[#160d1c] dark:text-white mb-2">
									Tell Us About Your Idea
								</h3>
								<p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
									Describe your business idea and we&apos;ll research the
									market for you.
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="w-full">
									<label className="block text-sm font-medium text-[#160d1c] dark:text-white mb-2">
										Your Business Idea
									</label>
									<textarea
										placeholder="Describe your business idea in detail. What problem does it solve? Who are your customers? What makes it unique?"
										value={idea}
										onChange={(e) => {
											setIdea(e.target.value);
											if (ideaError) setIdeaError("");
										}}
										required
										rows={6}
										className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none
											${ideaError ? "border-red-500 focus:ring-red-500" : "border-primary/20"}
											bg-white dark:bg-[#251630] text-[#160d1c] dark:text-white placeholder:text-[#794b9b]/50`}
									/>
									{ideaError && (
										<p className="mt-1 text-sm text-red-500">{ideaError}</p>
									)}
								</div>
								<div className="pt-4">
									<Button
										type="submit"
										variant="primary"
										size="lg"
										fullWidth
									>
										Continue
									</Button>
								</div>
							</form>
						</div>
					</>
				)}

				{/* -- READY VIEW -- */}
				{view === "ready" && (
					<div className="max-w-2xl mx-auto text-center">
						<div className="mb-8">
							<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
								<svg
									className="w-10 h-10 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-[#160d1c] dark:text-white mb-4">
								Ready to Research Your Market
							</h2>
							<p className="text-lg font-medium text-[#794b9b] mb-2">
								We&apos;ll analyze the market for your business idea.
							</p>
						</div>

						<div
							className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8 mb-8 text-left"
							style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
						>
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-3">
								Your Business Idea
							</h3>
							<p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
								{idea}
							</p>
						</div>

						<div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
							<h3 className="font-semibold text-[#160d1c] dark:text-white mb-2">
								What you&apos;ll get:
							</h3>
							<ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 text-left max-w-md mx-auto">
								<li className="flex items-start gap-2">
									<span className="text-primary mt-0.5">
										&#10003;
									</span>
									Market overview &amp; estimated size
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-0.5">
										&#10003;
									</span>
									Key competitors analysis
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-0.5">
										&#10003;
									</span>
									Target audience profiling
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-0.5">
										&#10003;
									</span>
									Market viability scoring
								</li>
								<li className="flex items-start gap-2">
									<span className="text-primary mt-0.5">
										&#10003;
									</span>
									Pricing benchmarks &amp; recommendations
								</li>
							</ul>
						</div>

						<Button
							onClick={startResearch}
							variant="primary"
							size="lg"
							fullWidth
						>
							Start Market Research
						</Button>
					</div>
				)}

				{/* -- LOADING VIEW -- */}
				{view === "loading" && (
					<div className="max-w-lg mx-auto text-center py-20">
						{/* Animated pulsing rings */}
						<div className="relative w-32 h-32 mx-auto mb-10">
							<div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping opacity-20" />
							<div
								className="absolute inset-3 rounded-full border-4 border-primary/20 animate-ping opacity-20"
								style={{ animationDelay: "0.5s" }}
							/>
							<div
								className="absolute inset-6 rounded-full border-4 border-primary/20 animate-ping opacity-20"
								style={{ animationDelay: "1s" }}
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-16 h-16 rounded-full bg-primary animate-pulse flex items-center justify-center">
									<svg
										className="w-8 h-8 text-white animate-spin"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
								</div>
							</div>
						</div>

						<h2 className="text-2xl sm:text-3xl font-bold text-[#160d1c] dark:text-white mb-4">
							Analyzing Your Market
						</h2>
						<p className="text-[#794b9b] mb-8">
							Our AI is researching competitors, market trends, and
							opportunities for your business idea. This may take a minute.
						</p>

						{/* Progress steps */}
						<div className="space-y-3 text-left max-w-xs mx-auto">
							{[
								"Scanning market landscape",
								"Identifying competitors",
								"Profiling target audience",
								"Calculating viability scores",
								"Generating recommendations",
							].map((step, i) => (
								<div
									key={step}
									className="flex items-center gap-3 text-sm text-[#794b9b] animate-pulse"
									style={{ animationDelay: `${i * 0.3}s` }}
								>
									<div className="w-2 h-2 rounded-full bg-primary" />
									{step}
								</div>
							))}
						</div>
					</div>
				)}

				{/* -- ERROR VIEW -- */}
				{view === "error" && (
					<div className="max-w-lg mx-auto text-center py-20">
						<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-red-600 dark:text-red-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-[#160d1c] dark:text-white mb-3">
							Something Went Wrong
						</h2>
						<p className="text-[#794b9b] mb-8">
							{errorMessage}
						</p>
						<div className="flex gap-4 justify-center">
							<Button onClick={startResearch} variant="primary" size="lg">
								Try Again
							</Button>
							<Button
								onClick={() => setView("ready")}
								variant="outline"
								size="lg"
							>
								Go Back
							</Button>
						</div>
					</div>
				)}

				{/* -- RESULTS VIEW -- */}
				{view === "results" && researchData && (
					<div className="space-y-8">
						{/* Results Header */}
						<div className="text-center mb-4">
							<h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-[#160d1c] dark:text-white mb-2">
								Market Research Results
							</h2>
						</div>

						{/* Viability Score - Hero Card */}
						<div
							className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8"
							style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
						>
							<div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
								<div className="relative w-28 h-28 flex-shrink-0">
									<svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
										<circle
											cx="60"
											cy="60"
											r="52"
											fill="none"
											stroke="currentColor"
											className="text-primary/10"
											strokeWidth="12"
										/>
										<circle
											cx="60"
											cy="60"
											r="52"
											fill="none"
											stroke="url(#scoreGradient)"
											strokeWidth="12"
											strokeLinecap="round"
											strokeDasharray={`${(researchData.marketViabilityScore.overall / 10) * 327} 327`}
										/>
										<defs>
											<linearGradient
												id="scoreGradient"
												x1="0%"
												y1="0%"
												x2="100%"
												y2="100%"
											>
												<stop offset="0%" stopColor="#9719f0" />
												<stop offset="100%" stopColor="#9719f0" />
											</linearGradient>
										</defs>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-3xl font-bold tracking-tighter text-[#160d1c] dark:text-white">
											{researchData.marketViabilityScore.overall}
										</span>
										<span className="text-sm text-[#794b9b]">
											/10
										</span>
									</div>
								</div>
								<div className="text-center sm:text-left">
									<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white mb-1">
										Market Viability Score
									</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
										{researchData.marketViabilityScore.reasoning}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<ScoreBar
									label="Demand Level"
									value={researchData.marketViabilityScore.demandLevel}
								/>
								<ScoreBar
									label="Profit Potential"
									value={researchData.marketViabilityScore.profitPotential}
								/>
								<ScoreBar
									label="Competition Intensity"
									value={researchData.marketViabilityScore.competitionIntensity}
								/>
								<ScoreBar
									label="Barrier to Entry"
									value={researchData.marketViabilityScore.barrierToEntry}
								/>
							</div>
						</div>

						{/* Market Summary */}
						<div
							className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8"
							style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
						>
							<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white mb-4">
								Market Summary
							</h3>
							<p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
								{researchData.marketSummary.overview}
							</p>
							<div className="flex flex-wrap gap-3 mb-4">
								<div className="px-4 py-2 bg-primary/5 dark:bg-primary/10 rounded-lg">
									<span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 block">
										Est. Market Size
									</span>
									<span className="font-semibold text-[#160d1c] dark:text-white">
										{researchData.marketSummary.estimatedMarketSize}
									</span>
								</div>
								<div className="px-4 py-2 bg-primary/5 dark:bg-primary/10 rounded-lg">
									<span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 block">
										Growth Trend
									</span>
									<GrowthBadge
										trend={researchData.marketSummary.growthTrend}
									/>
								</div>
							</div>
							{researchData.marketSummary.keyInsights.length > 0 && (
								<div>
									<h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-2">
										Key Insights
									</h4>
									<ul className="space-y-2">
										{researchData.marketSummary.keyInsights.map(
											(insight, i) => (
												<li
													key={i}
													className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
												>
													<span className="text-primary mt-1 flex-shrink-0">
														&#8226;
													</span>
													{insight}
												</li>
											),
										)}
									</ul>
								</div>
							)}
						</div>

						{/* Target Audience & Pricing - Side by Side */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Target Audience */}
							<div
								className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8"
								style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
							>
								<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white mb-4">
									Target Audience
								</h3>
								<div className="space-y-4">
									<div>
										<span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
											Primary Segment
										</span>
										<p className="text-[#160d1c] dark:text-white font-medium">
											{researchData.targetAudience.primarySegment}
										</p>
									</div>
									<div>
										<span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
											Demographics
										</span>
										<p className="text-sm text-slate-700 dark:text-slate-300">
											{researchData.targetAudience.demographics}
										</p>
									</div>
									<div>
										<span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
											Buying Behavior
										</span>
										<p className="text-sm text-slate-700 dark:text-slate-300">
											{researchData.targetAudience.buyingBehavior}
										</p>
									</div>
									<div>
										<span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
											Pain Points
										</span>
										<ul className="mt-1 space-y-1">
											{researchData.targetAudience.painPoints.map(
												(point, i) => (
													<li
														key={i}
														className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
													>
														<span className="text-red-400 mt-0.5">!</span>
														{point}
													</li>
												),
											)}
										</ul>
									</div>
								</div>
							</div>

							{/* Pricing Benchmark */}
							<div
								className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8"
								style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
							>
								<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white mb-4">
									Pricing Benchmark
								</h3>
								<div className="space-y-4">
									<div className="flex items-end gap-4">
										<div className="flex-1 text-center">
											<div className="h-20 bg-primary/10 dark:bg-primary/5 rounded-t-lg flex items-end justify-center pb-2">
												<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													{researchData.pricingBenchmark.low}
												</span>
											</div>
											<span className="text-xs text-[#794b9b] mt-1 block">
												Low
											</span>
										</div>
										<div className="flex-1 text-center">
											<div className="h-32 bg-primary rounded-t-lg flex items-end justify-center pb-2">
												<span className="text-sm font-semibold text-white">
													{researchData.pricingBenchmark.median}
												</span>
											</div>
											<span className="text-xs text-[#794b9b] mt-1 block">
												Median
											</span>
										</div>
										<div className="flex-1 text-center">
											<div className="h-24 bg-primary/10 dark:bg-primary/5 rounded-t-lg flex items-end justify-center pb-2">
												<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
													{researchData.pricingBenchmark.high}
												</span>
											</div>
											<span className="text-xs text-[#794b9b] mt-1 block">
												High
											</span>
										</div>
									</div>
									<p className="text-xs text-[#794b9b] text-center">
										Currency: {researchData.pricingBenchmark.currency}
									</p>
								</div>
							</div>
						</div>

						{/* Competitors */}
						{researchData.keyCompetitors.length > 0 && (
							<div
								className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8"
								style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
							>
								<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white mb-4">
									Key Competitors
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{researchData.keyCompetitors.map((competitor, i) => (
										<div
											key={i}
											className="border border-primary/10 rounded-xl p-4"
										>
											<div className="flex justify-between items-start mb-2">
												<h4 className="font-semibold text-[#160d1c] dark:text-white">
													{competitor.name}
												</h4>
												<span className="text-xs px-2 py-1 bg-primary/5 dark:bg-primary/10 rounded-full text-[#794b9b]">
													{competitor.estimatedPriceRange}
												</span>
											</div>
											<p className="text-sm text-slate-500 dark:text-slate-400 leading-snug mb-3">
												{competitor.description}
											</p>
											<div className="flex flex-wrap gap-1">
												{competitor.strengths.map((s, j) => (
													<span
														key={j}
														className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full"
													>
														{s}
													</span>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Opportunities, Risks, Recommendations */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Opportunities */}
							<div
								className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6"
								style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
							>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
										<span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
											+
										</span>
									</div>
									<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white">
										Opportunities
									</h3>
								</div>
								<ul className="space-y-2">
									{researchData.opportunities.map((opp, i) => (
										<li
											key={i}
											className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
										>
											<span className="text-emerald-500 mt-0.5 flex-shrink-0">
												&#10003;
											</span>
											{opp}
										</li>
									))}
								</ul>
							</div>

							{/* Risks */}
							<div
								className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6"
								style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
							>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
										<span className="text-red-600 dark:text-red-400 text-sm font-bold">
											!
										</span>
									</div>
									<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white">
										Risks
									</h3>
								</div>
								<ul className="space-y-2">
									{researchData.risks.map((risk, i) => (
										<li
											key={i}
											className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
										>
											<span className="text-red-400 mt-0.5 flex-shrink-0">
												&#8226;
											</span>
											{risk}
										</li>
									))}
								</ul>
							</div>

							{/* Recommendations */}
							<div
								className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6"
								style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
							>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
										<span className="text-primary text-sm font-bold">
											&#9733;
										</span>
									</div>
									<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white">
										Recommendations
									</h3>
								</div>
								<ul className="space-y-2">
									{researchData.recommendations.map((rec, i) => (
										<li
											key={i}
											className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
										>
											<span className="text-primary mt-0.5 flex-shrink-0">
												{i + 1}.
											</span>
											{rec}
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Next Step */}
						<div className="text-center pt-4">
							<Button
								onClick={startNameSuggestions}
								variant="primary"
								size="lg"
							>
								Next: Choose a Business Name
							</Button>
						</div>
					</div>
				)}
				{/* -- NAMING LOADING VIEW -- */}
				{view === "naming-loading" && (
					<div className="max-w-lg mx-auto text-center py-20">
						<div className="relative w-32 h-32 mx-auto mb-10">
							<div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping opacity-20" />
							<div
								className="absolute inset-3 rounded-full border-4 border-primary/20 animate-ping opacity-20"
								style={{ animationDelay: "0.5s" }}
							/>
							<div
								className="absolute inset-6 rounded-full border-4 border-primary/20 animate-ping opacity-20"
								style={{ animationDelay: "1s" }}
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-16 h-16 rounded-full bg-primary animate-pulse flex items-center justify-center">
									<svg
										className="w-8 h-8 text-white animate-spin"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
								</div>
							</div>
						</div>

						<h2 className="text-2xl sm:text-3xl font-bold text-[#160d1c] dark:text-white mb-4">
							Brainstorming Business Names
						</h2>
						<p className="text-[#794b9b] mb-8">
							Our AI is crafting unique, memorable name ideas for your
							business. This should only take a moment.
						</p>

						<div className="space-y-3 text-left max-w-xs mx-auto">
							{[
								"Analyzing your brand identity",
								"Considering market positioning",
								"Crafting creative options",
								"Checking name availability trends",
								"Finalizing suggestions",
							].map((step, i) => (
								<div
									key={step}
									className="flex items-center gap-3 text-sm text-[#794b9b] animate-pulse"
									style={{ animationDelay: `${i * 0.3}s` }}
								>
									<div className="w-2 h-2 rounded-full bg-primary" />
									{step}
								</div>
							))}
						</div>
					</div>
				)}

				{/* -- NAMING VIEW -- */}
				{view === "naming" && nameSuggestions && (
					<div className="max-w-2xl mx-auto">
						<div className="text-center mb-8">
							<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
								<svg
									className="w-10 h-10 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
									/>
								</svg>
							</div>
							<h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-[#160d1c] dark:text-white mb-2">
								Choose Your Business Name
							</h2>
							<p className="text-lg font-medium text-[#794b9b]">
								Select one of our AI-generated suggestions or enter your
								own.
							</p>
						</div>

						<div className="space-y-3 mb-6">
							{nameSuggestions.names.map((suggestion, i) => (
								<button
									key={i}
									onClick={() => {
										setSelectedName(suggestion.name);
										setUseCustomName(false);
									}}
									className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
										!useCustomName &&
										selectedName === suggestion.name
											? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
											: "border-primary/10 bg-white dark:bg-white/5 hover:border-primary/30"
									}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
												!useCustomName &&
												selectedName === suggestion.name
													? "border-primary"
													: "border-primary/30"
											}`}
										>
											{!useCustomName &&
												selectedName === suggestion.name && (
													<div className="w-3 h-3 rounded-full bg-primary" />
												)}
										</div>
										<div>
											<span className="font-semibold text-[#160d1c] dark:text-white text-lg">
												{suggestion.name}
											</span>
											<p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
												{suggestion.reasoning}
											</p>
										</div>
									</div>
								</button>
							))}
						</div>

						{/* Custom name input */}
						<div className="bg-white dark:bg-white/5 rounded-xl border-2 border-primary/10 p-4 mb-8">
							<div className="flex items-center gap-3 mb-3">
								<button
									onClick={() => setUseCustomName(true)}
									className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
										useCustomName
											? "border-primary"
											: "border-primary/30"
									}`}
								>
									{useCustomName && (
										<div className="w-3 h-3 rounded-full bg-primary" />
									)}
								</button>
								<span className="font-medium text-[#160d1c] dark:text-white">
									Use my own name
								</span>
							</div>
							<input
								type="text"
								placeholder="Enter your business name..."
								value={customName}
								onChange={(e) => {
									setCustomName(e.target.value);
									setUseCustomName(true);
								}}
								onFocus={() => setUseCustomName(true)}
								className="w-full px-4 py-2.5 border border-primary/20 rounded-lg bg-white dark:bg-[#251630] text-[#160d1c] dark:text-white placeholder:text-[#794b9b]/50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
							/>
						</div>

						<Button
							onClick={() => setView("business-type")}
							variant="primary"
							size="lg"
							fullWidth
							disabled={
								useCustomName
									? !customName.trim()
									: !selectedName
							}
						>
							Next
						</Button>
					</div>
				)}

				{/* -- BUSINESS TYPE VIEW -- */}
				{view === "business-type" && (
					<div className="max-w-2xl mx-auto text-center">
						<div className="mb-8">
							<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
								<svg
									className="w-10 h-10 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							</div>
							<h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-[#160d1c] dark:text-white mb-4">
								Assess Business Type
							</h2>
							<p className="text-lg font-medium text-[#794b9b] mb-2">
								Let our AI recommend the best Swedish business entity
								type for{" "}
								<span className="font-semibold text-[#160d1c] dark:text-white">
									{getChosenName()}
								</span>
								.
							</p>
						</div>

						<div
							className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8 mb-8 text-left"
							style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
						>
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-4">
								We&apos;ll compare these Swedish entity types:
							</h3>
							<div className="space-y-3">
								{[
									{
										abbr: "Enskild firma",
										desc: "Sole proprietorship - simplest form, personal liability",
									},
									{
										abbr: "HB",
										desc: "Handelsbolag - trading partnership with personal liability",
									},
									{
										abbr: "KB",
										desc: "Kommanditbolag - limited partnership",
									},
									{
										abbr: "AB",
										desc: "Aktiebolag - limited company with share capital",
									},
									{
										abbr: "Ekonomisk forening",
										desc: "Economic association / cooperative",
									},
								].map((type) => (
									<div
										key={type.abbr}
										className="flex items-start gap-3 text-sm"
									>
										<span className="font-semibold text-primary min-w-[120px]">
											{type.abbr}
										</span>
										<span className="text-slate-500 dark:text-slate-400">
											{type.desc}
										</span>
									</div>
								))}
							</div>
						</div>

						<Button
							onClick={startBusinessTypeAnalysis}
							variant="primary"
							size="lg"
							fullWidth
						>
							Analyse Business Type
						</Button>
					</div>
				)}

				{/* -- BUSINESS TYPE LOADING VIEW -- */}
				{view === "business-type-loading" && (
					<div className="max-w-lg mx-auto text-center py-20">
						<div className="relative w-32 h-32 mx-auto mb-10">
							<div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping opacity-20" />
							<div
								className="absolute inset-3 rounded-full border-4 border-primary/20 animate-ping opacity-20"
								style={{ animationDelay: "0.5s" }}
							/>
							<div
								className="absolute inset-6 rounded-full border-4 border-primary/20 animate-ping opacity-20"
								style={{ animationDelay: "1s" }}
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-16 h-16 rounded-full bg-primary animate-pulse flex items-center justify-center">
									<svg
										className="w-8 h-8 text-white animate-spin"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
								</div>
							</div>
						</div>

						<h2 className="text-2xl sm:text-3xl font-bold text-[#160d1c] dark:text-white mb-4">
							Analysing Business Type
						</h2>
						<p className="text-[#794b9b] mb-8">
							Our AI is evaluating the best Swedish entity type for your
							business. This should only take a moment.
						</p>

						<div className="space-y-3 text-left max-w-xs mx-auto">
							{[
								"Evaluating liability requirements",
								"Checking capital needs",
								"Comparing tax implications",
								"Assessing governance structure",
								"Preparing recommendation",
							].map((step, i) => (
								<div
									key={step}
									className="flex items-center gap-3 text-sm text-[#794b9b] animate-pulse"
									style={{ animationDelay: `${i * 0.3}s` }}
								>
									<div className="w-2 h-2 rounded-full bg-primary" />
									{step}
								</div>
							))}
						</div>
					</div>
				)}

				{/* -- BUSINESS TYPE RESULTS VIEW -- */}
				{view === "business-type-results" && businessTypeData && (
					<div className="space-y-8">
						<div className="text-center mb-4">
							<h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-[#160d1c] dark:text-white mb-2">
								Business Type Recommendation
							</h2>
							<p className="text-[#794b9b]">
								For{" "}
								<span className="font-semibold text-[#160d1c] dark:text-white">
									{getChosenName()}
								</span>
							</p>
						</div>

						{/* Recommended Type - Hero Card */}
						<div className="bg-primary rounded-2xl shadow-xl shadow-primary/20 p-6 sm:p-8 text-white">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
									<svg
										className="w-6 h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div>
									<span className="text-sm font-medium text-primary/60 text-white/60 uppercase tracking-wider">
										Recommended
									</span>
									<h3 className="text-2xl sm:text-3xl font-bold">
										{businessTypeData.recommendedType}
									</h3>
								</div>
							</div>
							<p className="text-white/80 leading-relaxed">
								{businessTypeData.reasoning}
							</p>
						</div>

						{/* Alternatives */}
						{businessTypeData.alternatives.length > 0 && (
							<div
								className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8"
								style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
							>
								<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white mb-4">
									Alternative Options
								</h3>
								<div className="space-y-4">
									{businessTypeData.alternatives.map(
										(alt, i) => (
											<div
												key={i}
												className="border border-primary/10 rounded-xl p-4"
											>
												<h4 className="font-semibold text-[#160d1c] dark:text-white mb-3">
													{alt.type}
												</h4>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<div>
														<span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
															Pros
														</span>
														<ul className="mt-1 space-y-1">
															{alt.pros.map(
																(pro, j) => (
																	<li
																		key={j}
																		className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
																	>
																		<span className="text-emerald-500 mt-0.5 flex-shrink-0">
																			&#10003;
																		</span>
																		{pro}
																	</li>
																),
															)}
														</ul>
													</div>
													<div>
														<span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
															Cons
														</span>
														<ul className="mt-1 space-y-1">
															{alt.cons.map(
																(con, j) => (
																	<li
																		key={j}
																		className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
																	>
																		<span className="text-red-400 mt-0.5 flex-shrink-0">
																			&#8226;
																		</span>
																		{con}
																	</li>
																),
															)}
														</ul>
													</div>
												</div>
											</div>
										),
									)}
								</div>
							</div>
						)}

						{/* Considerations */}
						{businessTypeData.considerations.length > 0 && (
							<div
								className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6 sm:p-8"
								style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
							>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
										<span className="text-amber-600 dark:text-amber-400 text-sm font-bold">
											!
										</span>
									</div>
									<h3 className="text-lg font-bold tracking-tight text-[#160d1c] dark:text-white">
										Important Considerations
									</h3>
								</div>
								<ul className="space-y-2">
									{businessTypeData.considerations.map(
										(item, i) => (
											<li
												key={i}
												className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
											>
												<span className="text-amber-500 mt-0.5 flex-shrink-0">
													{i + 1}.
												</span>
												{item}
											</li>
										),
									)}
								</ul>
							</div>
						)}
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className="border-t border-primary/10 mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<p className="text-center text-[#794b9b]/70">
						&copy; 2026 Helping entrepreneurs build their dreams.
					</p>
				</div>
			</footer>
		</div>
	);
}
