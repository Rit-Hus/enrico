import React from "react";

interface InputProps {
	label?: string;
	type?: string;
	name?: string;
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
}

export default function Input({
	label,
	type = "text",
	name,
	placeholder,
	value,
	onChange,
	error,
	required = false,
	disabled = false,
	className = "",
}: InputProps) {
	return (
		<div className={`w-full ${className}`}>
			{label && (
				<label className="block text-sm font-medium text-[#160d1c] dark:text-white mb-2">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}
			<input
				type={type}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				disabled={disabled}
				required={required}
				className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all
          ${
						error
							? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500"
							: "border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10"
					}
          bg-white dark:bg-[#251630] text-[#160d1c] dark:text-white
          placeholder:text-[#794b9b]/50
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
			/>
			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
}
