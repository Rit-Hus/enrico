/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#9719f0",
				"background-light": "#f7f6f8",
				"background-dark": "#1b1022",
				background: "var(--background)",
				foreground: "var(--foreground)",
				primary: "#14332d",
				gray: {
					50: "#f9fafb",
					100: "#f3f4f6",
					200: "#e5e7eb",
					300: "#d1d5db",
					400: "#9ca3af",
					500: "#6b7280",
					600: "#14332d",
					700: "#14332d",
					800: "#14332d",
					900: "#14332d",
				},
			},
			fontFamily: {
				sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui"],
				poppins: ["var(--font-poppins)"],
			},
			fontFamily: {
				display: ["Inter", "sans-serif"],
				poppins: ["Poppins", "sans-serif"],
			},
			borderRadius: {
				DEFAULT: "0.5rem",
				lg: "1rem",
				xl: "1.5rem",
				full: "9999px",
			},
		},
	},
	plugins: [],
};
