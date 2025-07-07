'use client'

import React, { useState } from "react";
import MessageDisplay from "./MessageDisplay";
import { QueryResult } from "../types";


const QueryInput: React.FC<{ indexName: string, fileUrl: string }> = ({ indexName, fileUrl }) => {

  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {

    if (!query) {
      setError("Query is required.");
      return;
    }

    // Assign the trimmed query to a new variable so it doesn't affect the original state when cleared
    const userQuery = query.trim();

    setError("");
    setMessage("")
    setLoading(true);
    setSubmittedQuery(userQuery);
    setQuery("");

    try {

      const response = await fetch(`/api/sm-query?indexName=${indexName}&query=${encodeURIComponent(userQuery)}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch server action");
      }
      const data: QueryResult = await response.json();

      // Replace any numbers surrounded by [[[ and ]]] with a hyperlink to open the PDF at that page
      const processedMessage = data.message.replace(/\[\[\[(\d+)\]\]\]/g, (_match, p1) => buildPageUrl(fileUrl, Number(p1)));

      setMessage(processedMessage);
    } catch (error) {
      console.error("Error fetching server action:", error);
      setMessage("An error occurred while fetching the server action.");
    } finally {
      setLoading(false);
    }
  };

  function buildPageUrl(fileUrl: string, pageNumber: number): string {
    return `<a 
      href="${fileUrl}#page=${pageNumber}" 
      target="_blank" 
      rel="noopener noreferrer" 
      style="color: #2563eb; 
      text-decoration: underline;">${pageNumber}</a>`
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (query.trim()) {
        handleButtonClick();
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query"
        className="px-4 py-2 border rounded mb-4 w-full text-black"
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