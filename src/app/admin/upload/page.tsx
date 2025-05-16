'use client';

/**
 * This page is used to upload a PDF file and extract text from it.
 * It uses the react-pdf library to read the PDF file and extract text from each page.
 * It then sends the extracted text to the server for processing.
 * 
 * Ideally, the file processing should be server side, but the react-pdf library is not compatible with server components. 
 * Alternatively the file processing could be turned into a separate micro service using a different language (java/python), but that would be overkill for this project.
 */
import { PageText, UploadContent } from "@/app/lib/definitions";
import '@ungap/with-resolvers'; // Fixes runtime issue with pdfjs library not being able to resolve the Promise.withResolvers
import { useState } from "react";
import { pdfjs } from 'react-pdf';


export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [indexName, setIndexName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Setup the workerSrc for pdfjs
  // https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md#legacy-pdfjs-worker
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();

    if (file) {

      setLoading(true);

      try {

        const buffer = Buffer.from(await file.arrayBuffer());

        const pdfPages = await parsePDF(buffer);

        if (pdfPages.length === 0) {
          setUploadStatus("No text found in the PDF file.");
          setLoading(false);
          return;
        }

        const uploadContent: UploadContent = {
          filename: file.name,
          indexName: indexName,
          pages: pdfPages,
        };

        const response = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify(uploadContent),
        });

        if (response.ok) {
          setUploadStatus("File uploaded successfully.");
        } else {
          setUploadStatus("Failed to upload file.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("An error occurred during upload.");
      } finally {
        setLoading(false);
      }

    } else {
      console.log("No file selected");
    }
  };

  async function parsePDF(buffer: Buffer<ArrayBuffer>): Promise<PageText[]> {

    const doc = await pdfjs.getDocument(buffer).promise;

    const pdfPages: PageText[] = [];

    for (let i = 1; i <= doc.numPages; i++) {

      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();

      let textItems = "";
      let currentFontName = null;

      for (const item of textContent.items) {

        let isNewLine = false;

        // When the font changes it indicates a new line
        // This is a bit of a hack, but it works.  There is a hasEOL property but it indicates line wrap not new line
        if ('fontName' in item && item.fontName) {
          if (currentFontName && currentFontName !== item.fontName) {
            isNewLine = true;
          }
          currentFontName = item.fontName;
        }

        if (isNewLine) {
          textItems += "\n";
        }
        if ('str' in item && item.str) {
          textItems += item.str;
        }
      }

      const pageContent: PageText = {
        page: i,
        text: textItems,
      };

      pdfPages.push(pageContent);
    }
    return pdfPages;
  }

  return (
    <div className="grid justify-items-center min-h-screen bg-gray-100 w-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full">
        <h1 className="text-xl font-bold mb-4">Upload PDF</h1>

        <label className="mb-4 block">
          <span className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 inline-block">
            Choose File
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <label className="mb-4 block">
          <span className="block text-gray-700">Index Name</span>
          <input
            type="text"
            value={indexName}
            onChange={(e) => setIndexName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter index name"
            required
          />
        </label>

        {file && (
          <section className="mb-4">
            File details:
            <ul>
              <li>Name: {file.name}</li>
              <li>Size: {file.size} bytes</li>
            </ul>
          </section>
        )}

        {file && (
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${!loading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Upload"}
          </button>
        )}

        {uploadStatus && (
          <p className="mt-4 text-center text-sm text-gray-700">{uploadStatus}</p>
        )}
      </form>
    </div>
  );
}
