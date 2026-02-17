export default function AboutPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
					About Robin-2
				</h1>
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
					<p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
						This is a full-stack Next.js application demonstrating modern web
						development practices.
					</p>
					<p className="text-gray-600 dark:text-gray-300">
						The project includes frontend pages, backend API routes, and is
						fully responsive for mobile devices.
					</p>
				</div>
			</div>
		</div>
	);
}
