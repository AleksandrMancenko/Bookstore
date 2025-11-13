import { memo, useCallback, type KeyboardEventHandler } from "react";
import { Link } from "react-router-dom";
import type { BookBase } from "@/types/book";
import { Rating } from "@/components/ui/Rating";
import { useGetBookDetailsQuery } from "@/features/api/api";
import styles from "./BookCard.module.css";

interface Props {
  book: BookBase;
  author?: string;
  year?: string;
  rating?: string;
  onImageClick?: () => void;
}

export const BookCard = memo(({ book, author, year, rating, onImageClick }: Props) => {
  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLElement>>((event) => {
    if (!onImageClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onImageClick();
    }
  }, [onImageClick]);

  const hasCompleteExternalMeta = Boolean(author && year && rating);
  const { data: details, isFetching: isFetchingDetails } = useGetBookDetailsQuery(
    book.isbn13,
    { skip: hasCompleteExternalMeta }
  );

  const safeTrim = (value?: string) => value?.trim() ?? "";

  const displayAuthor = safeTrim(author) || safeTrim(details?.authors);
  const displayYear = safeTrim(year) || safeTrim(details?.year);
  const displayRating = rating ?? details?.rating ?? "5";

  const hasAuthor = Boolean(displayAuthor);
  const hasYear = Boolean(displayYear);
  const shouldShowMeta = hasAuthor || hasYear;
  const shouldShowSkeleton = !shouldShowMeta && isFetchingDetails;

  return (
    <article className={styles.card}>
      <div className={styles.upper}>
        <figure
          className={styles.cover}
          onClick={onImageClick}
          role={onImageClick ? "button" : undefined}
          tabIndex={onImageClick ? 0 : undefined}
          onKeyDown={handleKeyDown}
        >
          <img
            className={styles.img}
            src={book.image}
            alt={book.title}
          />
        </figure>
      </div>
      <div className={styles.lower}>
        <Link to={`/book/${book.isbn13}`} className={styles.textLink}>
          <h3 className={styles.title}>{book.title}</h3>
          {shouldShowMeta && (
            <p className={styles.meta}>
              {hasAuthor && <span>{displayAuthor}</span>}
              {hasAuthor && hasYear && <span className={styles.separator}>•</span>}
              {hasYear && <span>{displayYear}</span>}
            </p>
          )}
          {shouldShowSkeleton && (
            <span className={styles.metaSkeleton} aria-label="Загрузка данных об авторе и годе" />
          )}
        </Link>
      </div>
      <div className={styles.footer}>
        <span className={styles.price}>{book.price}</span>
        <div className={styles.rating}><Rating rating={displayRating} /></div>
      </div>
    </article>
  );
});
