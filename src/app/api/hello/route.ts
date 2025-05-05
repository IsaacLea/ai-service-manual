import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new Pinecone({
    apiKey: 'YOUR_API_KEY',
    // environment: 'YOUR_ENVIRONMENT', // Removed as it is not a valid property
});



export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    console.log('Query parameter:', query);

    console.log('server action called');

    return NextResponse.json({ message: "Hello, World! Updated" });

}