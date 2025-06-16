import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";
import { PCQueryResult, queryPineconeIndex } from "@/app/lib/pineconeUtils";
import { logError, logInfo, logMessage } from "@/app/lib/loggingService";


// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.API_KEY_OPENAI,
});

const AI_MODEL = "gpt-4o-mini" // gpt-41-nano (fails when sharing data is enabled)

async function queryAIModel(query: string, pcResults: PCQueryResult[]) {

    const instructionsParam: ChatCompletionMessageParam = {
        role: "developer",
        content: "You are a helpful agent for a motorcycle technician. You will only answer if the relevant information is available in the provided context. If the information is not available, please respond with 'I was unable to find information on your question.  Try rephrasing or being more specific.'"
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
        model: AI_MODEL,
        messages: [instructionsParam, contextParam, userParam],
    });

    return response.choices[0]?.message?.content

}

export async function GET(request: Request) {

    let indexName: string | null = null;

    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query');
        indexName = searchParams.get('indexName');

        const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];

        if (!query) {
            return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
        }

        if (!indexName) {
            return NextResponse.json({ error: "indexName parameter is required." }, { status: 400 });
        }

        logInfo(`Request from IP ${ip} - ${query}`);

        // Test code - useful when wanting to avoid external API calls
        if (query.toLowerCase().trim() === "test") {
            return NextResponse.json({ message: "This is only a test\nNo AI services have been invoked" });
        }

        const pcResults = await queryPineconeIndex(indexName, query)

        const aiResponse = await queryAIModel(query, pcResults);

        logMessage(indexName, query, aiResponse ? aiResponse : "");

        return NextResponse.json({ message: aiResponse });
    } catch (error) {
        if (error instanceof Error) {
            logError("Error processing for index: " + indexName + " - " + error.message);
        } else {
            logError("Error processing for index: " + indexName + JSON.stringify(error));
        }

        throw error;
    }

}