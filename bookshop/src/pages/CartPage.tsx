import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/app/store";
import { booksApi } from "@/features/api/api";
import { CartCard } from "@/components/cart/CartCard";
import { Button } from "@/components/ui/Button";
import styles from "./CartPage.module.css";

function parsePrice(p: string) {
  const n = Number(p.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.cart.items);
  const booksById = useSelector((s: RootState) => s.books.byId);

  useEffect(() => {
    items.forEach((item) => {
      if (!booksById[item.isbn13]) {
        dispatch(booksApi.endpoints.getBookDetails.initiate(item.isbn13));
      }
    });
  }, [items, booksById, dispatch]);

  const { sumTotal, vat, total } = useMemo(() => {
    const sum = items.reduce((acc, item) => acc + parsePrice(item.price) * item.qty, 0);
    const tax = sum * 0.18; // 18% VAT
    const totalAmount = sum + tax;
    return {
      sumTotal: sum,
      vat: tax,
      total: totalAmount,
    };
  }, [items]);

  const formatPrice = (price: number) => {
    return `$ ${price.toFixed(2)}`;
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link to="/" className={styles.backButton} aria-label="Back to main">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 12H6M6 12L10 8M6 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>YOUR CART</h1>
      </header>

      {items.length > 0 ? (
        <>
          <div className={styles.cartList}>
            {items.map((item) => (
              <CartCard
                key={item.isbn13}
                isbn13={item.isbn13}
                title={item.title}
                price={item.price}
                qty={item.qty}
                image={item.image}
              />
            ))}
          </div>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Sum total</span>
              <span className={styles.summaryValue}>{formatPrice(sumTotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>VAT</span>
              <span className={styles.summaryValue}>{formatPrice(vat)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabelTotal}>TOTAL:</span>
              <span className={styles.summaryValueTotal}>{formatPrice(total)}</span>
            </div>
            <Button className={styles.checkoutButton}>CHECK OUT</Button>
          </div>
        </>
      ) : (
        <p className={styles.emptyState}>Корзина пуста</p>
      )}
    </div>
  );
}

