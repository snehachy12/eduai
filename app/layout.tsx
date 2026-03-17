// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "@/styles/globals.css";
import { Providers } from "./provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduAI — AI Student Evaluation Platform",
  description: "AI-powered student evaluation system for smarter parent-teacher collaboration. Track attendance, monitor homework, and analyze student performance.",
  keywords: ["education", "AI", "student evaluation", "parent teacher", "attendance", "school management"],
  openGraph: {
    title: "EduAI Platform",
    description: "AI-powered student evaluation for smarter schools",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Nest the ThemeProvider INSIDE your custom Providers */}
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {/* Render children ONLY ONCE inside the innermost provider */}
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}