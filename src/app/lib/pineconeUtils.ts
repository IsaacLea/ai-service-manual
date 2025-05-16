import { IndexList, IntegratedRecord, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.API_KEY_PINECONE!,
});

export async function getIndexNames(): Promise<string[]> {

    const indexList: IndexList = await pinecone.listIndexes();

    if (Array.isArray(indexList.indexes)) {
        return indexList.indexes.map(index => index.name);
    } else {
        console.error("Invalid index list format:", indexList);
        return [];
    }

}

export async function checkIndexExistence(indexName: string): Promise<boolean> {
    try {
        const indexList: IndexList = await pinecone.listIndexes();
        return Array.isArray(indexList.indexes) && indexList.indexes.some(idx => idx.name === indexName);
    } catch (error) {
        console.error("Error checking index existence:", error);
        return false;
    }
}

export async function createIndex(indexName: string) {

    await pinecone.createIndexForModel({
        name: indexName,
        cloud: 'aws',
        region: 'us-east-1',
        embed: {
            model: 'multilingual-e5-large',
            fieldMap: { text: 'chunk_text' },
        },
        waitUntilReady: true,
    });

    console.log(`Index '${indexName}' created successfully.`);

}

export type PCQueryResult = {
    id: string;
    pageText: string;
    pageNumber: number;
};

export async function queryPineconeIndex(indexName: string, query: string) {

    const dense_index = pinecone.Index(indexName)

    // Perform a query on the specified index with the given query string
    const response = await dense_index.searchRecords({
        query: {
            topK: 10,
            inputs: { text: query },
        },
        // fields: ['chunk_text', 'category'],
    });

    // Map hits into a list of PCResult objects
    const results = response.result.hits.map(hit => {
        const fields = hit.fields as { text: string; page: number };
        return {
            id: hit._id,
            pageText: fields.text,
            pageNumber: fields.page
        };
    });

    return results;
}

export async function describePineconeIndex(indexName: string) {

    const dense_index = pinecone.Index(indexName)

    const stats = await dense_index.describeIndexStats();

    return stats;
}

export async function upsertRecords(indexName: string, records: IntegratedRecord<RecordMetadata>[]) {

    const dense_index = pinecone.Index(indexName);

    await dense_index.upsertRecords(records);

}