import { memo, useMemo } from "react";
import styles from "./Pagination.module.css";

interface Props {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = memo(({ page, total, pageSize, onPageChange }: Props) => {
  const effectivePageSize = pageSize > 0 ? pageSize : 1;
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize));
  const items = useMemo(() => {
    if (totalPages <= 1) {
      return [];
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

  if (items.length === 0) {
    return null;
  }

  const handleClick = (value: number) => {
    if (value === page) return;
    onPageChange(value);
  };

  return (
    <nav className={styles.root} aria-label="Pagination">
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
    </nav>
  );
});



