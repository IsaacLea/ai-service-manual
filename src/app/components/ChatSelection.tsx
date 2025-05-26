'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { getIndexDisplayRecord } from "../utils";

interface ChatSelectionProps {
  className?: string;
}

const ChatSelection: React.FC<ChatSelectionProps> = ({ className }) => {

  const router = useRouter()
  const [indexes, setIndexes] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    async function fetchIndexes() {
      try {
        const response = await fetch("/api/index");
        const data = await response.json();
        setIndexes(data.indexes || []);
      } catch (error) {
        console.error("Error fetching indexes:", error);
      }
    }
    fetchIndexes();
  }, []);


  const handleSelectionChange = async (event: { target: { value: any; }; }) => {

    setSelectedOption(event.target.value);

    if (event.target.value) {
      router.push('/chat/' + event.target.value)
    }
  }

  function renderIndexOptions() {
    return indexes.map((idx) => {
      const record = getIndexDisplayRecord(idx);
      return (
        <option key={idx} value={idx}>
          {record ? record.indexDisplayName : idx}
        </option>
      );
    });
  }

  return (
    <div className={`flex flex-col items-center min-h-full${className ? ` ${className}` : ''}`}>
      <select
        className="border p-3 rounded w-full min-w-[300px] mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedOption}
        onChange={handleSelectionChange}
      >
        <option value="" disabled hidden>Select an option</option>
        {renderIndexOptions()}
      </select>
    </div>
  )
};

export default ChatSelection;