import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";
import { ContentMetadata } from "@/app/lib/definitions";
import { INDEX_NAME_TIGER900 } from "@/app/lib/constants";


// Initialize Pinecone client
const pc = new Pinecone({
    apiKey: process.env.API_KEY_PINECONE!,
});

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.API_KEY_OPENAI
});

async function describePineconeIndex() {

    const dense_index = pc.Index(INDEX_NAME_TIGER900)

    const stats = await dense_index.describeIndexStats();

    return stats;
}



export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const contentCode = searchParams.get('contentCode');

    if (!contentCode) {
        return NextResponse.json({ error: "contentCode parameter is required." }, { status: 400 });
    }

    const stats = await describePineconeIndex();

    const metadata: ContentMetadata = {
        dimension: stats.dimension ?? 0,
        pageCount: stats.totalRecordCount ?? 0
    }

    return NextResponse.json(metadata);
    
}