import { memo } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "@/features/cart/cart.slice";
import { useGetBookDetailsQuery } from "@/features/api/api";
import styles from "./CartCard.module.css";

interface CartCardProps {
  isbn13: string;
  title: string;
  price: string;
  qty: number;
  image: string;
}

export const CartCard = memo(({ isbn13, title, price, qty, image }: CartCardProps) => {
  const dispatch = useDispatch();
  const { data: details } = useGetBookDetailsQuery(isbn13);

  const author = details?.authors?.trim() || "";
  const year = details?.year?.trim() || "";

  const handleQtyChange = (newQty: number, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (newQty >= 1) {
      dispatch(cartActions.setQty({ isbn13, qty: newQty }));
    }
    if (event?.currentTarget) {
      event.currentTarget.blur();
    }
  };

  const handleRemove = () => {
    dispatch(cartActions.remove({ isbn13 }));
  };

  return (
    <article className={styles.card}>
      <div className={styles.cover}>
        <img className={styles.img} src={image} alt={title} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {(author || year) && (
          <p className={styles.meta}>
            {author && <span>{author}</span>}
            {author && year && <span className={styles.separator}>•</span>}
            {year && <span>{year}</span>}
          </p>
        )}
        <div className={styles.quantity}>
          <button
            className={styles.quantityButton}
            onClick={(e) => handleQtyChange(qty - 1, e)}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="Уменьшить количество"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => handleQtyChange(Number(e.target.value) || 1)}
            className={styles.quantityInput}
            aria-label="Количество"
          />
          <button
            className={styles.quantityButton}
            onClick={(e) => handleQtyChange(qty + 1, e)}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="Увеличить количество"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.price}>{price}</span>
        <button
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label="Удалить из корзины"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </article>
  );
});

