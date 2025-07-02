import { Index, IndexList, IntegratedRecord, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import { logInfo } from './loggingService';

// Initialize Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.API_KEY_PINECONE!,
});

export type PCQueryResult = {
    id: string;
    pageText: string;
    pageNumber: number;
};

// Simple in-memory cache for pinecone records.  This is used to reduce the number of API calls made to Pinecone
const recordByPageCache = new Map<string, PCQueryResult | null>();
const indexInstanceCache = new Map<string, Index>();
// let cachedIndexNames: string[] = new Array<string>();

// export async function getIndexNames(): Promise<string[]> {

//     // Use cache if available and not expired
//     if (cachedIndexNames && cachedIndexNames.length > 0) {
//         return cachedIndexNames;
//     }

//     logInfo("Fetching index names from Pinecone...");

//     const indexList: IndexList = await pinecone.listIndexes();

//     if (Array.isArray(indexList.indexes)) {
//         cachedIndexNames = indexList.indexes.map(index => index.name);
//         return cachedIndexNames;
//     } else {
//         console.error("Invalid index list format:", indexList);
//         return [];
//     }

// }

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

}

export async function getIndexByName(indexName: string): Promise<Index> {

    // if (indexInstanceCache.has(indexName)) {
    //     return indexInstanceCache.get(indexName)!;
    // }



    const idx = pinecone.Index(indexName);

    // If the index does not exist, throw an error

    // Check if the index exists
    // indexInstanceCache.set(indexName, idx);

    return idx;
}

export async function getRecordByPage(indexName: string, pageNumber: number): Promise<PCQueryResult | null> {

    const cacheKey = indexName + pageNumber;
    const cached = recordByPageCache.get(cacheKey);

    if (cached !== undefined) {
        return cached;
    }

    const dense_index = await getIndexByName(indexName);

    const response = await dense_index.searchRecords({
        query: {
            topK: 1,
            filter: { page: pageNumber },
            inputs: { text: "" }, // Empty text, just filter by page
        },
    });

    const hit = response.result.hits[0];
    if (!hit) {
        recordByPageCache.set(cacheKey, null);
        return null;
    }

    const fields = hit.fields as { chunk_text: string; page: number };
    const result: PCQueryResult = {
        id: hit._id,
        pageText: fields.chunk_text,
        pageNumber: fields.page
    };

    recordByPageCache.set(cacheKey, result);

    return result;
}

export async function queryPineconeIndex(indexName: string, query: string) {

    const dense_index = await getIndexByName(indexName);

    // Perform a query on the specified index with the given query string
    const response = await dense_index.searchRecords({
        query: {
            topK: 8,
            inputs: { text: query },
        },
        // fields: ['chunk_text', 'category'],
    });

    // Map hits into a list of PCResult objects
    const results = response.result.hits.map(hit => {
        const fields = hit.fields as { chunk_text: string; page: number };
        return {
            id: hit._id,
            pageText: fields.chunk_text,
            pageNumber: fields.page
        };
    });

    // Get the next two pages if they do not exist in the results
    // This is to ensure we have enough context in case instructions spill over multiple pages
    const pageNumbers = results.map(r => r.pageNumber);
    const extraRecords: PCQueryResult[] = [];

    for (const result of results) {

        if (!pageNumbers.includes(result.pageNumber + 1)) {
            const nextRecord = await getRecordByPage(indexName, result.pageNumber + 1);
            if (nextRecord) {
                extraRecords.push(nextRecord);
                pageNumbers.push(nextRecord.pageNumber);
            }
        }

        if (!pageNumbers.includes(result.pageNumber + 2)) {
            const nextRecord = await getRecordByPage(indexName, result.pageNumber + 2);
            if (nextRecord) {
                extraRecords.push(nextRecord);
            }
        }
    }

    // Sort the combined results by pageNumber before returning
    const allResults = [...results, ...extraRecords];
    allResults.sort((a, b) => a.pageNumber - b.pageNumber);

    return allResults;
}

export async function describePineconeIndex(indexName: string) {

    const dense_index = await getIndexByName(indexName)

    const stats = await dense_index.describeIndexStats();

    return stats;
}

export async function upsertRecords(indexName: string, records: IntegratedRecord<RecordMetadata>[]) {

    console.log(`Upserting ${records.length} records to index: ${indexName}`);
    const dense_index = await getIndexByName(indexName);

    const BATCH_SIZE = 96;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        await dense_index.upsertRecords(batch);
    }
}

export async function invalidateCache() {
    recordByPageCache.clear();
    indexInstanceCache.clear();
    // cachedIndexNames = [];
    logInfo("Pinecone cache invalidated.");
}