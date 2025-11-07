import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "@/app/store";
import { BookCard } from "@/components/books/BookCard";
import { booksApi } from "@/features/api/api";

export default function BookmarksPage(){
  const dispatch = useDispatch();
  const ids = useSelector((s:RootState)=>s.bookmarks.ids);
  const byId = useSelector((s:RootState)=>s.books.byId);
  const items = ids.map(id => byId[id]).filter(Boolean);

  useEffect(()=>{
    ids.forEach(id => {
      if (!byId[id]) {
        dispatch(booksApi.endpoints.getBookDetails.initiate(id));
      }
    });
  }, [dispatch, ids, byId]);

  if (ids.length === 0) return <div>No bookmarks</div>;

  return (
    <div className="grid">
      {items.map(b=>
        <BookCard key={b.isbn13}
          book={b}
          author={b.authors}
          year={b.year}
          rating={b.rating}
        />
      )}
    </div>
  );
}

