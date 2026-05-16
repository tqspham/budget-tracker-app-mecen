import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Budget Tracker — Mindful Financial Management",
  description: "A calm, minimalist financial budgeting application for mindful personal money management. Track budgets by category, visualize spending patterns, and manage your finances with intention and clarity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
