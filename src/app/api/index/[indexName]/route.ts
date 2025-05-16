import { NextResponse } from "next/server";
import { ContentMetadata } from "@/app/lib/definitions";
import { describePineconeIndex } from "@/app/lib/pineconeUtils";

export async function GET(request: Request, { params }: { params: Promise<{ indexName: string }> }) {

    const indexName = (await params).indexName;

    const stats = await describePineconeIndex(indexName);

    const metadata: ContentMetadata = {
        dimension: stats.dimension ?? 0,
        pageCount: stats.totalRecordCount ?? 0
    }

    return NextResponse.json(metadata);

}