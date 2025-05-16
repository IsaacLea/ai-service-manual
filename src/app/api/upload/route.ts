import { NextResponse } from "next/server";
import { UploadContent } from "@/app/lib/definitions";
import { IntegratedRecord, RecordMetadata } from '@pinecone-database/pinecone';
import { checkIndexExistence, createIndex, upsertRecords } from "@/app/lib/pineconeUtils";


export async function POST(request: Request) {
  try {

    const content: UploadContent = await request.json();

    const exists = await checkIndexExistence(content.indexName);

    if (exists) {
      throw new Error(`Index ${content.indexName} already exists.`);
    } else {
      await createIndex(content.indexName);
    }

    // Map the content pages to records ready for upsert
    const records: IntegratedRecord<RecordMetadata>[] = []

    for (let i = 0; i < content.pages.length; i++) {
      const page = content.pages[i];
      records.push({
        id: `rec${i}`,
        chunk_text: page.text,
        page: i + 1,
      });
    }

    // Upsert records into the pinecone index
    await upsertRecords(content.indexName, records)

    return NextResponse.json({ message: "File received but process not implemented", fileName: content.filename });

  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}