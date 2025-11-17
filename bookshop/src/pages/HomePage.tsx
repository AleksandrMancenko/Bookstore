import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useGetNewReleasesQuery } from "@/features/api/api";
import { BookCard } from "@/components/books/BookCard";
import { BookPopup } from "@/components/books/BookPopup";
import { Pagination } from "@/components/ui/Pagination";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { BookBase } from "@/types/book";
import styles from "./HomePage.module.css";

const PAGE_SIZE = 12;

export default function HomePage(){
  const { data: books = [], isLoading } = useGetNewReleasesQuery();
  const [selectedBook, setSelectedBook] = useState<BookBase | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(books.length / PAGE_SIZE)), [books.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return books.slice(start, start + PAGE_SIZE);
  }, [books, currentPage]);

  const handleImageClick = (book: BookBase) => {
    setSelectedBook(book);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedBook(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail("");
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const hasBooks = paginatedBooks.length > 0;

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>NEW RELEASES BOOKS</h1>
      </header>
      {hasBooks ? (
        <>
          <div className={`grid ${styles.grid}`}>
            {paginatedBooks.map(book => (
              <BookCard
                key={book.isbn13}
                book={book}
                onImageClick={() => handleImageClick(book)}
              />
            ))}
          </div>
          <div className={styles.paginationSection}>
            <div className={styles.separator} aria-hidden="true" />
            <Pagination
              page={currentPage}
              total={books.length}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p className={styles.emptyState}>New books are currently unavailable.</p>
      )}
      <section className={styles.newsletterSection} aria-labelledby="newsletter-title">
        <h2 id="newsletter-title" className={styles.newsletterTitle}>SUBSCRIBE TO NEWSLETTER</h2>
        <p className={styles.newsletterText}>
          Be the first to know about new IT books, upcoming releases, exclusive offers and more.
        </p>
        <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
          <label htmlFor="newsletter-email" className={styles.visuallyHidden}>Email</label>
          <div className={styles.newsletterControls}>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={handleEmailChange}
              required
              className={styles.newsletterInput}
            />
            <Button type="submit" className={styles.newsletterButton}>SUBSCRIBE</Button>
          </div>
        </form>
      </section>
      <BookPopup
        book={selectedBook}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </section>
  );
}
