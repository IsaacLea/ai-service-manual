import { NextResponse } from "next/server";
import { getIndexNames } from "@/app/lib/pineconeUtils";


export async function GET() {

    const indexes = await getIndexNames();

    return NextResponse.json({ indexes });
}
