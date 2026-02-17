import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Robin-2 App",
	description: "Full-stack Next.js application with API routes",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">{children}</body>
		</html>
	);
}
