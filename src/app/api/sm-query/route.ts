import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";
import { PCQueryResult, queryPineconeIndex } from "@/app/lib/pineconeUtils";

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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const indexName = searchParams.get('indexName');

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
    }

    if (!indexName) {
        return NextResponse.json({ error: "indexName parameter is required." }, { status: 400 });
    }

    if (query.toLowerCase() === "test") {
        return NextResponse.json({ message: "Dummy response!\nLine two" });
    }

    const pcResults = await queryPineconeIndex(indexName, query!)

    const aiResponse = await queryAIModel(query!, pcResults);

    return NextResponse.json({ message: aiResponse });

}