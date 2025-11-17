import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useRef, ChangeEvent, FormEvent } from "react";
import { useGetBookDetailsQuery, useLazySearchBooksQuery, booksApi } from "@/features/api/api";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { Rating } from "@/components/ui/Rating";
import styles from "./BookPage.module.css";
import { cartActions } from "@/features/cart/cart.slice";
import { bookmarksActions } from "@/features/bookmarks/bookmarks.slice";
import { actions as booksActions } from "@/features/books/books.slice";
import type { RootState } from "@/app/store";

export default function BookPage(){
  const { isbn13 = "" } = useParams();
  const dispatch = useDispatch();
  const booksById = useSelector((s: RootState) => s.books.byId);
  const bookmarkIds = useSelector((s: RootState) => s.bookmarks.ids);
  const { data: entity, isLoading, error } = useGetBookDetailsQuery(isbn13, { skip: !isbn13 });
  const [triggerRelated, { data: relatedData }] = useLazySearchBooksQuery();
  const [email, setEmail] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if (entity?.title) {
      const keyword = entity.title.split(/\s+/)[0] || "";
      if (keyword) triggerRelated({ query: keyword, page: 1 });
    }
  }, [entity?.title, triggerRelated]);

  const related = useMemo(
    () => (relatedData?.items || []).filter(b=>b.isbn13 !== isbn13).slice(0, 16),
    [isbn13, relatedData?.items]
  );

  useEffect(() => {
    related.forEach(book => {
      if (!booksById[book.isbn13]) {
        dispatch(booksApi.endpoints.getBookDetails.initiate(book.isbn13));
      }
    });
  }, [booksById, dispatch, related]);

  // Убираем ограничения для описания после рендера
  useEffect(() => {
    const removeLineClamp = () => {
      // Ищем конкретный элемент описания по ID
      const descElement = document.getElementById('book-description-text');
      if (descElement) {
        // Удаляем все webkit-box свойства
        descElement.style.removeProperty('display');
        descElement.style.removeProperty('-webkit-line-clamp');
        descElement.style.removeProperty('line-clamp');
        descElement.style.removeProperty('-webkit-box-orient');
        descElement.style.removeProperty('-webkit-box-direction');
        descElement.style.removeProperty('-webkit-box-pack');
        descElement.style.removeProperty('-webkit-box-align');
        descElement.style.removeProperty('-webkit-box-flex');
        
        // Удаляем фиксированную высоту ПЕРВЫМ делом
        descElement.style.removeProperty('height');
        descElement.style.removeProperty('min-height');
        
        // Устанавливаем правильные значения
        descElement.style.setProperty('display', 'block', 'important');
        descElement.style.setProperty('overflow', 'visible', 'important');
        descElement.style.setProperty('max-height', 'none', 'important');
        descElement.style.setProperty('min-height', '0', 'important');
        descElement.style.setProperty('height', 'unset', 'important');
        descElement.style.setProperty('text-overflow', 'clip', 'important');
        descElement.style.setProperty('white-space', 'normal', 'important');
      }
      
      // Также обрабатываем все параграфы внутри tabContent
      const tabContents = document.querySelectorAll('[class*="tabContent"]');
      tabContents.forEach((tabContent) => {
        const paragraphs = tabContent.querySelectorAll('p');
        paragraphs.forEach((p) => {
          const element = p as HTMLElement;
          // Удаляем все webkit-box свойства
          element.style.removeProperty('display');
          element.style.removeProperty('-webkit-line-clamp');
          element.style.removeProperty('line-clamp');
          element.style.removeProperty('-webkit-box-orient');
          element.style.removeProperty('-webkit-box-direction');
          
          // Удаляем фиксированную высоту ПЕРВЫМ делом
          element.style.removeProperty('height');
          element.style.removeProperty('min-height');
          
          // Устанавливаем правильные значения
          element.style.setProperty('display', 'block', 'important');
          element.style.setProperty('overflow', 'visible', 'important');
          element.style.setProperty('max-height', 'none', 'important');
          element.style.setProperty('min-height', '0', 'important');
          element.style.setProperty('height', 'unset', 'important');
          element.style.setProperty('text-overflow', 'clip', 'important');
          element.style.setProperty('white-space', 'normal', 'important');
        });
      });
    };

    // Используем requestAnimationFrame для гарантии применения после рендера
    const rafId = requestAnimationFrame(() => {
      removeLineClamp();
      setTimeout(removeLineClamp, 0);
      setTimeout(removeLineClamp, 100);
      setTimeout(removeLineClamp, 500);
    });
    
    // Отслеживаем изменения в DOM при переключении вкладок
    const observer = new MutationObserver(() => {
      requestAnimationFrame(removeLineClamp);
    });

    const tabsContainer = document.querySelector('[class*="tabs"]');
    if (tabsContainer) {
      observer.observe(tabsContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }
    
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [entity?.desc]);

  // Гарантируем, что данные книги сохранены в books.byId
  useEffect(() => {
    if (entity && !booksById[entity.isbn13]) {
      // Явно сохраняем данные книги в books.byId
      dispatch(booksActions.setBook(entity));
    }
  }, [entity, booksById, dispatch]);

  if (isLoading) return <Skeleton lines={6}/>;
  if (error) return <div>Error: {'message' in error ? error.message : 'Unknown error'}</div>;
  if (!entity) return null;

  const tabs = [
    {
      id: "description",
      label: "Description",
      content: entity.desc ? (
        <div style={{ 
          display: 'block',
          width: '100%'
        }}>
          <p 
            id="book-description-text"
            style={{
              display: 'block',
              overflow: 'visible',
              maxHeight: 'none',
              height: 'auto',
              textOverflow: 'clip',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              wordBreak: 'normal',
              visibility: 'visible',
              margin: 0,
              lineHeight: '1.6',
            }}
          >
            {entity.desc}
          </p>
        </div>
      ) : (
        <p>Description not available</p>
      )
    },
    {
      id: "authors",
      label: "Authors",
      content: entity.authors ? <p>{entity.authors}</p> : <p>Author information not available</p>
    },
    {
      id: "reviews",
      label: "Reviews",
      content: <p>Reviews not available yet</p>
    }
  ];

  const format = entity.pdf ? "Paper book / ebook (PDF)" : "Paper book";
  const publisherText = entity.publisher && entity.year 
    ? `${entity.publisher}, ${entity.year}` 
    : entity.publisher || "";
  const isInBookmarks = bookmarkIds.includes(entity.isbn13);

  const handleBookmarkToggle = () => {
    if (entity) {
      // Явно сохраняем данные книги в books.byId перед добавлением в bookmarks
      dispatch(booksActions.setBook(entity));
      dispatch(bookmarksActions.toggle({ isbn13: entity.isbn13 }));
    }
  };

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail("");
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link to="/" className={styles.backButton} aria-label="Back to main">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 12H6M6 12L10 8M6 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>{entity.title}</h1>
      </header>

      <div className={styles.bookCard}>
        <div className={styles.upper}>
          <button
            className={styles.bookmarkButton}
            onClick={handleBookmarkToggle}
            aria-label={isInBookmarks ? "Remove from bookmarks" : "Add to bookmarks"}
            aria-pressed={isInBookmarks}
          >
            <svg viewBox="0 0 24 24" fill={isInBookmarks ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M12 20.75l-1.28-1.17C6.56 15.88 4 13.47 4 10.36 4 7.71 6.09 5.75 8.65 5.75c1.31 0 2.57.55 3.35 1.44.78-.89 2.04-1.44 3.35-1.44 2.56 0 4.65 1.96 4.65 4.61 0 3.11-2.56 5.52-6.72 9.22Z" />
            </svg>
          </button>
          <figure className={styles.cover}>
            <img className={styles.img} src={entity.image} alt={entity.title} />
          </figure>
        </div>
        <div className={styles.content}>
          <div className={styles.priceRating}>
            <span className={styles.price}>{entity.price}</span>
            {entity.rating && (
              <div className={styles.rating}>
                <Rating rating={entity.rating} />
              </div>
            )}
          </div>
          <div className={styles.metaInfo}>
            {entity.authors && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Authors</span>
                <span className={styles.metaValue}>{entity.authors}</span>
              </div>
            )}
            {publisherText && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Publisher</span>
                <span className={styles.metaValue}>{publisherText}</span>
              </div>
            )}
            {entity.language && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Language</span>
                <span className={styles.metaValue}>{entity.language}</span>
              </div>
            )}
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Format</span>
              <span className={styles.metaValue}>{format}</span>
            </div>
          </div>
          <div className={styles.actions}>
            <Button onClick={()=>dispatch(cartActions.add({ ...entity, qty:1 }))}>ADD TO CART</Button>
          </div>
          <div className={styles.previewLink}>
            <span className={styles.preview}>
              Preview book
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs tabs={tabs} />
      </div>

      <div className={styles.socialLinks}>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Share on Facebook"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(entity.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Share on Twitter"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <button 
          className={styles.socialLink}
          aria-label="More options"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="19" cy="12" r="1" fill="currentColor"/>
            <circle cx="5" cy="12" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>

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

      {!!related.length && (
        <div className={styles.related}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.relatedTitle}>Similar Books</h2>
            <div className={styles.relatedNavigation}>
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
          <div className={styles.relatedScroll} ref={scrollContainerRef}>
            {related.map(b=> {
              const details = booksById[b.isbn13];
              return (
                <div key={b.isbn13} className={styles.relatedCardWrapper}>
                  <BookCard
                    book={b}
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

