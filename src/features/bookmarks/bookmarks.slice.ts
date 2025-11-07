import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface State { ids: string[] }
const slice = createSlice({
  name: "bookmarks", initialState: { ids: [] } as State,
  reducers: {
    toggle(state, a: PayloadAction<{isbn13: string}>){
      const { isbn13 } = a.payload;
      state.ids = state.ids.includes(isbn13)
        ? state.ids.filter(x=>x!==isbn13)
        : [...state.ids, isbn13];
    }
  }
});
export const bookmarksActions = slice.actions;
export default slice.reducer;
