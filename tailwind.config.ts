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
