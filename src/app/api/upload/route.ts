import { NextResponse } from "next/server";
import { UploadContent } from "@/app/lib/definitions";

export async function POST(request: Request) {
    try {

        const content: UploadContent = await request.json();

        console.log("PDF:", content.filename);

        return NextResponse.json({ message: "File received but process not implemented", fileName: content.filename });
    } catch (error) {
        console.error("Error handling file upload:", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}