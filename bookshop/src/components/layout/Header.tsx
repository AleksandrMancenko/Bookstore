import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "./Header.module.css";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      setSearch(params.get("q") ?? "");
    } else {
      setSearch("");
    }
  }, [location]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) {
      searchInputRef.current?.focus();
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const trimmedSearch = search.trim();
  const searchLink = trimmedSearch ? `/search?q=${encodeURIComponent(trimmedSearch)}` : "#";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Bookstore
        </Link>

        <form className={styles.search} role="search" onSubmit={handleSubmit}>
          <input
            className={styles.searchInput}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="search"
            aria-label="Поиск книг"
            ref={searchInputRef}
          />
          <Link
            to={searchLink}
            className={styles.searchLink}
            aria-label="Перейти к результатам поиска"
            onClick={(event) => {
              if (!trimmedSearch) {
                event.preventDefault();
                searchInputRef.current?.focus();
              }
            }}
          >
            <span className={styles.searchIcon} aria-hidden="true" />
          </Link>
        </form>

        <nav className={styles.actions} aria-label="Быстрые действия">
          <Link to="/bookmarks" className={styles.iconButton} aria-label="Избранное" title="Избранное">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M12 20.75l-1.28-1.17C6.56 15.88 4 13.47 4 10.36 4 7.71 6.09 5.75 8.65 5.75c1.31 0 2.57.55 3.35 1.44.78-.89 2.04-1.44 3.35-1.44 2.56 0 4.65 1.96 4.65 4.61 0 3.11-2.56 5.52-6.72 9.22Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link to="/cart" className={styles.iconButton} aria-label="Корзина" title="Корзина">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M5.5 5h1.24a1.5 1.5 0 0 1 1.43 1.07L8.9 8h8.35a1 1 0 0 1 .98 1.22l-1.1 4.93a2 2 0 0 1-2 1.53h-6.7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="19" r="1" fill="currentColor" />
              <circle cx="16" cy="19" r="1" fill="currentColor" />
            </svg>
          </Link>
          <Link to="/login" className={styles.iconButton} aria-label="Профиль" title="Профиль">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="9" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M6 19.5c1.21-2.36 3.64-3.5 6-3.5s4.79 1.14 6 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

