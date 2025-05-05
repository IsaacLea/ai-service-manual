import { NextResponse } from "next/server";

export async function GET() {

    console.log('server action called');

    return NextResponse.json({ message: "Hello, World!" });

}