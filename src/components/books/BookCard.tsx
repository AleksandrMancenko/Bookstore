import { memo, useCallback, type KeyboardEventHandler } from "react";
import { Link } from "react-router-dom";
import type { BookBase } from "@/types/book";
import { Rating } from "@/components/ui/Rating";
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

  return (
    <article className={styles.card}>
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
      <Link to={`/book/${book.isbn13}`} className={styles.textLink}>
        <h3 className={styles.title}>{book.title}</h3>
        {(author || year) && (
          <p className={styles.meta}>
            {author && <span>{author}</span>}
            {author && year && <span className={styles.separator}>•</span>}
            {year && <span>{year}</span>}
          </p>
        )}
      </Link>
      <div className={styles.footer}>
        <span className={styles.price}>{book.price}</span>
        <div className={styles.rating}><Rating rating={rating ?? "5"} /></div>
      </div>
    </article>
  );
});
