import styles from "./Rating.module.css";

interface RatingProps {
  rating?: number | string;
  maxRating?: number;
}

export function Rating({ rating, maxRating = 5 }: RatingProps) {
  const numRating = typeof rating === "string" ? parseFloat(rating) : (rating || 0);
  const filledStars = Math.round(numRating);

  return (
    <div className={styles.rating}>
      {Array.from({ length: maxRating }, (_, i) => (
        <span key={i} className={i < filledStars ? styles.filled : styles.empty}>
          ★
        </span>
      ))}
    </div>
  );
}















