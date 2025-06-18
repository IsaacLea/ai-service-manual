import { NextResponse } from "next/server";
import { IntegratedRecord, RecordMetadata } from '@pinecone-database/pinecone';
import { createIndex, getIndexByName, invalidateCache, upsertRecords } from "@/app/lib/pineconeUtils";
import { put } from "@vercel/blob";
import { saveIndex } from "@/app/lib/databaseService";

export async function POST(request: Request) {
  try {

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();

    const fileName = formData.get("fileName") as string;
    const indexName = formData.get("indexName") as string;
    const pages = formData.get("pages") as Blob;

    // Extract the array of PageText objects from the pages Blob
    let pageTexts: any[] = [];
    if (pages) {
      const pagesText = await pages.text();
      pageTexts = JSON.parse(pagesText);
    }

    const { url } = await put(fileName, arrayBuffer, { access: 'public', allowOverwrite: true });

    await saveIndex(indexName, indexName, fileName, url)

    console.log(url);

    const index = getIndexByName(indexName);

    if (!index) {
      await createIndex(indexName);
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

    // // Upsert records into the pinecone index
    await upsertRecords(indexName, records)

    // // Invalidate the cache to ensure the new index is recognized
    invalidateCache();

    return NextResponse.json({ message: "File loaded successfully", fileName: fileName });

  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}


