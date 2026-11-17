import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aha Dev — Website Order Management System",
  description: "Automated website ordering, smart client requirement gathering, and Discord integration by Aha Dev.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${cinzel.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#131126] text-[#f8f9fc] selection:bg-[#d91e36] selection:text-[#f8f9fc]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
