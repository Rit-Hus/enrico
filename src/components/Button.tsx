import React from "react";

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
}

export default function Button({
	children,
	onClick,
	variant = "primary",
	size = "md",
	fullWidth = false,
	disabled = false,
	type = "button",
}: ButtonProps) {
	const baseStyles =
		"font-display rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

	const variantStyles = {
		primary:
			"bg-primary text-white shadow-xl shadow-primary/20 font-bold hover:shadow-primary/40",
		secondary:
			"bg-slate-100 dark:bg-white/10 text-[#160d1c] dark:text-white font-bold",
		outline:
			"text-[#794b9b] dark:text-primary/60 font-medium",
	};

	const sizeStyles = {
		sm: "px-4 py-2 text-sm",
		md: "px-5 py-3 text-base",
		lg: "px-6 py-4 text-lg",
	};

	const widthStyles = fullWidth ? "w-full" : "";

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles}`}
		>
			{children}
		</button>
	);
}
