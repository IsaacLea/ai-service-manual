export type ContentMetadata = {
    dimension: number;
    pageCount: number;
};

export type UploadContent = {
    filename: string;
    indexName: string;
    pages: PageText[];
};

export type PageText = {
    page: number;
    text: string;
};