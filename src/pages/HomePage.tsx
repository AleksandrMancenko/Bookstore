import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetNewReleasesQuery, booksApi } from "@/features/api/api";
import { BookCard } from "@/components/books/BookCard";
import { BookPopup } from "@/components/books/BookPopup";
import type { BookBase } from "@/types/book";
import type { RootState } from "@/app/store";
import styles from "./HomePage.module.css";

export default function HomePage(){
  const dispatch = useDispatch();
  const { data: books = [], isLoading } = useGetNewReleasesQuery();
  const [selectedBook, setSelectedBook] = useState<BookBase | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const byId = useSelector((s: RootState) => s.books.byId);

  useEffect(() => {
    books.slice(0, 12).forEach(book => {
      if (!byId[book.isbn13]) {
        dispatch(booksApi.endpoints.getBookDetails.initiate(book.isbn13));
      }
    });
  }, [books, byId, dispatch]);

  const handleImageClick = (book: BookBase) => {
    setSelectedBook(book);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedBook(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>NEW RELEASES BOOKS</h1>
      </header>
      <div className={`grid ${styles.grid}`}>
        {books.slice(0, 12).map(b=> {
          const details = byId[b.isbn13];
          return (
            <BookCard key={b.isbn13}
              book={b}
              author={details?.authors}
              year={details?.year}
              rating={details?.rating}
              onImageClick={() => handleImageClick(b)}
            />
          );
        })}
      </div>
      <BookPopup
        book={selectedBook}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </section>
  );
}
