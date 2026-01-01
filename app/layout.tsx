import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EcoGuard AI",
  description: "Multimodal Environmental Defense powered by Gemini 3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
