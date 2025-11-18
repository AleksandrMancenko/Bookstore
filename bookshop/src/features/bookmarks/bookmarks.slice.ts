import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface State { ids: string[] }
const slice = createSlice({
  name: "bookmarks", initialState: { ids: [] } as State,
  reducers: {
    toggle(state, a: PayloadAction<{isbn13: string}>){
      const { isbn13 } = a.payload;
      // Убираем дубликаты перед обработкой
      const uniqueIds = Array.from(new Set(state.ids));
      state.ids = uniqueIds.includes(isbn13)
        ? uniqueIds.filter(x=>x!==isbn13)
        : [...uniqueIds, isbn13];
    },
    cleanupInvalidIds(state, a: PayloadAction<{validIds: string[]}>){
      // Удаляем ID, которых нет в списке валидных
      const validSet = new Set(a.payload.validIds);
      state.ids = state.ids.filter(id => validSet.has(id));
    }
  }
});
export const bookmarksActions = slice.actions;
export default slice.reducer;
