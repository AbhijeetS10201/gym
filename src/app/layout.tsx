import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AB Fitness Gym | Premium All-India Gym Franchise",
  description: "Experience the ultimate fitness transformation at AB Fitness Gym. Get access to state-of-the-art equipment, personalized workout plans, and certified trainers across India.",
  keywords: ["gym", "fitness", "workout", "personal trainer", "India gyms", "workout plans", "fitness goals", "AB Fitness"],
  authors: [{ name: "AB Fitness Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
