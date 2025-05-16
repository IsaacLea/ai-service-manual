import { NextResponse } from "next/server";
import { UploadContent } from "@/app/lib/definitions";
import { IndexList, IntegratedRecord, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.API_KEY_PINECONE!,
});

async function checkIndexExistence(indexName:string) {
    
    try {
      const indexList:IndexList = await pinecone.listIndexes();

      return Array.isArray(indexList.indexes) && indexList.indexes.some(idx => idx.name === indexName);

    } catch (error) {
      console.error("Error checking index existence:", error);
      return false;
    }
  }

  async function createIndex(indexName:string) {

    await pinecone.createIndexForModel({
      name: indexName,
      cloud: 'aws',
      region: 'us-east-1',
      embed: {
        model: 'multilingual-e5-large',
        fieldMap: { text: 'chunk_text' },
      },
      waitUntilReady: true,
    });
    

    console.log(`Index '${indexName}' created successfully.`);
    
  }

export async function POST(request: Request) {
    try {

        const content: UploadContent = await request.json();

        const exists = await checkIndexExistence(content.indexName);
        if (!exists) {
            await createIndex(content.indexName);
        }

        const dense_index = pinecone.Index(content.indexName);

        let records:IntegratedRecord<RecordMetadata>[] = []

        for (let i = 0; i < content.pages.length; i++) {
            const page = content.pages[i];
            records.push({
                id: `rec${i}`,
                chunk_text: page.text,
                page: i+1,
            });
        }

        dense_index.upsertRecords(records)

        console.log(exists);

        console.log("PDF:", content.indexName);

        return NextResponse.json({ message: "File received but process not implemented", fileName: content.filename });
    } catch (error) {
        console.error("Error handling file upload:", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}