import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/app/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koloqua AI Language Lab",
  description: "Preserving Liberia's voice and preparing it for the age of AI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#022c22",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
