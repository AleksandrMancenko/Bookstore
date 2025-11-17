import { useSearchParams, Link } from "react-router-dom";
import { useSearchBooksQuery } from "@/features/api/api";
import { BookCard } from "@/components/books/BookCard";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { booksApi } from "@/features/api/api";
import styles from "./SearchPage.module.css";

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
    <section className={styles.section}>
      <header className={styles.header}>
        <Link to="/" className={styles.backButton} aria-label="Back to main">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 12H6M6 12L10 8M6 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>Search results: {query}</h1>
      </header>
      {data && (
        <>
          <p className={styles.found}>Found: {data.total}</p>
          <div className={`grid ${styles.grid}`}>
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
    </section>
  );
}

