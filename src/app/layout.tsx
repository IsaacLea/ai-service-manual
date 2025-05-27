import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import HomeIcon from "./components/HomeIcon";
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

import LogOutForm from "./components/LogOutForm";
import { auth } from '../auth';

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



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-blue-50 to-blue-200">
          <header className="w-full flex justify-between items-center px-8 py-2">
            <Link
              href="/"
              className="flex items-center text-lg font-bold text-blue-800 hover:underline group"
            >
              <HomeIcon className="w-6 h-6 mr-2 transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-110" />
            </Link>
            <div className="flex items-center gap-6">
              {!isLoggedIn && (
                <Link
                  href="/admin"
                  className="text-blue-600 hover:underline font-medium group"
                >
                  <Cog6ToothIcon className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
                </Link>
              )}
              {isLoggedIn && (
                <LogOutForm />
              )}
            </div>
          </header>
          <main className="flex flex-col flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
