'use client'

import React, { useState, useEffect } from "react";
import MessageDisplay from "./MessageDisplay";
import PDFViewer from "./PDFViewer";
import { QueryResult } from "../types";


const QueryInput: React.FC<{ indexName: string, fileUrl: string }> = ({ indexName, fileUrl }) => {

  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfPageNumber, setPdfPageNumber] = useState(0);

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
    return `<span 
      class="page-link"
      data-page="${pageNumber}"
      style="color: #2563eb; 
      text-decoration: underline; 
      cursor: pointer;">${pageNumber}</span>`
  }

  // Use useEffect to set up click handlers after the message is rendered
  useEffect(() => {
    const handlePageClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('page-link')) {
        const pageNumber = parseInt(target.getAttribute('data-page') || '0');
        console.log("Opening PDF viewer for page:", pageNumber);
        setPdfPageNumber(pageNumber - 1); // PDF viewer uses 0-based indexing
        setShowPDFViewer(true);
      }
    };

    // Add event listener to the document
    document.addEventListener('click', handlePageClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handlePageClick);
    };
  }, [message, setPdfPageNumber, setShowPDFViewer]); // Re-run when message changes

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

      {showPDFViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full h-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-black">PDF Viewer - Page {pdfPageNumber + 1}</h3>
              <button
                onClick={() => setShowPDFViewer(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
            <div className="h-full">
              <PDFViewer pdfUrl={fileUrl} pageNumber={pdfPageNumber} />
            </div>
          </div>
        </div>
      )}

      <div className="w-9/10 sm:w-100">
        {submittedQuery && <MessageDisplay message={submittedQuery} isUserMessage={true} />}
        {message && <MessageDisplay message={message} isUserMessage={false} />}
      </div>
    </div>
  );
};

export default QueryInput;