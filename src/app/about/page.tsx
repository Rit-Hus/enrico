export default function AboutPage() {
	return (
		<div className="min-h-screen bg-background-light dark:bg-background-dark">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-4xl font-medium text-[#14332D] dark:text-white mb-6">
					About Enrico
				</h1>
				<div
					className="bg-white dark:bg-white/5 rounded border border-primary/10 p-8"
					style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
				>
					<p className="text-lg text-[#14332D]/60 mb-4">
						Enrico is a full-stack Next.js application demonstrating modern web
						development practices.
					</p>
					<p className="text-[#14332D]/60">
						The project includes frontend pages, backend API routes, and is
						fully responsive for mobile devices.
					</p>
				</div>
			</div>
		</div>
	);
}
