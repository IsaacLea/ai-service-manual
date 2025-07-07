import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';

// Extract all text from a PDF file
export async function extractTextFromPdf(pdfFile: File): Promise<string> {
    try {
        const fileArrayBuffer = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(fileArrayBuffer);

        const pdfData = await pdfParse(buffer);

        return pdfData.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
}


// Split a PDF file into individual pages and return them as an array of Uint8Array
export async function splitPdf(pdfFileContent: ArrayBuffer) {

    // const fileArrayBuffer = await pdfFile.arrayBuffer();

    const data = new Uint8Array(Buffer.from(pdfFileContent));

    // Load the PDFDocument
    const pdfDoc = await PDFDocument.load(data);

    const numberOfPages = pdfDoc.getPages().length;
    const pagesBytes: Uint8Array[] = [];

    // Iterate through each page in the PDF and create a new PDF for each page
    for (let i = 0; i < numberOfPages; i++) {

        // Create a new "sub" document
        const subDocument = await PDFDocument.create();

        // copy the page at current index
        const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])

        subDocument.addPage(copiedPage);
        const pdfBytes = await subDocument.save();
        pagesBytes.push(pdfBytes);

        // writePdfBytesToFile(`file-${i + 1}.pdf`, pdfBytes);

    }

    return pagesBytes;
}

// function writePdfBytesToFile(fileName: string, pdfBytes: Uint8Array) {
//     console.log(`Writing PDF bytes to file: ${fileName}`);
//     //return fs.promises.writeFile(fileName, pdfBytes);
// }
