'use client';

import { useState } from "react";
import MetadataTable from "../components/MetadataTable";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("");
  const [metadata, setMetadata] = useState(null);

  const handleSelectionChange = async (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value) {
      try {
        const response = await fetch("/api/metadata?contentCode=" + value);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  };


  return (
    <div className="grid justify-items-center min-h-screen bg-gray-100">

      <main className="bg-white w-full shadow-md rounded-lg p-6 w-3/4">

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
          <MetadataTable metadata={metadata} />
        )}

      </main>
    </div>
  );
}
