import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface CartItem { isbn13: string; title: string; price: string; qty: number; image: string; }
interface CartState { items: CartItem[]; }
const initial: CartState = { items: [] };

const slice = createSlice({
  name: "cart", initialState: initial,
  reducers: {
    add(state, a: PayloadAction<CartItem>) {
      const i = state.items.findIndex(x => x.isbn13 === a.payload.isbn13);
      if (i>=0) state.items[i].qty += a.payload.qty;
      else state.items.push(a.payload);
    },
    remove(state, a: PayloadAction<{isbn13: string}>) {
      state.items = state.items.filter(x => x.isbn13 !== a.payload.isbn13);
    },
    clear(state){ state.items = []; },
    setQty(state, a: PayloadAction<{isbn13:string; qty:number}>){
      const item = state.items.find(x=>x.isbn13===a.payload.isbn13);
      if (item) item.qty = Math.max(1, a.payload.qty);
    }
  }
});
export const cartActions = slice.actions;
export default slice.reducer;
