'use client';

import { useState } from "react";
import MetadataTable from "../components/MetadataTable";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [isAddingData, setIsAddingData] = useState(false);

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

  const toggleView = () => {
    setIsAddingData(!isAddingData);
  };

  return (
    <div className="grid justify-items-center min-h-screen bg-gray-100">
      <header className="text-3xl font-bold my-6 text-blue-600">Admin Panel</header>

      <main className="bg-white shadow-md rounded-lg p-6 w-3/4">
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={toggleView}
        >
          {isAddingData ? "View Metadata" : "Add Data"}
        </button>

        {isAddingData ? (
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="key">
                Key
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="key"
                type="text"
                placeholder="Enter key"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">
                Value
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="value"
                type="text"
                placeholder="Enter value"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Submit
            </button>
          </form>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
