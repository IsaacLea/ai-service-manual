import { NextResponse } from "next/server";
import { getIndexes } from "@/app/lib/databaseService";


export async function GET() {

    const indexes = await getIndexes();
    // const indexes = await getIndexNames();

    return NextResponse.json({ indexes });
}
