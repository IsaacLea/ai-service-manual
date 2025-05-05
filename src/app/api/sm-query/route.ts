import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from "openai";


// Initialize Pinecone client
const pc = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_API_KEY_PINECONE!,
});

const openai = new OpenAI({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: process.env.NEXT_PUBLIC_API_KEY_OPENAI
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


    let context = "";
    for (const result of pcResults) {
        context += `Page ${result.pageNumber}: ${result.pageText}\n\n`;
    }

    const instructions = "You are a helpful agent for a motorcycle technician. You will only answer if the relevant information is available in the provided context. If the information is not available, please respond with 'I don't know.'\n\n"

    console.log("Context: ", context)
    const prompt = "Instructions: " + instructions+ `\n\n` + "Context: " + context + `\n\n` + "User query: " + query + "\n\n"

    
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

    return response.choices[0]?.message?.content

}

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    console.log('Query parameter:', query);

    if (query === "test") {
        return NextResponse.json({ message: "Dummy response!" });
    }

    const pcResults = await queryPineconeIndex(query!)

    const aiResponse = await queryAIModel(query!, pcResults)

    return NextResponse.json({ message: aiResponse });

}