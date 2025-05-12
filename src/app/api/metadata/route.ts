import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";


// Initialize Pinecone client
const pc = new Pinecone({
    apiKey: process.env.API_KEY_PINECONE!,
});

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.API_KEY_OPENAI
});

type MetadataResult = {
    id: number;
    pageCount: number;
};

async function queryPineconeIndex(query: string) {

    const dense_index = pc.Index("tiger-900-sm")

    // Perform a query on the specified index with the given query string
    const response = await dense_index.searchRecords({
        query: {
            topK: 10,
            inputs: { text: query },
        },
        // fields: ['chunk_text', 'category'],
    });

    // Map hits into a list of PCResult objects
    const results = response.result.hits.map(hit => {
        const fields = hit.fields as { text: string; page: number };
        return {
            id: hit._id,
            pageText: fields.text,
            pageNumber: fields.page
        };
    });

    return results;
}



export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const contentCode = searchParams.get('contentCode');

    if (!contentCode) {
        return NextResponse.json({ error: "contentCode parameter is required." }, { status: 400 });
    }

    //if (contentCode.toLowerCase() === "tiger900") {
    return NextResponse.json({ id: 1, pageCount: 222 });
    //}

    //const pcResults = await queryPineconeIndex(query!)

    //const aiResponse = await queryAIModel(query!, pcResults);

    // NextResponse.json({ message: aiResponse });

}