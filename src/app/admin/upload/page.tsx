'use client';

/**
 * This page is used to upload a PDF file and extract text from it.
 * It uses the react-pdf library to read the PDF file and extract text from each page.
 * It then sends the extracted text to the server for processing.
 * 
 * Ideally, the file processing should be server side, but the react-pdf library is not compatible with server components. 
 * Alternatively the file processing could be turned into a separate micro service, but that would be overkill for this project.
 */
import { PageText, UploadContent } from "@/app/lib/definitions";
import { useState } from "react";
import { pdfjs } from 'react-pdf';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

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

      const buffer = Buffer.from(await file.arrayBuffer());

      const doc = await pdfjs.getDocument(buffer).promise;

      const pdfPages: PageText[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str).join(" ");

        const pageContent: PageText = {
          page: i,
          text: textItems,
        };

        pdfPages.push(pageContent);

      }

      const uploadContent: UploadContent = {
        filename: file.name,
        pages: pdfPages,
      };

      try {
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
      }
    } else {
      console.log("No file selected");
    }
  };

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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload
          </button>
        )}

        {uploadStatus && (
          <p className="mt-4 text-center text-sm text-gray-700">{uploadStatus}</p>
        )}
      </form>
    </div>
  );
}
