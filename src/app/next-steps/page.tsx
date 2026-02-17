"use client";

import { useState } from "react";
import Link from "next/link";

interface StepDetail {
	title: string;
	bulletPoints: string[];
}

interface NextStep {
	id: number;
	step: string;
	description: string;
	url?: string;
	completed: boolean;
	details: StepDetail;
}

// Sample data with LLM-generated details
const initialSteps: NextStep[] = [
	{
		id: 1,
		step: "Register your business",
		description:
			"Register with Bolagsverket to establish your business entity.",
		url: "https://bolagsverket.se",
		completed: false,
		details: {
			title: "How to Register Your Business",
			bulletPoints: [
				"Choose your business structure (aktiebolag, enskild firma, handelsbolag)",
				"Prepare required documents: valid ID, business plan, and ownership details",
				"Visit Bolagsverket's website and complete the online registration form",
				"Pay the registration fee (approximately 1,000-1,400 SEK depending on business type)",
				"Wait 2-5 business days for approval and registration confirmation",
				"Receive your organizational number (organisationsnummer) by mail",
			],
		},
	},
	{
		id: 2,
		step: "Get F-tax approval",
		description: "Apply for F-skattsedel through Skatteverket to invoice clients.",
		url: "https://skatteverket.se",
		completed: false,
		details: {
			title: "F-tax Approval Process",
			bulletPoints: [
				"Ensure your business is registered with Bolagsverket first",
				"Log in to Skatteverket's e-service 'Mina sidor företag' with BankID",
				"Navigate to 'Skattekonto' and select 'Ansök om F-skatt'",
				"Fill out form SKV 4620 with your business information",
				"Submit required documentation (business registration certificate)",
				"Approval typically takes 4-6 weeks; you'll receive confirmation by mail",
			],
		},
	},
	{
		id: 3,
		step: "Open business bank account",
		description:
			"Set up banking with SEB, Nordea, or Handelsbanken for your business finances.",
		completed: false,
		details: {
			title: "Opening a Business Bank Account",
			bulletPoints: [
				"Research banks: Compare SEB, Nordea, Handelsbanken, and Swedbank for fees and services",
				"Book an in-person appointment at your chosen bank (required for business accounts)",
				"Bring required documents: business registration, organizational number, valid ID, F-tax certificate",
				"Discuss monthly fees and transaction costs (typically 200-500 SEK/month)",
				"Set up digital banking access (BankID, Swish for businesses)",
				"Order payment terminal if accepting card payments (additional monthly cost)",
			],
		},
	},
	{
		id: 4,
		step: "Secure location lease",
		description:
			"Visit Åkersberga and schedule property viewings for your restaurant space.",
		completed: false,
		details: {
			title: "Finding Your Restaurant Location",
			bulletPoints: [
				"Contact local real estate agents in Åkersberga specializing in commercial properties",
				"Search online platforms: Blocket, Hemnet Företag, and Fastighetsbyrån",
				"Visit Åkersberga to assess foot traffic in different neighborhoods",
				"Calculate space needs: 60-100 sqm for a small restaurant (15-30 seats)",
				"Negotiate lease terms: typically 3-5 year contracts with 3-6 month deposits required",
				"Review lease carefully for restrictions on food service, ventilation, and modifications",
				"Budget for monthly rent: expect 8,000-15,000 SEK/month in Åkersberga",
			],
		},
	},
	{
		id: 5,
		step: "Apply for permits",
		description:
			"Contact local municipality for food service and alcohol permits if needed.",
		completed: false,
		details: {
			title: "Required Permits and Licenses",
			bulletPoints: [
				"Food service permit: Contact environmental department (miljö- och hälsoskydd) at Österåker kommun",
				"Schedule inspection of your premises by health inspector before opening",
				"Complete food safety course (Livsmedelshygien) - required for all food handlers",
				"If serving alcohol: Apply for alcohol license (alkoholtillstånd) 4-6 months in advance",
				"Budget for alcohol license: 10,000-25,000 SEK application fee plus annual renewal costs",
				"Signage permit (skyltlov) if installing outdoor signs - check with building department",
				"Outdoor seating permit (serveringstillstånd) if planning a patio - requires separate application",
			],
		},
	},
];

