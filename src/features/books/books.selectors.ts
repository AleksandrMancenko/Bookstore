import type { RootState } from "@/app/store";

export const selectBookById = (s: RootState, isbn13: string) => s.books.byId[isbn13];
export const selectBooksById = (s: RootState) => s.books.byId;
