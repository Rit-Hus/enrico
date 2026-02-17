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
		<div className="min-h-screen" style={{ backgroundColor: '#f7f7f1' }}>
			{/* Header */}
			<header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ebebdf' }}>
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: '#14332d' }}>
								<span className="text-white font-bold text-sm">E</span>
							</div>
							<h1 className="text-2xl font-semibold" style={{ color: '#14332d' }}>Enrico</h1>
						</div>
						<div className="flex gap-6 items-center">
							<Link
								href="/"
								className="transition-colors text-sm font-medium"
								style={{ color: '#44795c' }}
							>
								← Back to Home
							</Link>
						</div>
					</div>
				</nav>
			</header>

			{/* Page Header */}
			<div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ebebdf' }} className="py-12 sm:py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#14332d' }}>
						✓ Next Steps
					</h2>
					<p className="text-lg mb-6" style={{ color: '#6a6a6b' }}>
						Your personalized business roadmap
					</p>

					{/* Progress Indicator */}
					<div style={{ backgroundColor: '#f2f9e8', border: '1px solid #44795c' }} className="rounded-xl p-4">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium" style={{ color: '#14332d' }}>
								Progress
							</span>
							<span className="text-sm font-semibold" style={{ color: '#44795c' }}>
								{completedCount} of {totalCount} completed
							</span>
						</div>
						<div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#ebebdf' }}>
							<div
								className="h-full transition-all duration-500 ease-out rounded-full"
								style={{ 
									width: `${progressPercentage}%`,
									backgroundColor: '#44795c'
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
							className={`rounded-xl transition-all duration-200`}
							style={{
								backgroundColor: step.completed ? '#f2f9e8' : '#ffffff',
								border: step.completed ? '2px solid #44795c' : '1px solid #ebebdf',
								boxShadow: expandedStep === step.id ? '0 4px 12px rgba(20, 51, 45, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
							}}
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
											className="w-5 h-5 rounded border-2 cursor-pointer transition-all"
											style={{
												borderColor: step.completed ? '#44795c' : '#aaaaab',
												accentColor: '#44795c'
											}}
										/>
									</div>

									{/* Step Number Badge */}
									<div
										className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white"
										style={{ backgroundColor: '#44795c' }}
									>
										{index + 1}
									</div>

									{/* Step Info */}
									<div className="flex-1 min-w-0">
										<h3
											className="text-lg sm:text-xl font-semibold mb-1"
											style={{
												color: step.completed ? '#6a6a6b' : '#14332d'
											}}
										>
											{step.step}
										</h3>
										<p className="text-sm sm:text-base leading-relaxed" style={{ color: '#6a6a6b' }}>
											{step.description}
										</p>
										{step.url && expandedStep !== step.id && (
											<a
												href={step.url}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												className="inline-block mt-2 text-sm font-medium transition-colors"
												style={{ color: '#44795c' }}
											>
												Visit →
											</a>
										)}
									</div>

									{/* Expand Icon */}
									<div className="flex-shrink-0">
										<div
											className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
											style={{
												backgroundColor: expandedStep === step.id ? '#ebebdf' : '#f7f7f1',
												color: '#14332d'
											}}
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
								<div className="p-5 sm:p-6" style={{ backgroundColor: '#f7f7f1', borderTop: '1px solid #ebebdf' }}>
									<div className="ml-0 sm:ml-16">
										<h4 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#14332d' }}>
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
														className="w-4 h-4 mt-0.5 rounded border-2 cursor-pointer transition-all flex-shrink-0"
														style={{
															borderColor: bullet.completed ? '#44795c' : '#aaaaab',
															accentColor: '#44795c'
														}}
													/>
													<label
														htmlFor={`bullet-${bullet.id}`}
														className="text-sm sm:text-base leading-relaxed cursor-pointer"
														style={{
															color: bullet.completed ? '#aaaaab' : '#14332d',
															textDecoration: bullet.completed ? 'line-through' : 'none'
														}}
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
												className="inline-block mt-6 px-5 py-2.5 font-medium rounded-lg transition-all duration-200 text-sm"
												style={{
													backgroundColor: '#14332d',
													color: '#ffffff'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.backgroundColor = '#44795c';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.backgroundColor = '#14332d';
												}}
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
					<div className="mt-8 p-6 rounded-xl text-center" style={{ backgroundColor: '#f2f9e8', border: '2px solid #44795c' }}>
						<div className="text-5xl mb-3">🎉</div>
						<h3 className="text-2xl font-bold mb-2" style={{ color: '#14332d' }}>
							Congratulations!
						</h3>
						<p style={{ color: '#44795c' }}>
							You&apos;ve completed all steps. Your business is ready to launch!
						</p>
					</div>
				)}

				{/* Daily Dashboard CTA */}
				<div className="mt-12 p-8 rounded-xl text-center" style={{ backgroundColor: '#f7f7f1', border: '2px solid #ebebdf' }}>
					<h3 className="text-2xl font-bold mb-3" style={{ color: '#14332d' }}>
						Track Your Daily Progress
					</h3>
					<p className="mb-6 text-base" style={{ color: '#44795c' }}>
						Monitor revenue, expenses, operational issues, and upcoming deadlines in your daily dashboard.
					</p>
					<Link href="/dashboard">
						<button
							className="px-8 py-3 font-semibold rounded-lg transition-all duration-200 text-base"
							style={{
								backgroundColor: '#14332d',
								color: '#ffffff'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#44795c';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#14332d';
							}}
						>
							Go to Daily Dashboard →
						</button>
					</Link>
				</div>
			</main>

			{/* Footer */}
			<footer className="mt-12" style={{ borderTop: '1px solid #ebebdf', backgroundColor: '#ffffff' }}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<p className="text-center text-sm" style={{ color: '#6a6a6b' }}>
						© 2026 Enrico. Helping entrepreneurs build their dreams.
					</p>
				</div>
			</footer>
		</div>
	);
}
