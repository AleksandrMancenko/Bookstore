import { useSearchParams } from "react-router-dom";
import { useSearchBooksQuery } from "@/features/api/api";
import { BookCard } from "@/components/books/BookCard";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { booksApi } from "@/features/api/api";

export default function SearchPage(){
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const dispatch = useDispatch();
  const byId = useSelector((s: RootState) => s.books.byId);

  const { data, isLoading, error } = useSearchBooksQuery(
    { query, page },
    { skip: !query }
  );

  // preload book details for quick access
  if (data?.items) {
    data.items.forEach(item => {
      if (!byId[item.isbn13]) {
        dispatch(booksApi.endpoints.getBookDetails.initiate(item.isbn13));
      }
    });
  }

  if (!query) return <div>Enter search query</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {'message' in error ? error.message : 'Unknown error'}</div>;

  return (
    <div>
      <h1>Search results: {query}</h1>
      {data && (
        <>
          <p>Found: {data.total}</p>
          <div className="grid">
            {data.items.map(b=> {
              const details = byId[b.isbn13];
              return (
                <BookCard key={b.isbn13}
                  book={b}
                  author={details?.authors}
                  year={details?.year}
                  rating={details?.rating}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

