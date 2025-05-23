'use client'

import React, { useState } from "react";
import MessageDisplay from "./MessageDisplay";
import { QueryResult } from "../types";

interface QueryInputProps {
  indexName: string;
}

const QueryInput: React.FC<QueryInputProps> = ({ indexName }) => {

  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {

    if (!query.trim()) {
      setError("Query is required.");
      return;
    }

    setError("");
    setMessage("")
    setLoading(true);
    setSubmittedQuery(query);
    setQuery("");

    try {

      const response = await fetch(`/api/sm-query?indexName=${indexName}&query=${encodeURIComponent(submittedQuery)}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch server action");
      }
      const data: QueryResult = await response.json();

      setMessage(data.message);
    } catch (error) {
      console.error("Error fetching server action:", error);
      setMessage("An error occurred while fetching the server action.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleButtonClick();
    }
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query"
        className="px-4 py-2 border rounded mb-4 w-9/10 sm:w-100"
        onKeyDown={handleKeyDown}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleButtonClick}
        className={`px-4 py-2 rounded text-white ${query.trim() && !loading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
        disabled={!query.trim() || loading}
      >
        {loading ? "Loading..." : "Submit Query"}
      </button>
      <div className="w-9/10 sm:w-100">
        {submittedQuery && <MessageDisplay message={submittedQuery} isUserMessage={true} />}
        {message && <MessageDisplay message={message} isUserMessage={false} />}
      </div>
    </div>
  );
};

export default QueryInput;