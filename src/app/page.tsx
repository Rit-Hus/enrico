"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Home() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		companyName: "",
		idea: "",
	});

	const [errors, setErrors] = useState({
		name: "",
		email: "",
		companyName: "",
		idea: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {
			name: "",
			email: "",
			companyName: "",
			idea: "",
		};
		let isValid = true;

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
			isValid = false;
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
			isValid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
			isValid = false;
		}

		if (!formData.companyName.trim()) {
			newErrors.companyName = "Company name is required";
			isValid = false;
		}

		if (!formData.idea.trim()) {
			newErrors.idea = "Please describe your idea";
			isValid = false;
		} else if (formData.idea.trim().length < 20) {
			newErrors.idea = "Please provide more details (at least 20 characters)";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			// TODO: Replace with actual API endpoint
			const response = await fetch("/api/ideas", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setSubmitSuccess(true);
				setFormData({
					name: "",
					email: "",
					companyName: "",
					idea: "",
				});

				// Reset success message after 5 seconds
				setTimeout(() => {
					setSubmitSuccess(false);
				}, 5000);
			} else {
				alert("Something went wrong. Please try again.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Failed to submit. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

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
								href="/next-steps"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium"
							>
								Next Steps
							</Link>
							<a
								href="#about"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
							>
								About
							</a>
						</div>
					</div>
				</nav>
			</header>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
						Start Your Company
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
							With Confidence
						</span>
					</h2>
					<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Share your business idea with us and we&apos;ll help you turn it
						into reality. Get expert guidance, resources, and support to launch
						your startup.
					</p>
				</div>

				{/* Success Message */}
				{submitSuccess && (
					<div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
						<p className="text-green-800 dark:text-green-200 text-center font-medium">
							✓ Thank you! Your idea has been submitted successfully. We&apos;ll
							get back to you soon!
						</p>
					</div>
				)}

				{/* Form Card */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
					<div className="mb-8">
						<h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Tell Us About Your Idea
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Fill out the form below and take the first step towards building
							your company.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name Input */}
						<Input
							label="Your Name"
							type="text"
							name="name"
							placeholder="John Doe"
							value={formData.name}
							onChange={handleChange}
							error={errors.name}
							required
						/>

						{/* Email Input */}
						<Input
							label="Email Address"
							type="email"
							name="email"
							placeholder="john@example.com"
							value={formData.email}
							onChange={handleChange}
							error={errors.email}
							required
						/>

						{/* Company Name Input */}
						<Input
							label="Company Name"
							type="text"
							name="companyName"
							placeholder="Your Company Name"
							value={formData.companyName}
							onChange={handleChange}
							error={errors.companyName}
							required
						/>

						{/* Idea Textarea */}
						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Your Business Idea
								<span className="text-red-500 ml-1">*</span>
							</label>
							<textarea
								name="idea"
								placeholder="Describe your business idea in detail. What problem does it solve? Who are your customers? What makes it unique?"
								value={formData.idea}
								onChange={handleChange}
								required
								rows={6}
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y
                  ${
										errors.idea
											? "border-red-500 focus:ring-red-500"
											: "border-gray-300 dark:border-gray-600"
									}
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                `}
							/>
							{errors.idea && (
								<p className="mt-1 text-sm text-red-500">{errors.idea}</p>
							)}
						</div>

						{/* Submit Button */}
						<div className="pt-4">
							<Button
								type="submit"
								variant="primary"
								size="lg"
								fullWidth
								disabled={isSubmitting}
							>
								{isSubmitting ? "Submitting..." : "Submit Your Idea"}
							</Button>
						</div>
					</form>

					{/* Additional Info */}
					<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
						<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
							🔒 Your information is secure and confidential. We respect your
							privacy.
						</p>
					</div>
				</div>

				{/* Features Section */}
				<div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
					<div className="text-center p-6">
						<div className="text-4xl mb-3">💡</div>
						<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
							Expert Guidance
						</h4>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Get advice from experienced entrepreneurs
						</p>
					</div>
					<div className="text-center p-6">
						<div className="text-4xl mb-3">🚀</div>
						<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
							Fast Launch
						</h4>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Turn your idea into a business quickly
						</p>
					</div>
					<div className="text-center p-6">
						<div className="text-4xl mb-3">📈</div>
						<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
							Growth Support
						</h4>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Resources to scale your startup
						</p>
					</div>
				</div>
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
