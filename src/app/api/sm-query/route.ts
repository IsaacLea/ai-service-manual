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

type PCResult = {
    id: string;
    pageText: string;
    pageNumber: number;
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
        const fields = hit.fields as { text: string; page: number }; // Explicitly define the structure
        return {
            id: hit._id,
            pageText: fields.text,
            pageNumber: fields.page
        };
    });

    return results;
}

async function queryAIModel(query: string, pcResults: PCResult[]) {

    const instructionsParam: ChatCompletionMessageParam = {
        role: "developer",
        content: "You are a helpful agent for a motorcycle technician. You will only answer if the relevant information is available in the provided context. If the information is not available, please respond with 'I was unable to find information on your question.  Try rephrasing.'"
    }

    let context = "";
    for (const result of pcResults) {
        context += `Page ${result.pageNumber}: ${result.pageText}\n\n`;
    }

    const contextParam: ChatCompletionMessageParam = {
        role: "developer",
        content: "# Context `\n\n` " + context
    }

    const userParam: ChatCompletionMessageParam = {
        role: "user",
        content: query
    }

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [instructionsParam, contextParam, userParam],
    });

    return response.choices[0]?.message?.content

}

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
    }

    if (query.toLowerCase() === "test") {
        return NextResponse.json({ message: "Dummy response!\nLine two" });
    }

    const pcResults = await queryPineconeIndex(query!)

    const aiResponse = await queryAIModel(query!, pcResults);

    return NextResponse.json({ message: aiResponse });

}