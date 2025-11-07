import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useGetBookDetailsQuery, useLazySearchBooksQuery, booksApi } from "@/features/api/api";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import styles from "./BookPage.module.css";
import { cartActions } from "@/features/cart/cart.slice";
import { bookmarksActions } from "@/features/bookmarks/bookmarks.slice";
import type { RootState } from "@/app/store";

export default function BookPage(){
  const { isbn13 = "" } = useParams();
  const dispatch = useDispatch();
  const bookmarkIds = useSelector((s: RootState) => s.bookmarks.ids);
  const booksById = useSelector((s: RootState) => s.books.byId);
  const { data: entity, isLoading, error } = useGetBookDetailsQuery(isbn13, { skip: !isbn13 });
  const [triggerRelated, { data: relatedData }] = useLazySearchBooksQuery();

  useEffect(()=>{
    if (entity?.title) {
      const keyword = entity.title.split(/\s+/)[0] || "";
      if (keyword) triggerRelated({ query: keyword, page: 1 });
    }
  }, [entity?.title, triggerRelated]);

  const related = useMemo(
    () => (relatedData?.items || []).filter(b=>b.isbn13 !== isbn13).slice(0, 8),
    [isbn13, relatedData?.items]
  );

  useEffect(() => {
    related.forEach(book => {
      if (!booksById[book.isbn13]) {
        dispatch(booksApi.endpoints.getBookDetails.initiate(book.isbn13));
      }
    });
  }, [booksById, dispatch, related]);

  if (isLoading) return <Skeleton lines={6}/>;
  if (error) return <div>Error: {'message' in error ? error.message : 'Unknown error'}</div>;
  if (!entity) return null;

  const tabs = [
    {
      id: "description",
      label: "Description",
      content: entity.desc ? <p>{entity.desc}</p> : <p>Description not available</p>
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

  const isInBookmarks = bookmarkIds.includes(entity.isbn13);

  return (
    <div className={styles.root}>
      <Link to="/" className={styles.backButton} aria-label="Back to main">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>

      <h1 className={styles.title}>{entity.title}</h1>

      <div className={styles.bookCard}>
        <img className={styles.img} src={entity.image} alt={entity.title} />
        <div className={styles.bookInfo}>
          <h2 className={styles.bookTitle}>{entity.title}</h2>
          {entity.subtitle && <p className={styles.subtitle}>{entity.subtitle}</p>}
          <p className={styles.price}>{entity.price}</p>
          {entity.authors && <p className={styles.authors}>Author(s): {entity.authors}</p>}
          {entity.publisher && <p className={styles.publisher}>Publisher: {entity.publisher}</p>}
          {entity.year && <p className={styles.year}>Year: {entity.year}</p>}
          <div className={styles.actions}>
            <Button onClick={()=>dispatch(cartActions.add({ ...entity, qty:1 }))}>Add to Cart</Button>
            <Button
              variant={isInBookmarks ? "secondary" : "ghost"}
              aria-pressed={isInBookmarks}
              onClick={()=>dispatch(bookmarksActions.toggle({ isbn13: entity.isbn13 }))}
            >
              {isInBookmarks ? "Bookmarked" : "Add to Bookmarks"}
            </Button>
          </div>
          {entity.desc && <p className={styles.shortDesc}>{entity.desc.slice(0, 220)}...</p>}
        </div>
      </div>

      <Tabs tabs={tabs} />

      {!!related.length && (
        <div className={styles.related}>
          <h2>Related books</h2>
          <div className="grid">
            {related.map(b=> {
              const details = booksById[b.isbn13];
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
        </div>
      )}
    </div>
  );
}

