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
			className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${className}`}
		>
			{title && (
				<div className="mb-4">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
						{title}
					</h3>
					{subtitle && (
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{subtitle}
						</p>
					)}
				</div>
			)}
			<div className="text-gray-700 dark:text-gray-300">{children}</div>
		</div>
	);
}
