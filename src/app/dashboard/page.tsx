"use client";

import { useState } from "react";
import Link from "next/link";

interface DailyEntry {
	date: string;
	revenue: number;
	expenses: number;
	atmosphere: number;
	operationalIssues: string;
	notes: string;
}

interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

interface Deadline {
	id: number;
	title: string;
	date: string;
	type: "tax" | "salary" | "invoice" | "other";
	completed: boolean;
}

export default function DashboardPage() {
	const [todayEntry, setTodayEntry] = useState<DailyEntry>({
		date: new Date().toISOString().split("T")[0],
		revenue: 0,
		expenses: 0,
		atmosphere: 7,
		operationalIssues: "",
		notes: "",
	});

	const [todos, setTodos] = useState<Todo[]>([
		{ id: 1, text: "Follow up on unpaid invoices", completed: false },
		{ id: 2, text: "Check and reply to business emails", completed: false },
		{ id: 3, text: "Review inventory levels", completed: false },
		{ id: 4, text: "Update social media", completed: false },
	]);

	const [deadlines] = useState<Deadline[]>([
		{
			id: 1,
			title: "VAT Payment (Moms)",
			date: "2026-02-26",
			type: "tax",
			completed: false,
		},
		{
			id: 2,
			title: "Salary Payment",
			date: "2026-02-28",
			type: "salary",
			completed: false,
		},
		{
			id: 3,
			title: "Invoice #1234 - Due",
			date: "2026-02-20",
			type: "invoice",
			completed: false,
		},
		{
			id: 4,
			title: "Quarterly Tax Report",
			date: "2026-03-31",
			type: "tax",
			completed: false,
		},
	]);

	// Sample historical data for the chart
	const [weeklyData] = useState([
		{ day: "Mon", revenue: 12500, expenses: 4200 },
		{ day: "Tue", revenue: 15000, expenses: 3800 },
		{ day: "Wed", revenue: 13200, expenses: 4500 },
		{ day: "Thu", revenue: 16800, expenses: 4100 },
		{ day: "Fri", revenue: 18500, expenses: 5200 },
		{ day: "Sat", revenue: 21000, expenses: 5800 },
		{ day: "Today", revenue: todayEntry.revenue, expenses: todayEntry.expenses },
	]);

	const toggleTodo = (id: number) => {
		setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
	};

	const handleSave = () => {
		alert("Daily report saved successfully!");
		// Here you would typically save to backend/database
	};

	const getDaysUntil = (dateString: string) => {
		const deadline = new Date(dateString);
		const today = new Date();
		const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
		return diff;
	};

	const getDeadlineStyle = (daysUntil: number) => {
		if (daysUntil < 0) return { bg: "#ffefe7", border: "#cd4f27", text: "#cd4f27" };
		if (daysUntil <= 3) return { bg: "#fff9ef", border: "#ff8049", text: "#cd4f27" };
		if (daysUntil <= 7) return { bg: "#f8f9e8", border: "#ecfe9d", text: "#44795c" };
		return { bg: "#f2f9e8", border: "#44795c", text: "#44795c" };
	};

	const maxValue = Math.max(...weeklyData.map((d) => Math.max(d.revenue, d.expenses)));

	return (
		<div className="min-h-screen" style={{ backgroundColor: "#f7f7f1" }}>
			{/* Header */}
			<header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #ebebdf" }}>
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div
								className="w-8 h-8 rounded-md flex items-center justify-center"
								style={{ backgroundColor: "#14332d" }}
							>
								<span className="text-white font-bold text-sm">E</span>
							</div>
							<h1 className="text-2xl font-semibold" style={{ color: "#14332d" }}>
								Enrico
							</h1>
						</div>
						<div className="flex gap-6 items-center">
							<Link
								href="/next-steps"
								className="transition-colors text-sm font-medium"
								style={{ color: "#44795c" }}
							>
								Next Steps
							</Link>
							<Link
								href="/"
								className="transition-colors text-sm font-medium"
								style={{ color: "#44795c" }}
							>
								← Home
							</Link>
						</div>
					</div>
				</nav>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Title */}
				<div className="mb-8">
					<h2 className="text-4xl font-bold mb-2" style={{ color: "#14332d" }}>
						Daily Dashboard
					</h2>
					<p className="text-lg" style={{ color: "#6a6a6b" }}>
						{new Date().toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content Area */}
					<div className="lg:col-span-2 space-y-6">
						{/* Revenue & Expenses */}
						<div
							className="rounded-xl p-6"
							style={{ backgroundColor: "#ffffff", border: "1px solid #ebebdf" }}
						>
							<h3 className="text-xl font-semibold mb-4" style={{ color: "#14332d" }}>
								💰 Today's Financials
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2" style={{ color: "#6a6a6b" }}>
										Revenue (SEK)
									</label>
									<input
										type="number"
										value={todayEntry.revenue}
										onChange={(e) =>
											setTodayEntry({ ...todayEntry, revenue: Number(e.target.value) })
										}
										className="w-full px-4 py-2 rounded-lg"
										style={{
											border: "1px solid #ebebdf",
											backgroundColor: "#f7f7f1",
											color: "#14332d",
										}}
										placeholder="0"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2" style={{ color: "#6a6a6b" }}>
										Expenses (SEK)
									</label>
									<input
										type="number"
										value={todayEntry.expenses}
										onChange={(e) =>
											setTodayEntry({ ...todayEntry, expenses: Number(e.target.value) })
										}
										className="w-full px-4 py-2 rounded-lg"
										style={{
											border: "1px solid #ebebdf",
											backgroundColor: "#f7f7f1",
											color: "#14332d",
										}}
										placeholder="0"
									/>
								</div>
							</div>
							<div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#f2f9e8" }}>
								<div className="flex justify-between items-center">
									<span className="font-medium" style={{ color: "#14332d" }}>
										Net Profit Today:
									</span>
									<span
										className="text-2xl font-bold"
										style={{ color: todayEntry.revenue - todayEntry.expenses >= 0 ? "#44795c" : "#cd4f27" }}
									>
										{(todayEntry.revenue - todayEntry.expenses).toLocaleString()} SEK
									</span>
								</div>
							</div>
						</div>

						{/* Weekly Chart */}
						<div
							className="rounded-xl p-6"
							style={{ backgroundColor: "#ffffff", border: "1px solid #ebebdf" }}
						>
							<h3 className="text-xl font-semibold mb-4" style={{ color: "#14332d" }}>
								📊 Weekly Overview
							</h3>
							<div className="space-y-2">
								{weeklyData.map((day, index) => (
									<div key={index} className="space-y-1">
										<div className="text-sm font-medium" style={{ color: "#6a6a6b" }}>
											{day.day}
										</div>
										<div className="flex gap-2 items-center">
											<div className="flex-1 h-8 rounded-lg overflow-hidden relative" style={{ backgroundColor: "#f7f7f1" }}>
												<div
													className="h-full rounded-lg transition-all duration-300"
													style={{
														width: `${(day.revenue / maxValue) * 100}%`,
														backgroundColor: "#44795c",
													}}
												/>
												<span
													className="absolute left-2 top-1 text-xs font-medium"
													style={{ color: "#ffffff" }}
												>
													{day.revenue > 0 ? `${day.revenue.toLocaleString()} SEK` : ""}
												</span>
											</div>
											<div className="flex-1 h-8 rounded-lg overflow-hidden relative" style={{ backgroundColor: "#f7f7f1" }}>
												<div
													className="h-full rounded-lg transition-all duration-300"
													style={{
														width: `${(day.expenses / maxValue) * 100}%`,
														backgroundColor: "#cd4f27",
													}}
												/>
												<span
													className="absolute left-2 top-1 text-xs font-medium"
													style={{ color: "#ffffff" }}
												>
													{day.expenses > 0 ? `${day.expenses.toLocaleString()} SEK` : ""}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="flex gap-4 mt-4 text-sm">
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 rounded" style={{ backgroundColor: "#44795c" }} />
									<span style={{ color: "#6a6a6b" }}>Revenue</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 rounded" style={{ backgroundColor: "#cd4f27" }} />
									<span style={{ color: "#6a6a6b" }}>Expenses</span>
								</div>
							</div>
						</div>

						{/* Client Feedback & Operations */}
						<div
							className="rounded-xl p-6"
							style={{ backgroundColor: "#ffffff", border: "1px solid #ebebdf" }}
						>
							<h3 className="text-xl font-semibold mb-4" style={{ color: "#14332d" }}>
								🎯 Operations Check
							</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2" style={{ color: "#6a6a6b" }}>
										Atmosphere Today (1-10)
									</label>
									<input
										type="range"
										min="1"
										max="10"
										value={todayEntry.atmosphere}
										onChange={(e) =>
											setTodayEntry({ ...todayEntry, atmosphere: Number(e.target.value) })
										}
										className="w-full"
										style={{ accentColor: "#44795c" }}
									/>
									<div className="flex justify-between text-sm mt-1" style={{ color: "#6a6a6b" }}>
										<span>Poor</span>
										<span className="font-bold text-lg" style={{ color: "#14332d" }}>
											{todayEntry.atmosphere}/10
										</span>
										<span>Excellent</span>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2" style={{ color: "#6a6a6b" }}>
										Operational Issues / Equipment Needs
									</label>
									<textarea
										value={todayEntry.operationalIssues}
										onChange={(e) =>
											setTodayEntry({ ...todayEntry, operationalIssues: e.target.value })
										}
										className="w-full px-4 py-3 rounded-lg resize-none"
										style={{
											border: "1px solid #ebebdf",
											backgroundColor: "#f7f7f1",
											color: "#14332d",
										}}
										rows={3}
										placeholder="Any equipment broken? Anything needs replacement or repair?"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2" style={{ color: "#6a6a6b" }}>
										Additional Notes
									</label>
									<textarea
										value={todayEntry.notes}
										onChange={(e) => setTodayEntry({ ...todayEntry, notes: e.target.value })}
										className="w-full px-4 py-3 rounded-lg resize-none"
										style={{
											border: "1px solid #ebebdf",
											backgroundColor: "#f7f7f1",
											color: "#14332d",
										}}
										rows={3}
										placeholder="Any other observations or notes for today..."
									/>
								</div>
							</div>
						</div>

						{/* Save Button */}
						<button
							onClick={handleSave}
							className="w-full py-3 rounded-lg font-semibold text-white transition-all"
							style={{ backgroundColor: "#14332d" }}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#44795c";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#14332d";
							}}
						>
							Save Daily Report
						</button>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Daily To-Dos */}
						<div
							className="rounded-xl p-6"
							style={{ backgroundColor: "#ffffff", border: "1px solid #ebebdf" }}
						>
							<h3 className="text-lg font-semibold mb-4" style={{ color: "#14332d" }}>
								✓ Daily To-Dos
							</h3>
							<div className="space-y-3">
								{todos.map((todo) => (
									<div key={todo.id} className="flex items-start gap-3">
										<input
											type="checkbox"
											id={`todo-${todo.id}`}
											checked={todo.completed}
											onChange={() => toggleTodo(todo.id)}
											className="w-4 h-4 mt-0.5 rounded border-2 cursor-pointer"
											style={{
												borderColor: todo.completed ? "#44795c" : "#aaaaab",
												accentColor: "#44795c",
											}}
										/>
										<label
											htmlFor={`todo-${todo.id}`}
											className="text-sm cursor-pointer flex-1"
											style={{
												color: todo.completed ? "#aaaaab" : "#14332d",
												textDecoration: todo.completed ? "line-through" : "none",
											}}
										>
											{todo.text}
										</label>
									</div>
								))}
							</div>
						</div>

						{/* Upcoming Deadlines */}
						<div
							className="rounded-xl p-6"
							style={{ backgroundColor: "#ffffff", border: "1px solid #ebebdf" }}
						>
							<h3 className="text-lg font-semibold mb-4" style={{ color: "#14332d" }}>
								📅 Upcoming Deadlines
							</h3>
							<div className="space-y-3">
								{deadlines
									.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
									.map((deadline) => {
										const daysUntil = getDaysUntil(deadline.date);
										const style = getDeadlineStyle(daysUntil);
										return (
											<div
												key={deadline.id}
												className="p-3 rounded-lg"
												style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
											>
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1">
														<div className="font-medium text-sm" style={{ color: "#14332d" }}>
															{deadline.title}
														</div>
														<div className="text-xs mt-1" style={{ color: "#6a6a6b" }}>
															{new Date(deadline.date).toLocaleDateString("en-US", {
																month: "short",
																day: "numeric",
															})}
														</div>
													</div>
													<div
														className="text-xs font-bold whitespace-nowrap"
														style={{ color: style.text }}
													>
														{daysUntil < 0
															? `${Math.abs(daysUntil)}d overdue`
															: daysUntil === 0
															? "Today!"
															: `${daysUntil}d left`}
													</div>
												</div>
											</div>
										);
									})}
							</div>
						</div>

						{/* Quick Stats */}
						<div
							className="rounded-xl p-6"
							style={{ backgroundColor: "#f2f9e8", border: "1px solid #44795c" }}
						>
							<h3 className="text-lg font-semibold mb-3" style={{ color: "#14332d" }}>
								📈 Quick Stats
							</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span style={{ color: "#6a6a6b" }}>Tasks Completed:</span>
									<span className="font-semibold" style={{ color: "#14332d" }}>
										{todos.filter((t) => t.completed).length}/{todos.length}
									</span>
								</div>
								<div className="flex justify-between">
									<span style={{ color: "#6a6a6b" }}>Overdue Items:</span>
									<span className="font-semibold" style={{ color: "#cd4f27" }}>
										{deadlines.filter((d) => getDaysUntil(d.date) < 0).length}
									</span>
								</div>
								<div className="flex justify-between">
									<span style={{ color: "#6a6a6b" }}>This Week Net:</span>
									<span className="font-semibold" style={{ color: "#44795c" }}>
										{weeklyData
											.slice(0, -1)
											.reduce((sum, day) => sum + (day.revenue - day.expenses), 0)
											.toLocaleString()}{" "}
										SEK
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