export default function NextStepsPage() {
	const [steps, setSteps] = useState<NextStep[]>(initialSteps);
	const [expandedStep, setExpandedStep] = useState<number | null>(null);

	const toggleStep = (stepId: number) => {
		setExpandedStep(expandedStep === stepId ? null : stepId);
	};

	const toggleComplete = (stepId: number) => {
		setSteps(
			steps.map((step) =>
				step.id === stepId ? { ...step, completed: !step.completed } : step,
			),
		);
	};

	const completedCount = steps.filter((step) => step.completed).length;
	const totalCount = steps.length;
	const progressPercentage = (completedCount / totalCount) * 100;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Robin
						</h1>
						<div className="flex gap-4">
							<Link
								href="/"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
							>
								← Back to Home
							</Link>
						</div>
					</div>
				</nav>
			</header>

			{/* Page Header */}
			<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl sm:text-5xl font-bold mb-4">
						✓ Next Steps
					</h2>
					<p className="text-xl text-blue-100 mb-6">
						Your personalized business roadmap
					</p>

					{/* Progress Indicator */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium text-white/90">
								Progress
							</span>
							<span className="text-sm font-medium text-white">
								{completedCount} of {totalCount} completed
							</span>
						</div>
						<div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
							<div
								className="h-full bg-green-400 transition-all duration-500 ease-out rounded-full"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<div className="space-y-4">
					{steps.map((step, index) => (
						<div
							key={step.id}
							className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border ${
								step.completed
									? "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10"
									: "border-gray-200 dark:border-gray-700"
							} ${expandedStep === step.id ? "ring-2 ring-blue-500" : ""}`}
						>
							{/* Step Header */}
							<div
								className="p-5 sm:p-6 cursor-pointer"
								onClick={() => toggleStep(step.id)}
							>
								<div className="flex items-center gap-4">
									{/* Checkbox */}
									<div
										className="flex-shrink-0"
										onClick={(e) => e.stopPropagation()}
									>
										<input
											type="checkbox"
											id={`step-${step.id}`}
											checked={step.completed}
											onChange={() => toggleComplete(step.id)}
											className="w-6 h-6 rounded-md border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer transition-all"
										/>
									</div>

									{/* Step Number Badge */}
									<div
										className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
											step.completed
												? "bg-gradient-to-br from-green-400 to-green-600 text-white"
												: "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
										}`}
									>
										{index + 1}
									</div>

									{/* Step Info */}
									<div className="flex-1 min-w-0">
										<h3
											className={`text-lg sm:text-xl font-semibold mb-1 ${
												step.completed
													? "text-gray-600 dark:text-gray-400"
													: "text-gray-900 dark:text-white"
											}`}
										>
											{step.step}
										</h3>
										<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
											{step.description}
										</p>
										{step.url && expandedStep !== step.id && (
											<a
												href={step.url}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
											>
												Visit Website →
											</a>
										)}
									</div>

									{/* Expand Icon */}
									<div className="flex-shrink-0">
										<div
											className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
												expandedStep === step.id
													? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
													: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
											}`}
										>
											<span className="text-2xl font-light">
												{expandedStep === step.id ? "−" : "+"}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Expanded Details */}
							{expandedStep === step.id && (
								<div className="border-t border-gray-200 dark:border-gray-700 p-5 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
									<div className="ml-0 sm:ml-16">
										<h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
											{step.details.title}
										</h4>
										<ul className="space-y-3">
											{step.details.bulletPoints.map((point, idx) => (
												<li
													key={idx}
													className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
												>
													<span className="text-green-600 dark:text-green-400 font-bold flex-shrink-0 mt-0.5">
														→
													</span>
													<span className="text-sm sm:text-base leading-relaxed">
														{point}
													</span>
												</li>
											))}
										</ul>
										{step.url && (
											<a
												href={step.url}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
											>
												Visit{" "}
												{step.url
													.replace("https://", "")
													.replace("www.", "")}{" "}
												→
											</a>
										)}
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Completion Message */}
				{completedCount === totalCount && (
					<div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl text-center">
						<div className="text-5xl mb-3">🎉</div>
						<h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
							Congratulations!
						</h3>
						<p className="text-green-700 dark:text-green-400">
							You&apos;ve completed all steps. Your business is ready to launch!
						</p>
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className="border-t border-gray-200 dark:border-gray-700 mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<p className="text-center text-gray-600 dark:text-gray-400">
						© 2026 Robin. Helping entrepreneurs build their dreams.
					</p>
				</div>
			</footer>
		</div>
	);
}
