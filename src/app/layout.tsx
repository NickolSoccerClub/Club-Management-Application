import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nickol Soccer Club | AI-Powered Club Management",
  description:
    "Inspiring the next generation of footballers in the Pilbara. Register, view schedules, and stay connected with your grassroots soccer community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
