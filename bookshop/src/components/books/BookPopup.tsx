import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { BookBase } from "@/types/book";
import styles from "./BookPopup.module.css";

interface BookPopupProps {
  book: BookBase | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookPopup({ book, isOpen, onClose }: BookPopupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const subtitle = useMemo(() => book?.subtitle?.trim(), [book?.subtitle]);

  if (!book || !isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.content}
        role="dialog"
        aria-modal="true"
        aria-label={`Book preview ${book.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <figure className={styles.preview}>
          <img className={styles.fullImage} src={book.image} alt={book.title} />
        </figure>
        <div className={styles.details}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <span aria-hidden="true">✕</span>
          </button>
          <p className={styles.badge}>Book Showcase</p>
          <h2 className={styles.title}>{book.title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <div className={styles.meta}>
            <span className={styles.metaLabel}>ISBN</span>
            <span className={styles.metaValue}>{book.isbn13}</span>
          </div>
          <div className={styles.meta}>
            <span className={styles.metaLabel}>Price</span>
            <span className={styles.metaValue}>{book.price}</span>
          </div>
          <Link
            className={styles.link}
            to={`/book/${book.isbn13}`}
            onClick={onClose}
          >
            Open on page
          </Link>
        </div>
      </div>
    </div>
  );
}

