import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import HomeIcon from "./components/HomeIcon";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "AI powered Service Manual",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <header className="w-full flex justify-between items-center px-8 py-2 bg-white shadow-md bg-gradient-to-br from-blue-50 to-blue-200">
        <Link
          href="/"
          className="flex items-center text-lg font-bold text-blue-800 hover:underline"
        >
          <HomeIcon />
          Home
        </Link>
        <Link
          href="/admin"
          className="text-blue-600 hover:underline font-medium"
        >
          Login
        </Link>
      </header>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
          {children}
        </div>
      </body>
    </html>
  );
}
