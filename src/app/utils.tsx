import { IndexDisplayRecord } from "./types";

const indexes: IndexDisplayRecord[] = [
    {
        indexName: "tiger-900",
        indexDisplayName: "Tiger 900 Service Manual",
        imgSrc: "/triumph.png",
    },
    {
        indexName: "tiger-900-handbook",
        indexDisplayName: "Tiger 900 Owner's Handbook",
        imgSrc: "/triumph.png",
    },
];

export function getIndexDisplayRecord(indexName: string): IndexDisplayRecord | undefined {
    return indexes.find((i) => i.indexName === indexName);
}
