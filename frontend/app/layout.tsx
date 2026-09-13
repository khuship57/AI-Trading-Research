import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Trading Research Assistant",
  description: "Turn ambiguous trading questions into testable research experiments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
