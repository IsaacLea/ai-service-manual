import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { auth } from '../auth';

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
          <Header isLoggedIn={isLoggedIn} />
          <main className="flex flex-col flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
