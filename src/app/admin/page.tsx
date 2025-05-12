'use client';

import { useState } from "react";
import { ContentMetadata } from "../lib/definitions";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("");
  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);

  const handleSelectionChange = async (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value) {
      try {
        const response = await fetch("/api/metadata?contentCode=" + value);
        const data: ContentMetadata = await response.json();

        setMetadata(data);
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  };

  return (
    <div className="grid justify-items-center min-h-screen bg-gray-100">
      <header className="text-3xl font-bold my-6 text-blue-600">Admin Panel</header>

      <main className="bg-white shadow-md rounded-lg p-6 w-3/4">
        <select
          className="border p-3 rounded w-full mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedOption}
          onChange={handleSelectionChange}
        >
          <option value="" disabled hidden>Select an option</option>
          <option value="TIGER900">Tiger 900</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>

        {metadata && (
          <table className="table-auto border-collapse border border-gray-400 mt-6 w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Number of Pages</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-gray-600">{metadata.pageCount}</td>
              </tr>
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
