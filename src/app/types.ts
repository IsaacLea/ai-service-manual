

export type QueryResult = {
  message: string;
};

export type ErrorResult = {
  error: string;
  status: string;
};

export type IndexDisplayRecord = {
  indexName: string;
  indexDisplayName: string;
  imgSrc?: string;
}