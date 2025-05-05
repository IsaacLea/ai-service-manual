'use client'

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleButtonClick = async () => {
    try {
      const response = await fetch("/api/hello", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch server action");
      }
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error("Error fetching server action:", error);
      setMessage("An error occurred while fetching the server action.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Trigger Server Action
        </button>
        {message && <p>{message}</p>}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
