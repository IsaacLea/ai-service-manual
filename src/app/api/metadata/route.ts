import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import { ContentMetadata } from "@/app/lib/definitions";
import { INDEX_NAME_TIGER900 } from "@/app/lib/constants";
import { describePineconeIndex } from "@/app/lib/pineconeUtils";


export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const indexName = searchParams.get('indexName');

    if (!indexName) {
        return NextResponse.json({ error: "indexName parameter is required." }, { status: 400 });
    }

    const stats = await describePineconeIndex(indexName);

    // const stats = {
    //     dimension: 1536,
    //     totalRecordCount: 1000
    // }

    const metadata: ContentMetadata = {
        dimension: stats.dimension ?? 0,
        pageCount: stats.totalRecordCount ?? 0
    }

    return NextResponse.json(metadata);

}