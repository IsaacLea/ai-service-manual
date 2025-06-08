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
    {
        indexName: "2022-tenere-700",
        indexDisplayName: "Tenere 700 Service Manual (2022)",
    },
];

export function getIndexDisplayRecord(indexName: string): IndexDisplayRecord | undefined {
    return indexes.find((i) => i.indexName === indexName);
}
