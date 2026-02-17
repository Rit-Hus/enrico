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

interface DailyReportField {
	id: string;
	label: string;
	type: "number" | "currency" | "select" | "toggle" | "text";
	placeholder?: string;
	options?: string[];
	value: string | number | boolean;
	category: string;
}

const initialSteps: NextStep[] = [
	{
		id: 1,
		step: "Register your business",
		description: "Register with Bolagsverket to establish your business entity.",
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
				{ id: "2-2", text: "Log in to Skatteverket's e-service 'Mina sidor foretag' with BankID", completed: false },
				{ id: "2-3", text: "Navigate to 'Skattekonto' and select 'Ansok om F-skatt'", completed: false },
				{ id: "2-4", text: "Fill out form SKV 4620 with your business information", completed: false },
				{ id: "2-5", text: "Submit required documentation (business registration certificate)", completed: false },
				{ id: "2-6", text: "Approval typically takes 4-6 weeks; you'll receive confirmation by mail", completed: false },
			],
		},
	},
	{
		id: 3,
		step: "Open business bank account",
		description: "Set up banking with SEB, Nordea, or Handelsbanken for your business finances.",
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
		description: "Visit Akersberga and schedule property viewings for your restaurant space.",
		completed: false,
		details: {
			title: "Finding Your Restaurant Location",
			bulletPoints: [
				{ id: "4-1", text: "Contact local real estate agents in Akersberga specializing in commercial properties", completed: false },
				{ id: "4-2", text: "Search online platforms: Blocket, Hemnet Foretag, and Fastighetsbyran", completed: false },
				{ id: "4-3", text: "Visit Akersberga to assess foot traffic in different neighborhoods", completed: false },
				{ id: "4-4", text: "Calculate space needs: 60-100 sqm for a small restaurant (15-30 seats)", completed: false },
				{ id: "4-5", text: "Negotiate lease terms: typically 3-5 year contracts with 3-6 month deposits required", completed: false },
				{ id: "4-6", text: "Review lease carefully for restrictions on food service, ventilation, and modifications", completed: false },
				{ id: "4-7", text: "Budget for monthly rent: expect 8,000-15,000 SEK/month in Akersberga", completed: false },
			],
		},
	},
	{
		id: 5,
		step: "Apply for permits",
		description: "Contact local municipality for food service and alcohol permits if needed.",
		completed: false,
		details: {
			title: "Required Permits and Licenses",
			bulletPoints: [
				{ id: "5-1", text: "Food service permit: Contact environmental department at Osteraker kommun", completed: false },
				{ id: "5-2", text: "Schedule inspection of your premises by health inspector before opening", completed: false },
				{ id: "5-3", text: "Complete food safety course (Livsmedelshygien) - required for all food handlers", completed: false },
				{ id: "5-4", text: "If serving alcohol: Apply for alcohol license 4-6 months in advance", completed: false },
				{ id: "5-5", text: "Budget for alcohol license: 10,000-25,000 SEK application fee plus annual renewal costs", completed: false },
				{ id: "5-6", text: "Signage permit if installing outdoor signs - check with building department", completed: false },
				{ id: "5-7", text: "Outdoor seating permit if planning a patio - requires separate application", completed: false },
			],
		},
	},
];

