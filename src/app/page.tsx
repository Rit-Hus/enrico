import Link from "next/link";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
			{/* Header */}
			<header className="border-b border-primary/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<img src="/logo.png" alt="Enrico" className="h-12 object-contain" />
					</div>
				</nav>
			</header>

			{/* Hero */}
			<main className="flex-1 flex flex-col">
				<section className="flex-1 flex items-center">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 w-full">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
							{/* Left: Copy */}
							<div className="text-center lg:text-left">
								<p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-4">
									Your Business Journey Starts Here
								</p>
								<h1 className="font-poppins text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.08] font-semibold text-[#14332D] dark:text-white mb-6">
									Turn Your Vision
									<span className="block text-primary">Into a Thriving Business</span>
								</h1>
								<p className="text-base sm:text-lg text-[#14332D]/70 dark:text-white/70 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
									From idea to launch, Enrico guides you every step of the way.
									AI-powered market research, business naming, entity setup, and
									a daily operations dashboard &mdash; everything you need to
									build with confidence.
								</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
									<Link
										href="/start"
										className="inline-flex items-center justify-center gap-2 font-display rounded-full bg-primary text-white shadow-xl shadow-primary/20 font-medium hover:shadow-primary/40 transition-all duration-200 active:scale-95 px-8 py-4 text-lg"
									>
										Start Your Business Journey
										<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</Link>
								</div>
							</div>

							{/* Right: Visual */}
							<div className="relative">
								<div
									className="rounded-2xl border border-primary/10 overflow-hidden"
									style={{ boxShadow: "0 4px 24px -4px rgba(0,0,0,0.12)" }}
								>
									<img
										src="/business.jpg"
										alt="Team collaborating on a business idea"
										className="w-full h-auto object-cover"
									/>
								</div>
								{/* Floating accent card */}
								<div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-primary rounded-2xl shadow-xl shadow-primary/20 p-4 sm:p-5 text-white max-w-[180px] sm:max-w-[200px]">
									<div className="text-2xl sm:text-3xl font-bold tracking-tighter mb-1">AI-Powered</div>
									<p className="text-xs sm:text-sm text-white/70 leading-snug">
										Market insights in minutes, not weeks
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="border-t border-primary/10 bg-white/50 dark:bg-white/[0.02]">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
						<div className="text-center mb-12">
							<h2 className="font-poppins text-2xl sm:text-3xl font-medium text-[#14332D] dark:text-white mb-3">
								Everything You Need to Launch
							</h2>
							<p className="text-sm sm:text-base text-[#14332D]/60 dark:text-white/60 max-w-xl mx-auto">
								From validating your idea to running daily operations &mdash; one platform, zero guesswork.
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{[
								{
									icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
									title: "Market Research",
									desc: "Get AI-driven competitor analysis, audience profiling, and viability scoring for your idea.",
								},
								{
									icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
									title: "Business Naming",
									desc: "AI-generated brand names with reasoning, or bring your own — we support both.",
								},
								{
									icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
									title: "Entity Type Analysis",
									desc: "Comparison of Swedish business entities with a tailored recommendation for your case.",
								},
								{
									icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
									title: "Step-by-Step Checklist",
									desc: "Registration, permits, banking — a guided checklist to track every milestone.",
								},
								{
									icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
									title: "Daily Dashboard",
									desc: "Track revenue, expenses, tasks, and deadlines once your business is up and running.",
								},
								{
									icon: "M13 10V3L4 14h7v7l9-11h-7z",
									title: "Instant Insights",
									desc: "Powered by AI, your results are ready in minutes — not days or weeks.",
								},
							].map((feature) => (
								<div
									key={feature.title}
									className="bg-white dark:bg-white/5 rounded-2xl border border-primary/10 p-6"
									style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
								>
									<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
										<svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
										</svg>
									</div>
									<h3 className="font-medium text-[#14332D] dark:text-white mb-2">
										{feature.title}
									</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
										{feature.desc}
									</p>
								</div>
							))}
						</div>

						{/* Bottom CTA */}
						<div className="text-center mt-12">
							<Link
								href="/start"
								className="inline-flex items-center justify-center gap-2 font-display rounded-full bg-primary text-white shadow-xl shadow-primary/20 font-medium hover:shadow-primary/40 transition-all duration-200 active:scale-95 px-8 py-4 text-lg"
							>
								Get Started
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</Link>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-primary/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<p className="text-center text-[#14332D]/70">
						&copy; 2026 Helping entrepreneurs build their dreams.
					</p>
				</div>
			</footer>
		</div>
	);
}
