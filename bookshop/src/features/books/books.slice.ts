import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookDetails } from "@/types/book";
import { booksApi } from "@/features/api/api";

interface BooksState {
  byId: Record<string, BookDetails>;
}

const initial: BooksState = {
  byId: {},
};

const slice = createSlice({
  name: "books",
  initialState: initial,
  reducers: {
    setBook: (state, action: PayloadAction<BookDetails>) => {
      state.byId[action.payload.isbn13] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      booksApi.endpoints.getBookDetails.matchFulfilled,
      (state, action) => {
        state.byId[action.meta.arg] = action.payload;
      }
    );
  },
});

export const actions = slice.actions;
export default slice.reducer;