const createDailyReportFields = (): DailyReportField[] => [
	// Revenue & Sales
	{ id: "daily-revenue", label: "Daily Revenue (SEK)", type: "currency", placeholder: "0", value: "", category: "Revenue & Sales" },
	{ id: "transactions", label: "Number of Transactions", type: "number", placeholder: "0", value: "", category: "Revenue & Sales" },
	{ id: "avg-ticket", label: "Average Ticket Size (SEK)", type: "currency", placeholder: "0", value: "", category: "Revenue & Sales" },
	{ id: "payment-method", label: "Top Payment Method", type: "select", options: ["Card", "Swish", "Cash", "Invoice"], value: "", category: "Revenue & Sales" },

	// Costs & Purchases
	{ id: "daily-purchases", label: "Daily Purchases / COGS (SEK)", type: "currency", placeholder: "0", value: "", category: "Costs & Purchases" },
	{ id: "supplier-deliveries", label: "Supplier Deliveries Today", type: "number", placeholder: "0", value: "", category: "Costs & Purchases" },
	{ id: "unexpected-costs", label: "Unexpected Costs (SEK)", type: "currency", placeholder: "0", value: "", category: "Costs & Purchases" },
	{ id: "waste-amount", label: "Waste / Spoilage (SEK)", type: "currency", placeholder: "0", value: "", category: "Costs & Purchases" },

	// Operations
	{ id: "staff-present", label: "Staff Present Today", type: "number", placeholder: "0", value: "", category: "Operations" },
	{ id: "peak-hours", label: "Peak Hour", type: "select", options: ["11-12", "12-13", "13-14", "17-18", "18-19", "19-20"], value: "", category: "Operations" },
	{ id: "customer-complaints", label: "Customer Complaints", type: "number", placeholder: "0", value: "", category: "Operations" },
	{ id: "customer-compliments", label: "Customer Compliments", type: "number", placeholder: "0", value: "", category: "Operations" },

	// Inventory & Stock
	{ id: "stock-running-low", label: "Stock Running Low?", type: "toggle", value: false, category: "Inventory & Stock" },
	{ id: "items-low", label: "Items to Reorder", type: "text", placeholder: "e.g. flour, olive oil...", value: "", category: "Inventory & Stock" },
	{ id: "inventory-check-done", label: "Inventory Check Done?", type: "toggle", value: false, category: "Inventory & Stock" },

	// Business Health Flags
	{ id: "cash-flow-ok", label: "Cash Flow OK?", type: "toggle", value: true, category: "Business Health" },
	{ id: "any-equipment-issues", label: "Equipment Issues?", type: "toggle", value: false, category: "Business Health" },
	{ id: "mood", label: "Owner Mood / Energy", type: "select", options: ["Great", "Good", "Neutral", "Tired", "Stressed"], value: "", category: "Business Health" },
	{ id: "notes", label: "Notes / Observations", type: "text", placeholder: "Anything worth noting today...", value: "", category: "Business Health" },
];

