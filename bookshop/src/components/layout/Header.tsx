import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/auth.selectors";
import { Sidebar } from "./Sidebar";
import styles from "./Header.module.css";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartItemsCount = useAppSelector((state) => state.cart.items.length);
  const bookmarkIds = useAppSelector((state) => state.bookmarks.ids);
  const booksById = useAppSelector((state) => state.books.byId);
  
  // Убираем дубликаты и считаем только те ID, для которых книги загружены
  // Это соответствует логике на странице BookmarksPage
  const uniqueBookmarkIds = Array.from(new Set(bookmarkIds));
  const bookmarksCount = uniqueBookmarkIds.filter(id => booksById[id]).length;
  
  const isCartPage = location.pathname === "/cart";
  const isBookmarksPage = location.pathname === "/bookmarks";
  
  const showCartBadge = cartItemsCount > 0 && !isCartPage;
  const showBookmarksBadge = bookmarksCount > 0 && !isBookmarksPage;

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
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            Bookstore
          </Link>

          <form className={`${styles.search} ${styles.desktopSearch}`} role="search" onSubmit={handleSubmit}>
            <input
              className={styles.searchInput}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="search"
              aria-label="Search books"
              ref={searchInputRef}
            />
            <Link
              to={searchLink}
              className={styles.searchLink}
              aria-label="Go to search results"
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

          <nav className={styles.actions} aria-label="Quick actions">
            {/* Показываем иконки только для авторизованных пользователей на десктопе */}
            {isAuthenticated && (
              <>
                <Link to="/bookmarks" className={`${styles.iconButton} ${styles.desktopOnly}`} aria-label="Bookmarks" title="Bookmarks">
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
                  {showBookmarksBadge && (
                    <span className={styles.badge} aria-label={`${bookmarksCount} bookmarks`}>
                      {bookmarksCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className={`${styles.iconButton} ${styles.desktopOnly}`} aria-label="Cart" title="Cart">
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
                  {showCartBadge && (
                    <span className={styles.badge} aria-label={`${cartItemsCount} items in cart`}>
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            {/* Бургер-меню для мобильных устройств */}
            <button
              className={`${styles.iconButton} ${styles.mobileMenuButton}`}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              title="Menu"
              type="button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M3 12h18M3 6h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            {/* Кнопка профиля для десктопа */}
            <button
              className={`${styles.iconButton} ${styles.desktopProfileButton}`}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open profile menu"
              title="Profile"
              type="button"
            >
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
            </button>
          </nav>
        </div>
      </header>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}

export default Header;

