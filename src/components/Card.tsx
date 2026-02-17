import React from "react";

interface CardProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
	className?: string;
}

export default function Card({
	children,
	title,
	subtitle,
	className = "",
}: CardProps) {
	return (
		<div
			className={`bg-white dark:bg-white/5 rounded border border-primary/10 p-6 transition-shadow ${className}`}
			style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.08)" }}
		>
			{title && (
				<div className="mb-4">
					<h3 className="text-lg font-medium tracking-tight text-[#14332D] dark:text-white mb-1">
						{title}
					</h3>
					{subtitle && (
						<p className="text-sm text-slate-500 dark:text-slate-400">
							{subtitle}
						</p>
					)}
				</div>
			)}
			<div className="text-slate-700 dark:text-slate-300">{children}</div>
		</div>
	);
}