export default function DashboardPage() {
	const [steps, setSteps] = useState<NextStep[]>(initialSteps);
	const [expandedStep, setExpandedStep] = useState<number | null>(null);
	const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
		overview: true,
		nextSteps: true,
	});
	const [dailyFields, setDailyFields] = useState<DailyReportField[]>(createDailyReportFields);
	const [expandedReportSections, setExpandedReportSections] = useState<Record<string, boolean>>({});
	const [reportSaved, setReportSaved] = useState(false);

	const toggleSection = (section: string) => {
		setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
	};

	const toggleReportSection = (section: string) => {
		setExpandedReportSections(prev => ({ ...prev, [section]: !prev[section] }));
	};

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

	const updateDailyField = (fieldId: string, value: string | number | boolean) => {
		setDailyFields(prev =>
			prev.map(f => f.id === fieldId ? { ...f, value } : f)
		);
		setReportSaved(false);
	};

	const handleSaveReport = () => {
		setReportSaved(true);
		setTimeout(() => setReportSaved(false), 3000);
	};

	const completedCount = steps.filter((step) => step.completed).length;
	const totalCount = steps.length;
	const progressPercentage = (completedCount / totalCount) * 100;
	const allCompleted = completedCount === totalCount;

	const reportCategories = Array.from(new Set(dailyFields.map(f => f.category)));

	const today = new Date().toLocaleDateString("en-SE", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

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
								&larr; Home
							</Link>
						</div>
					</div>
				</nav>
			</header>

			{/* Page Title */}
			<div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ebebdf' }} className="py-8 sm:py-10">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: '#14332d' }}>
						Dashboard
					</h2>
					<p className="text-sm" style={{ color: '#6a6a6b' }}>{today}</p>
				</div>
			</div>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4">

				{/* ──────── Business Overview Section ──────── */}
				<div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #ebebdf' }}>
					<button
						onClick={() => toggleSection('overview')}
						className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
						style={{ backgroundColor: '#14332d' }}
					>
						<div className="flex items-center gap-3">
							<span className="text-white text-xl">&#9670;</span>
							<h3 className="text-lg sm:text-xl font-semibold text-white">Business Overview</h3>
						</div>
						<span className="text-white text-2xl font-light">
							{expandedSections.overview ? "\u2212" : "+"}
						</span>
					</button>
					{expandedSections.overview && (
						<div className="p-5 sm:p-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="p-4 rounded-lg" style={{ backgroundColor: '#f7f7f1' }}>
									<p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#6a6a6b' }}>Company</p>
									<p className="text-lg font-semibold" style={{ color: '#14332d' }}>My Business</p>
								</div>
								<div className="p-4 rounded-lg" style={{ backgroundColor: '#f7f7f1' }}>
									<p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#6a6a6b' }}>Status</p>
									<p className="text-lg font-semibold" style={{ color: allCompleted ? '#44795c' : '#c97a2e' }}>
										{allCompleted ? "Operational" : "Setting Up"}
									</p>
								</div>
								<div className="p-4 rounded-lg" style={{ backgroundColor: '#f7f7f1' }}>
									<p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#6a6a6b' }}>Setup Progress</p>
									<div className="flex items-center gap-3">
										<div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#ebebdf' }}>
											<div
												className="h-full rounded-full transition-all duration-500"
												style={{ width: `${progressPercentage}%`, backgroundColor: '#44795c' }}
											/>
										</div>
										<span className="text-sm font-semibold" style={{ color: '#44795c' }}>
											{completedCount}/{totalCount}
										</span>
									</div>
								</div>
								<div className="p-4 rounded-lg" style={{ backgroundColor: '#f7f7f1' }}>
									<p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#6a6a6b' }}>Region</p>
									<p className="text-lg font-semibold" style={{ color: '#14332d' }}>Stockholm, Sweden</p>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* ──────── Next Steps / Daily Report Toggle ──────── */}
				{!allCompleted ? (
					/* ──────── Next Steps Checklist ──────── */
					<div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #ebebdf' }}>
						<button
							onClick={() => toggleSection('nextSteps')}
							className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
							style={{ backgroundColor: '#ffffff', borderBottom: expandedSections.nextSteps ? '1px solid #ebebdf' : 'none' }}
						>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f2f9e8' }}>
									<span style={{ color: '#44795c' }}>&#10003;</span>
								</div>
								<div>
									<h3 className="text-lg sm:text-xl font-semibold" style={{ color: '#14332d' }}>
										Next Steps
									</h3>
									<p className="text-sm" style={{ color: '#6a6a6b' }}>
										{completedCount} of {totalCount} completed
									</p>
								</div>
							</div>
							<span className="text-2xl font-light" style={{ color: '#14332d' }}>
								{expandedSections.nextSteps ? "\u2212" : "+"}
							</span>
						</button>
						{expandedSections.nextSteps && (
							<div className="p-4 sm:p-5 space-y-3">
								{steps.map((step, index) => (
									<div
										key={step.id}
										className="rounded-lg transition-all duration-200 overflow-hidden"
										style={{
											backgroundColor: step.completed ? '#f2f9e8' : '#f7f7f1',
											border: step.completed ? '1px solid #44795c' : '1px solid #ebebdf',
										}}
									>
										{/* Step row */}
										<div
											className="p-4 cursor-pointer flex items-center gap-3"
											onClick={() => toggleStep(step.id)}
										>
											<div onClick={(e) => e.stopPropagation()}>
												<input
													type="checkbox"
													checked={step.completed}
													onChange={() => toggleComplete(step.id)}
													className="w-5 h-5 rounded cursor-pointer"
													style={{ accentColor: '#44795c' }}
												/>
											</div>
											<div
												className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
												style={{ backgroundColor: step.completed ? '#44795c' : '#aaaaab' }}
											>
												{index + 1}
											</div>
											<div className="flex-1 min-w-0">
												<p
													className="font-semibold text-sm sm:text-base"
													style={{ color: step.completed ? '#6a6a6b' : '#14332d', textDecoration: step.completed ? 'line-through' : 'none' }}
												>
													{step.step}
												</p>
												<p className="text-xs sm:text-sm" style={{ color: '#6a6a6b' }}>{step.description}</p>
											</div>
											<span className="text-xl font-light flex-shrink-0" style={{ color: '#14332d' }}>
												{expandedStep === step.id ? "\u2212" : "+"}
											</span>
										</div>

										{/* Expanded bullet points */}
										{expandedStep === step.id && (
											<div className="px-4 pb-4" style={{ borderTop: '1px solid #ebebdf' }}>
												<div className="pt-3 ml-16 space-y-2">
													{step.details.bulletPoints.map((bullet) => (
														<label
															key={bullet.id}
															className="flex items-start gap-2 cursor-pointer"
														>
															<input
																type="checkbox"
																checked={bullet.completed}
																onChange={() => toggleBulletPoint(step.id, bullet.id)}
																className="w-4 h-4 mt-0.5 rounded flex-shrink-0 cursor-pointer"
																style={{ accentColor: '#44795c' }}
															/>
															<span
																className="text-sm leading-relaxed"
																style={{
																	color: bullet.completed ? '#aaaaab' : '#14332d',
																	textDecoration: bullet.completed ? 'line-through' : 'none'
																}}
															>
																{bullet.text}
															</span>
														</label>
													))}
													{step.url && (
														<a
															href={step.url}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
															style={{ backgroundColor: '#14332d' }}
														>
															Visit {step.url.replace("https://", "")} &rarr;
														</a>
													)}
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				) : (
					/* ──────── Daily Reporting (shown when all steps complete) ──────── */
					<div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '2px solid #44795c' }}>
						<div className="p-5 sm:p-6" style={{ backgroundColor: '#14332d' }}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<span className="text-2xl">&#128202;</span>
									<div>
										<h3 className="text-lg sm:text-xl font-semibold text-white">
											Daily Business Report
										</h3>
										<p className="text-sm" style={{ color: '#9ac4a9' }}>
											Track the numbers that matter
										</p>
									</div>
								</div>
								{reportSaved && (
									<span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#f2f9e8', color: '#44795c' }}>
										Saved!
									</span>
								)}
							</div>
						</div>

						<div className="p-4 sm:p-5 space-y-3">
							{reportCategories.map((category) => {
								const categoryFields = dailyFields.filter(f => f.category === category);
								const isExpanded = expandedReportSections[category] !== false;

								return (
									<div key={category} className="rounded-lg overflow-hidden" style={{ border: '1px solid #ebebdf' }}>
										<button
											onClick={() => toggleReportSection(category)}
											className="w-full flex items-center justify-between p-4 text-left"
											style={{ backgroundColor: '#f7f7f1' }}
										>
											<span className="font-semibold text-sm" style={{ color: '#14332d' }}>{category}</span>
											<span className="text-lg font-light" style={{ color: '#14332d' }}>
												{isExpanded ? "\u2212" : "+"}
											</span>
										</button>
										{isExpanded && (
											<div className="p-4 space-y-4" style={{ backgroundColor: '#ffffff' }}>
												{categoryFields.map((field) => (
													<div key={field.id}>
														<label className="block text-sm font-medium mb-1.5" style={{ color: '#14332d' }}>
															{field.label}
														</label>
														{field.type === "currency" || field.type === "number" ? (
															<input
																type="number"
																placeholder={field.placeholder}
																value={field.value as string}
																onChange={(e) => updateDailyField(field.id, e.target.value)}
																className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
																style={{
																	border: '1px solid #ebebdf',
																	backgroundColor: '#f7f7f1',
																	color: '#14332d',
																}}
															/>
														) : field.type === "select" ? (
															<select
																value={field.value as string}
																onChange={(e) => updateDailyField(field.id, e.target.value)}
																className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
																style={{
																	border: '1px solid #ebebdf',
																	backgroundColor: '#f7f7f1',
																	color: '#14332d',
																}}
															>
																<option value="">Select...</option>
																{field.options?.map(opt => (
																	<option key={opt} value={opt}>{opt}</option>
																))}
															</select>
														) : field.type === "toggle" ? (
															<button
																onClick={() => updateDailyField(field.id, !(field.value as boolean))}
																className="flex items-center gap-2"
															>
																<div
																	className="w-10 h-6 rounded-full transition-colors duration-200 relative"
																	style={{ backgroundColor: field.value ? '#44795c' : '#ebebdf' }}
																>
																	<div
																		className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200"
																		style={{ left: field.value ? '22px' : '4px' }}
																	/>
																</div>
																<span className="text-sm" style={{ color: '#6a6a6b' }}>
																	{field.value ? "Yes" : "No"}
																</span>
															</button>
														) : (
															<input
																type="text"
																placeholder={field.placeholder}
																value={field.value as string}
																onChange={(e) => updateDailyField(field.id, e.target.value)}
																className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2"
																style={{
																	border: '1px solid #ebebdf',
																	backgroundColor: '#f7f7f1',
																	color: '#14332d',
																}}
															/>
														)}
													</div>
												))}
											</div>
										)}
									</div>
								);
							})}

							<button
								onClick={handleSaveReport}
								className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 mt-2"
								style={{ backgroundColor: '#14332d' }}
							>
								Save Daily Report
							</button>
						</div>
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className="mt-12" style={{ borderTop: '1px solid #ebebdf', backgroundColor: '#ffffff' }}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<p className="text-center text-sm" style={{ color: '#6a6a6b' }}>
						&copy; 2026 Enrico. Helping entrepreneurs build their dreams.
					</p>
				</div>
			</footer>
		</div>
	);
}
