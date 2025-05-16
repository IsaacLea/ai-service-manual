import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";
import { getIndexNames, PCQueryResult, queryPineconeIndex } from "@/app/lib/pineconeUtils";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.API_KEY_OPENAI
});

async function queryAIModel(query: string, pcResults: PCQueryResult[]) {

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

    const indexes = await getIndexNames();

    return NextResponse.json({ indexes });

}

export async function GET_INDEXES() {
    try {
        const pinecone = new Pinecone({ apiKey: process.env.API_KEY_PINECONE! });
        const indexList = await pinecone.listIndexes();
        return NextResponse.json({ indexes: indexList.indexes || [] });
    } catch (error) {
        console.error("Error fetching Pinecone indexes:", error);
        return NextResponse.json({ error: "Failed to fetch indexes." }, { status: 500 });
    }
}