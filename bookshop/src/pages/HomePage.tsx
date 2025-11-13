import { useState, useMemo } from "react";
import { useGetNewReleasesQuery } from "@/features/api/api";
import { BookCard } from "@/components/books/BookCard";
import { BookPopup } from "@/components/books/BookPopup";
import type { BookBase } from "@/types/book";
import styles from "./HomePage.module.css";

export default function HomePage(){
  const { data: books = [], isLoading } = useGetNewReleasesQuery();
  const [selectedBook, setSelectedBook] = useState<BookBase | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const newReleases = useMemo(() => books.slice(0, 12), [books]);

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
        {newReleases.map(book => (
          <BookCard
            key={book.isbn13}
            book={book}
            onImageClick={() => handleImageClick(book)}
          />
        ))}
      </div>
      <BookPopup
        book={selectedBook}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </section>
  );
}
