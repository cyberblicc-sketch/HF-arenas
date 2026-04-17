import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HuggyDual | The Market Layer for Forecasting AI Progress",
  description:
    "Prediction markets tied to verifiable AI outcomes — benchmark wins, leaderboard shifts, model releases, dataset adoption. Yield-bearing. Compliance-aware. Automated resolution.",
  keywords: [
    "AI prediction markets",
    "Hugging Face",
    "forecasting",
    "DeFi",
    "yield",
    "machine learning",
    "benchmark",
  ],
  authors: [{ name: "HuggyArena" }],
  openGraph: {
    title: "HuggyDual | AI Forecasting Protocol",
    description:
      "Prediction markets tied to verifiable AI outcomes. Yield-bearing. Compliance-aware.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HuggyDual | AI Forecasting Protocol",
    description:
      "Prediction markets tied to verifiable AI outcomes. Yield-bearing. Compliance-aware.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0d14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
