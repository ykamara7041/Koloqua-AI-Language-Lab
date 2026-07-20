import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koloqua AI — Liberian Language Lab",
  description: "Preserving Liberia's voice and preparing it for the age of AI. A community-powered platform for Koloqua and Liberian languages.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9A3412",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
