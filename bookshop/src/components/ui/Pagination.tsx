import { memo, useMemo } from "react";
import styles from "./Pagination.module.css";

interface Props {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={styles.icon}>
    <path
      d="M9.78 3.22a.75.75 0 0 1 0 1.06L6.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={styles.icon}>
    <path
      d="M6.22 12.78a.75.75 0 0 1 0-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Z"
      fill="currentColor"
    />
  </svg>
);

export const Pagination = memo(({ page, total, pageSize, onPageChange }: Props) => {
  const effectivePageSize = pageSize > 0 ? pageSize : 1;
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize));
  const items = useMemo(() => {
    if (totalPages <= 1) {
      return [{ type: "page" as const, value: 1 }];
    }

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => ({ type: "page" as const, value: index + 1 }));
    }

    const result: Array<{ type: "page"; value: number } | { type: "ellipsis"; key: string }> = [
      { type: "page", value: 1 },
    ];

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) {
      result.push({ type: "ellipsis", key: "start" });
    }

    for (let current = start; current <= end; current += 1) {
      result.push({ type: "page", value: current });
    }

    if (end < totalPages - 1) {
      result.push({ type: "ellipsis", key: "end" });
    }

    result.push({ type: "page", value: totalPages });
    return result;
  }, [page, totalPages]);

  const handleClick = (value: number) => {
    if (value === page) return;
    onPageChange(value);
  };

  const handlePrev = () => {
    if (page <= 1) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    onPageChange(page + 1);
  };

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav className={styles.root} aria-label="Pagination">
      <button
        type="button"
        className={`${styles.navButton} ${styles.navPrev} ${!canGoPrev ? styles.navDisabled : ""}`}
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Previous page"
      >
        <ArrowLeftIcon />
        <span className={styles.navLabel}>Prev</span>
      </button>

      <div className={styles.pages} role="list">
        {items.map((item) => {
          if (item.type === "ellipsis") {
            return <span key={item.key} className={styles.ellipsis}>…</span>;
          }

          const isActive = item.value === page;
          return (
            <button
              key={item.value}
              type="button"
              className={`${styles.page} ${isActive ? styles.active : ""}`}
              onClick={() => handleClick(item.value)}
              aria-current={isActive ? "page" : undefined}
            >
              {item.value}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.navButton} ${styles.navNext} ${!canGoNext ? styles.navDisabled : ""}`}
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Next page"
      >
        <span className={styles.navLabel}>Next</span>
        <ArrowRightIcon />
      </button>
    </nav>
  );
});



