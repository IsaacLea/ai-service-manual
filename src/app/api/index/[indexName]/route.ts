import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import { ContentMetadata } from "@/app/lib/definitions";
import { INDEX_NAME_TIGER900 } from "@/app/lib/constants";
import { describePineconeIndex } from "@/app/lib/pineconeUtils";
import { NextApiRequest } from "next";


export async function GET(request: NextApiRequest, { params }: { params: Promise<{ indexName: string }> }) {

    const indexName = (await params).indexName;

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