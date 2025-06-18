export type ContentMetadata = {
    dimension: number;
    pageCount: number;
};

// export type UploadContent = {
//     filename: string;
//     indexName: string;
//     pages: PageText[];
//     file: File; // binary contents of the file
// };

export type PageText = {
    page: number;
    text: string;
};

export type User = {
    id: string;
    userName: string;
    password: string;
};