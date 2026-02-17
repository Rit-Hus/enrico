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
				primary: "#14332D",
				blue: "#553CC9",
				yellow: "#DFFE5B",
				beige: "#F7F7F1",
				"background-light": "#F7F7F1",
				"background-dark": "#14332D",
			},
			fontFamily: {
				display: ["Poppins", "sans-serif"],
				poppins: ["Poppins", "sans-serif"],
				inter: ["Inter", "sans-serif"],
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
