import type { BookBase, BookDetails } from "@/types/book";

export interface ApiResponseBase {
  error: string;
}

export interface NewResponse extends ApiResponseBase {
  books: BookBase[];
}

export interface SearchResponse extends ApiResponseBase {
  total: string;
  page: string;
  books: BookBase[];
}

export interface DetailsResponse extends BookDetails, ApiResponseBase {}

export interface SearchResult {
  items: BookBase[];
  total: number;
  page: number;
}
