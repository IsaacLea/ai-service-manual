export type ContentMetadata = {
    dimension: number;
    pageCount: number;
};

export type UploadContent = {
    filename: string;
    pages: PageText[];
};

export type PageText = {
    page: number;
    text: string;
};