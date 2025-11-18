import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useGetNewReleasesQuery, useLazySearchBooksQuery } from "@/features/api/api";
import { BookCard } from "@/components/books/BookCard";
import { BookPopup } from "@/components/books/BookPopup";
import { Pagination } from "@/components/ui/Pagination";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { BookBase } from "@/types/book";
import styles from "./HomePage.module.css";

const PAGE_SIZE = 12;
const FALLBACK_SEARCH_QUERY = "javascript";

// Mock данные для презентации, если API полностью недоступен
const MOCK_BOOKS: BookBase[] = [
  { isbn13: "9780134685991", title: "Effective Java", subtitle: "A Programming Language Guide", price: "$49.99", image: "https://via.placeholder.com/300x400?text=Effective+Java", url: "#" },
  { isbn13: "9780596007126", title: "Head First Design Patterns", subtitle: "A Brain-Friendly Guide", price: "$54.99", image: "https://via.placeholder.com/300x400?text=Design+Patterns", url: "#" },
  { isbn13: "9780137081073", title: "Clean Code", subtitle: "A Handbook of Agile Software Craftsmanship", price: "$47.99", image: "https://via.placeholder.com/300x400?text=Clean+Code", url: "#" },
  { isbn13: "9780596009205", title: "JavaScript: The Good Parts", subtitle: "The Good Parts", price: "$29.99", image: "https://via.placeholder.com/300x400?text=JavaScript", url: "#" },
  { isbn13: "9781491946008", title: "You Don't Know JS", subtitle: "Up & Going", price: "$39.99", image: "https://via.placeholder.com/300x400?text=YDKJS", url: "#" },
  { isbn13: "9780596517748", title: "JavaScript: The Definitive Guide", subtitle: "Master the World's Most-Used Programming Language", price: "$59.99", image: "https://via.placeholder.com/300x400?text=JS+Guide", url: "#" },
  { isbn13: "9780132350884", title: "Clean Architecture", subtitle: "A Craftsman's Guide to Software Structure and Design", price: "$52.99", image: "https://via.placeholder.com/300x400?text=Architecture", url: "#" },
  { isbn13: "9780134686097", title: "Refactoring", subtitle: "Improving the Design of Existing Code", price: "$44.99", image: "https://via.placeholder.com/300x400?text=Refactoring", url: "#" },
  { isbn13: "9780201633610", title: "Design Patterns", subtitle: "Elements of Reusable Object-Oriented Software", price: "$59.99", image: "https://via.placeholder.com/300x400?text=Patterns", url: "#" },
  { isbn13: "9780134757599", title: "Test-Driven Development", subtitle: "By Example", price: "$42.99", image: "https://via.placeholder.com/300x400?text=TDD", url: "#" },
  { isbn13: "9780596002399", title: "Programming Ruby", subtitle: "The Pragmatic Programmers' Guide", price: "$49.99", image: "https://via.placeholder.com/300x400?text=Ruby", url: "#" },
  { isbn13: "9780596007974", title: "Python Cookbook", subtitle: "Recipes for Mastering Python 3", price: "$54.99", image: "https://via.placeholder.com/300x400?text=Python", url: "#" }
];

export default function HomePage(){
  const { data: books = [], isLoading, error, refetch } = useGetNewReleasesQuery();
  const [triggerSearch, { data: searchData, isLoading: isSearchLoading, error: searchError }] = useLazySearchBooksQuery();
  const [usingFallback, setUsingFallback] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookBase | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");

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

  // Определяем, какие книги отображать
  const displayBooks = usingMock ? MOCK_BOOKS : (usingFallback ? (searchData?.items || []) : books);
  const isLoadingData = usingMock ? false : (usingFallback ? isSearchLoading : isLoading);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return displayBooks.slice(start, start + PAGE_SIZE);
  }, [displayBooks, currentPage]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(displayBooks.length / PAGE_SIZE)), [displayBooks.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasBooks = paginatedBooks.length > 0;

  // Автоматический fallback при ошибке основного запроса
  useEffect(() => {
    if (error && !usingFallback && !usingMock && books.length === 0 && !isLoading) {
      const isServerError = ('status' in error && (error.status === 500 || typeof error.status === 'number')) || 
                            ('error' in error && error.error === 'FETCH_ERROR');
      
      if (isServerError) {
        console.log("Используем fallback поиск вместо /new endpoint");
        setUsingFallback(true);
        setTimeout(() => {
          triggerSearch({ query: FALLBACK_SEARCH_QUERY, page: 1 });
        }, 100);
      }
    }
  }, [error, usingFallback, usingMock, books.length, isLoading, triggerSearch]);

  // Если и fallback не сработал - используем mock данные
  useEffect(() => {
    if (usingFallback && !usingMock) {
      if (searchError && !isSearchLoading) {
        console.log("Используем mock данные для презентации - оба API недоступны");
        setUsingMock(true);
      } else if (!isSearchLoading && (!searchData || searchData.items.length === 0)) {
        const timer = setTimeout(() => {
          if (!searchData || searchData.items.length === 0) {
            console.log("Используем mock данные для презентации - поиск не вернул данных");
            setUsingMock(true);
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else if (error && !usingFallback && !usingMock && !isLoading && books.length === 0) {
      const timer = setTimeout(() => {
        if (error && books.length === 0) {
          console.log("Используем mock данные для презентации - основной API недоступен");
          setUsingMock(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [usingFallback, usingMock, searchError, searchData, isSearchLoading, error, isLoading, books.length]);

  // Отключаем mock, если получили данные из API
  useEffect(() => {
    if ((books.length > 0 || (searchData && searchData.items && searchData.items.length > 0)) && usingMock) {
      setUsingMock(false);
    }
  }, [books.length, searchData, usingMock]);

  if (isLoadingData && !usingMock) return <div>Loading...</div>;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>NEW RELEASES BOOKS</h1>
        {usingFallback && !usingMock && (
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
            (Показаны популярные книги по запросу "{FALLBACK_SEARCH_QUERY}")
          </p>
        )}
        {usingMock && (
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
            (Показаны демонстрационные книги - API временно недоступен)
          </p>
        )}
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
              total={displayBooks.length}
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
