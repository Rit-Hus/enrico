"use client";

import { useState } from "react";
import Link from "next/link";

interface BulletPoint {
	id: string;
	text: string;
	completed: boolean;
}

interface StepDetail {
	title: string;
	bulletPoints: BulletPoint[];
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
				{ id: "1-1", text: "Choose your business structure (aktiebolag, enskild firma, handelsbolag)", completed: false },
				{ id: "1-2", text: "Prepare required documents: valid ID, business plan, and ownership details", completed: false },
				{ id: "1-3", text: "Visit Bolagsverket's website and complete the online registration form", completed: false },
				{ id: "1-4", text: "Pay the registration fee (approximately 1,000-1,400 SEK depending on business type)", completed: false },
				{ id: "1-5", text: "Wait 2-5 business days for approval and registration confirmation", completed: false },
				{ id: "1-6", text: "Receive your organizational number (organisationsnummer) by mail", completed: false },
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
				{ id: "2-1", text: "Ensure your business is registered with Bolagsverket first", completed: false },
				{ id: "2-2", text: "Log in to Skatteverket's e-service 'Mina sidor företag' with BankID", completed: false },
				{ id: "2-3", text: "Navigate to 'Skattekonto' and select 'Ansök om F-skatt'", completed: false },
				{ id: "2-4", text: "Fill out form SKV 4620 with your business information", completed: false },
				{ id: "2-5", text: "Submit required documentation (business registration certificate)", completed: false },
				{ id: "2-6", text: "Approval typically takes 4-6 weeks; you'll receive confirmation by mail", completed: false },
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
				{ id: "3-1", text: "Research banks: Compare SEB, Nordea, Handelsbanken, and Swedbank for fees and services", completed: false },
				{ id: "3-2", text: "Book an in-person appointment at your chosen bank (required for business accounts)", completed: false },
				{ id: "3-3", text: "Bring required documents: business registration, organizational number, valid ID, F-tax certificate", completed: false },
				{ id: "3-4", text: "Discuss monthly fees and transaction costs (typically 200-500 SEK/month)", completed: false },
				{ id: "3-5", text: "Set up digital banking access (BankID, Swish for businesses)", completed: false },
				{ id: "3-6", text: "Order payment terminal if accepting card payments (additional monthly cost)", completed: false },
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
				{ id: "4-1", text: "Contact local real estate agents in Åkersberga specializing in commercial properties", completed: false },
				{ id: "4-2", text: "Search online platforms: Blocket, Hemnet Företag, and Fastighetsbyrån", completed: false },
				{ id: "4-3", text: "Visit Åkersberga to assess foot traffic in different neighborhoods", completed: false },
				{ id: "4-4", text: "Calculate space needs: 60-100 sqm for a small restaurant (15-30 seats)", completed: false },
				{ id: "4-5", text: "Negotiate lease terms: typically 3-5 year contracts with 3-6 month deposits required", completed: false },
				{ id: "4-6", text: "Review lease carefully for restrictions on food service, ventilation, and modifications", completed: false },
				{ id: "4-7", text: "Budget for monthly rent: expect 8,000-15,000 SEK/month in Åkersberga", completed: false },
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
				{ id: "5-1", text: "Food service permit: Contact environmental department (miljö- och hälsoskydd) at Österåker kommun", completed: false },
				{ id: "5-2", text: "Schedule inspection of your premises by health inspector before opening", completed: false },
				{ id: "5-3", text: "Complete food safety course (Livsmedelshygien) - required for all food handlers", completed: false },
				{ id: "5-4", text: "If serving alcohol: Apply for alcohol license (alkoholtillstånd) 4-6 months in advance", completed: false },
				{ id: "5-5", text: "Budget for alcohol license: 10,000-25,000 SEK application fee plus annual renewal costs", completed: false },
				{ id: "5-6", text: "Signage permit (skyltlov) if installing outdoor signs - check with building department", completed: false },
				{ id: "5-7", text: "Outdoor seating permit (serveringstillstånd) if planning a patio - requires separate application", completed: false },
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
			steps.map((step) => {
				if (step.id === stepId) {
					const newCompletedState = !step.completed;
					return {
						...step,
						completed: newCompletedState,
						details: {
							...step.details,
							bulletPoints: step.details.bulletPoints.map((bullet) => ({
								...bullet,
								completed: newCompletedState,
							})),
						},
					};
				}
				return step;
			}),
		);
	};

	const toggleBulletPoint = (stepId: number, bulletId: string) => {
		setSteps(
			steps.map((step) => {
				if (step.id === stepId) {
					const updatedBulletPoints = step.details.bulletPoints.map((bullet) =>
						bullet.id === bulletId
							? { ...bullet, completed: !bullet.completed }
							: bullet
					);
					
					// Check if all bullet points are completed
					const allBulletsCompleted = updatedBulletPoints.every(
						(bullet) => bullet.completed
					);
					
					return {
						...step,
						completed: allBulletsCompleted,
						details: {
							...step.details,
							bulletPoints: updatedBulletPoints,
						},
					};
				}
				return step;
			})
		);
	};

	const completedCount = steps.filter((step) => step.completed).length;
	const totalCount = steps.length;
	const progressPercentage = (completedCount / totalCount) * 100;

	return (
		<div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
								<span className="text-white font-bold text-sm">R</span>
							</div>
							<h1 className="text-2xl font-bold text-gray-900">Robin</h1>
						</div>
						<div className="flex gap-6 items-center">
							<Link
								href="/"
								className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
							>
								← Back to Home
							</Link>
						</div>
					</div>
				</nav>
			</header>

			{/* Page Header */}
			<div className="bg-white py-12 sm:py-16 border-b border-gray-200">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
						✓ Next Steps
					</h2>
					<p className="text-lg text-gray-600 mb-6">
						Your personalized business roadmap
					</p>

					{/* Progress Indicator */}
					<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium text-gray-700">
								Progress
							</span>
							<span className="text-sm font-medium text-gray-900">
								{completedCount} of {totalCount} completed
							</span>
						</div>
						<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
							<div
								className="h-full transition-all duration-500 ease-out rounded-full"
								style={{ 
									width: `${progressPercentage}%`,
									backgroundColor: '#5CB85C'
								}}
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
							className={`bg-white rounded-xl shadow-sm transition-all duration-200 border ${
								step.completed
									? "border-green-200 bg-green-50/30"
									: "border-gray-200"
							} ${expandedStep === step.id ? "shadow-md" : "hover:shadow-md"}`}
						>
							{/* Step Header */}
							<div
								className="p-5 sm:p-6 cursor-pointer"
								onClick={() => toggleStep(step.id)}
							>
								<div className="flex items-start gap-4">
									{/* Checkbox */}
									<div
										className="flex-shrink-0 mt-1"
										onClick={(e) => e.stopPropagation()}
									>
										<input
											type="checkbox"
											id={`step-${step.id}`}
											checked={step.completed}
											onChange={() => toggleComplete(step.id)}
											className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer transition-all"
										/>
									</div>

									{/* Step Number Badge */}
									<div
										className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white"
										style={{ backgroundColor: '#5CB85C' }}
									>
										{index + 1}
									</div>

									{/* Step Info */}
									<div className="flex-1 min-w-0">
										<h3
											className={`text-lg sm:text-xl font-semibold mb-1 ${
												step.completed
													? "text-gray-500"
													: "text-gray-900"
											}`}
										>
											{step.step}
										</h3>
										<p className="text-sm sm:text-base text-gray-600 leading-relaxed">
											{step.description}
										</p>
										{step.url && expandedStep !== step.id && (
											<a
												href={step.url}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												className="inline-block mt-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
											>
												Visit →
											</a>
										)}
									</div>

									{/* Expand Icon */}
									<div className="flex-shrink-0">
										<div
											className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
												expandedStep === step.id
													? "bg-gray-100 text-gray-700"
													: "bg-gray-50 text-gray-500 hover:bg-gray-100"
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
								<div className="border-t border-gray-200 p-5 sm:p-6 bg-gray-50">
									<div className="ml-0 sm:ml-16">
										<h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
											{step.details.title}
										</h4>
										<ul className="space-y-3">
											{step.details.bulletPoints.map((bullet) => (
												<li
													key={bullet.id}
													className="flex items-start gap-3"
												>
													<input
														type="checkbox"
														id={`bullet-${bullet.id}`}
														checked={bullet.completed}
														onChange={() => toggleBulletPoint(step.id, bullet.id)}
														className="w-4 h-4 mt-0.5 rounded border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer transition-all flex-shrink-0"
													/>
													<label
														htmlFor={`bullet-${bullet.id}`}
														className={`text-sm sm:text-base leading-relaxed cursor-pointer ${
															bullet.completed
																? "text-gray-500 line-through"
																: "text-gray-700"
														}`}
													>
														{bullet.text}
													</label>
												</li>
											))}
										</ul>
										{step.url && (
											<a
												href={step.url}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-block mt-6 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm"
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
					<div className="mt-8 p-6 bg-white border-2 border-green-300 rounded-xl text-center">
						<div className="text-5xl mb-3">🎉</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-2">
							Congratulations!
						</h3>
						<p className="text-gray-600">
							You&apos;ve completed all steps. Your business is ready to launch!
						</p>
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className="border-t border-gray-200 bg-white mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<p className="text-center text-gray-600 text-sm">
						© 2026 Robin. Helping entrepreneurs build their dreams.
					</p>
				</div>
			</footer>
		</div>
	);
}
