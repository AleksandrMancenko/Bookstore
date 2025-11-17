import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import type { RootState } from "@/app/store";
import { BookCard } from "@/components/books/BookCard";
import { booksApi, useGetNewReleasesQuery } from "@/features/api/api";
import styles from "./BookmarksPage.module.css";

export default function BookmarksPage() {
  const dispatch = useDispatch();
  const bookmarkIds = useSelector((s: RootState) => s.bookmarks.ids);
  const booksById = useSelector((s: RootState) => s.books.byId);
  const { data: popularBooks = [] } = useGetNewReleasesQuery();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const favoriteItems = useMemo(
    () => bookmarkIds.map(id => booksById[id]).filter(Boolean),
    [bookmarkIds, booksById]
  );

  useEffect(() => {
    bookmarkIds.forEach(id => {
      if (!booksById[id]) {
        dispatch(booksApi.endpoints.getBookDetails.initiate(id));
      }
    });
  }, [dispatch, bookmarkIds, booksById]);

  const popular = useMemo(
    () => popularBooks.slice(0, 16),
    [popularBooks]
  );

  useEffect(() => {
    popular.forEach(book => {
      if (!booksById[book.isbn13]) {
        dispatch(booksApi.endpoints.getBookDetails.initiate(book.isbn13));
      }
    });
  }, [booksById, dispatch, popular]);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link to="/" className={styles.backButton} aria-label="Back to main">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 12H6M6 12L10 8M6 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>FAVORITES</h1>
      </header>

      {favoriteItems.length > 0 ? (
        <div className={styles.favoritesList}>
          {favoriteItems.map(book => (
            <BookCard
              key={book.isbn13}
              book={book}
              author={book.authors}
              year={book.year}
              rating={book.rating}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>No favorite books yet</p>
      )}

      {popular.length > 0 && (
        <div className={styles.popular}>
          <div className={styles.popularHeader}>
            <h2 className={styles.popularTitle}>Popular Books</h2>
            <div className={styles.popularNavigation}>
              <button
                className={styles.navButton}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                aria-label="Scroll left"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 12H6M6 12L10 8M6 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className={styles.navButton}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                aria-label="Scroll right"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12h12M18 12l-4-4M18 12l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div className={styles.popularScroll} ref={scrollContainerRef}>
            {popular.map(book => {
              const details = booksById[book.isbn13];
              return (
                <div key={book.isbn13} className={styles.popularCardWrapper}>
                  <BookCard
                    book={book}
                    author={details?.authors}
                    year={details?.year}
                    rating={details?.rating}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

