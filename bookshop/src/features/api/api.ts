import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponseBase, DetailsResponse, NewResponse, SearchResponse, SearchResult } from "@/types/api";
import type { BookBase, BookDetails } from "@/types/book";

const ensureSuccess = (response: ApiResponseBase) => {
  if (response.error && response.error !== "0") {
    throw new Error(response.error);
  }
};

const mapNewReleases = (response: NewResponse): BookBase[] => {
  ensureSuccess(response);
  return response.books;
};

const mapSearch = (response: SearchResponse): SearchResult => {
  ensureSuccess(response);
  return {
    items: response.books,
    total: Number.parseInt(response.total, 10) || 0,
    page: Number.parseInt(response.page, 10) || 1,
  };
};

const mapDetails = (response: DetailsResponse): BookDetails => {
  ensureSuccess(response);
  const { error: _unusedError, ...details } = response;
  void _unusedError;
  return details;
};

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.DEV ? "/api" : "https://api.itbook.store/1.0",
  }),
  tagTypes: ["Book", "BookDetails"],
  endpoints: (builder) => ({
    getNewReleases: builder.query<BookBase[], void>({
      query: () => "/new",
      transformResponse: mapNewReleases,
      providesTags: ["Book"],
    }),
    searchBooks: builder.query<SearchResult, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => `/search/${encodeURIComponent(query)}/${page}`,
      transformResponse: mapSearch,
      providesTags: ["Book"],
    }),
    getBookDetails: builder.query<BookDetails, string>({
      query: (isbn13) => `/books/${isbn13}`,
      transformResponse: mapDetails,
      providesTags: (_result, _error, isbn13) => [{ type: "BookDetails", id: isbn13 }],
    }),
  }),
});

export const { useGetNewReleasesQuery, useSearchBooksQuery, useGetBookDetailsQuery, useLazySearchBooksQuery } = booksApi;

