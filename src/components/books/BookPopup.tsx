import { useEffect } from "react";
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

  if (!book || !isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e)=>e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
        <img className={styles.fullImage} src={book.image} alt={book.title} />
      </div>
    </div>
  );
}

