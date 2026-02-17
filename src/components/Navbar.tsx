"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavItem {
	label: string;
	href: string;
}

const navItems: NavItem[] = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link
							href="/"
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<Image
								src="/logo.png"
								alt="Logo"
								width={80}
								height={45}
								className="object-contain"
							/>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-center space-x-4">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-[#794b9b] hover:text-primary dark:text-[#794b9b] dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							{!isOpen ? (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							) : (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="text-[#794b9b] hover:text-primary dark:text-[#794b9b] dark:hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
								onClick={() => setIsOpen(false)}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}
