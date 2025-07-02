import { NextResponse } from "next/server";
import { IntegratedRecord, RecordMetadata } from '@pinecone-database/pinecone';
import { checkIndexExistence, createIndex, invalidateCache, upsertRecords } from "@/app/lib/pineconeUtils";
import { put } from "@vercel/blob";
import { saveFilePages, saveIndex } from "@/app/lib/databaseService";
import { logError } from "@/app/lib/loggingService";
import { PageText } from "@/app/lib/definitions";

import { extractTextFromPdf, splitPdf } from "@/app/lib/pdfParser";


export async function POST(request: Request) {
  try {

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();

    const fileName = formData.get("fileName") as string;
    const indexName = formData.get("indexName") as string;
    // const pages = formData.get("pages") as Blob;


    // console.log('Page texts:', pageTexts);

    //const extractedText = await extractTextFromPdf(file);
    //console.log('Extracted text:', extractedText);

    // Extract the text pages Blob
    // let pageTexts: any[] = [];
    // if (pages) {
    //   const pagesText = await pages.text();
    //   pageTexts = JSON.parse(pagesText);
    // }

    // console.log('Page texts:', pageTexts);

    // Save the file to Vercel Blob storage
    const { url } = await put(fileName, arrayBuffer, { access: 'public', allowOverwrite: true });

    // Save the index metadata to the database
    await saveIndex(indexName, indexName, fileName, url);

    // Split the PDF into individual pages
    const splitPages = await splitPdf(file);

    // Save the split pages to the database
    await saveFilePages(fileName, indexName, splitPages);

    const pageTexts: any[] = [];

    // Extract text from each page
    for (let i = 0; i < splitPages.length; i++) {
      const pageBlob = new Blob([splitPages[i]], { type: "application/pdf" });
      const pageFile = new File([pageBlob], `page-${i + 1}.pdf`, { type: "application/pdf" });
      const pageText = await extractTextFromPdf(pageFile);

      // create a new PageText object
      const pageTextObj: PageText = {
        page: i + 1,
        text: pageText,
      };

      pageTexts.push(pageTextObj);
    }

    // Map the content pages to records ready for upsert
    const records: IntegratedRecord<RecordMetadata>[] = []

    for (let i = 0; i < pageTexts.length; i++) {
      const page = pageTexts[i];
      records.push({
        id: `rec${i}`,
        chunk_text: page.text,
        page: i + 1,
      });
    }

    // create the new pinecone vector index if it doesn't exist
    const indexExists = await checkIndexExistence(indexName);

    if (!indexExists) {
      await createIndex(indexName);
    }

    // Upsert records into the pinecone index
    await upsertRecords(indexName, records)

    // // Invalidate the cache to ensure the new index is recognized
    invalidateCache();

    return NextResponse.json({ message: "File loaded successfully", fileName: fileName });

  } catch (error) {
    logError(error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }





}


