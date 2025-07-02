import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DB_CONNECTION_STRING;
if (!connectionString) {
    throw new Error("DB_CONNECTION_STRING environment variable is not set.");
}
const sql = neon(connectionString);

export type VectorIndexRow = {
    id: number;
    indexName: string;
    indexDisplayName: string;
    fileName: string;
    fileUrl: string;
};

export async function getIndexByName(indexName: string) {

    const indexRecord = await sql`SELECT * FROM vector_indexes WHERE index_name=${indexName}`;

    if (indexRecord && indexRecord.length > 0) {
        const index: any = indexRecord.at(0);

        return {
            id: index.id,
            indexName: index.index_name,
            indexDisplayName: index.index_display_name,
            fileName: index.file_name,
            fileUrl: index.file_url,
        };
    } else {
        return null;
    }

}


export async function saveFilePages(fileName: string, indexName: string, filePages: Uint8Array[]) {

    // Get the vector index record to get the ID
    const indexRecord = await getIndexByName(indexName);

    if (!indexRecord) {
        throw new Error(`Vector index with name '${indexName}' not found`);
    }

    // Delete existing file pages for this vector index
    await sql`DELETE FROM file_pages WHERE vector_index_id = ${indexRecord.id}`;

    console.log(`Saving ${filePages.length} pages for index '${indexName}' with ID ${indexRecord.id}`);

    for (let i = 0; i < filePages.length; i++) {
        const pageNum = i + 1;
        const content = Buffer.from(filePages[i]);

        await sql`
            INSERT INTO file_pages (page_num, content, vector_index_id)
            VALUES (${pageNum}, ${content}, ${indexRecord.id})
        `;



    }

}

export async function getIndexes(): Promise<VectorIndexRow[]> {

    const indexes = await sql`SELECT * FROM vector_indexes ORDER BY index_display_name`;

    return indexes.map((index: any) => ({
        id: index.id,
        indexName: index.index_name,
        indexDisplayName: index.index_display_name,
        fileName: index.file_name,
        fileUrl: index.file_url,
    }));
}

export async function saveIndex(indexName: string, index_display_name: string, fileName: string, fileUrl: string) {

    const indexRecord = await getIndexByName(indexName);

    if (indexRecord) {
        await sql`UPDATE vector_indexes SET 
            index_display_name=${index_display_name}, file_name=${fileName}, file_url=${fileUrl} WHERE index_name=${indexName}`;
    } else {
        await sql`INSERT INTO vector_indexes(index_name, index_display_name, file_name, file_url) 
            VALUES (${indexName}, ${index_display_name}, ${fileName}, ${fileUrl})`;
    }


}