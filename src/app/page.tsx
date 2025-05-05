'use client'

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`/api/hello?query=${encodeURIComponent(query)}`, {
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
    <div className="grid justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1 mb-4">
        <h1 className="text-2xl font-bold">Tiger 900 Service Manual</h1>
      </header>

      <main className="flex flex-col items-center">

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
          className="px-4 py-2 border rounded mb-4"
        />
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Query
        </button>
        <div className="mt-4 p-4 bg-gray-100 text-gray-800 rounded"> {/* Added light grey box styling */}
          {message && <p>{message}</p>}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
