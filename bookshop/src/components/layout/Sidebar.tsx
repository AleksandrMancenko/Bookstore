import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectIsAuthenticated, selectUser } from "@/features/auth/auth.selectors";
import { authActions } from "@/features/auth/auth.slice";
import { useLogoutMutation } from "@/features/api/authApi";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [logout] = useLogoutMutation();

  // Синхронизируем поиск с URL
  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      setSearch(params.get("q") ?? "");
    } else {
      setSearch("");
    }
  }, [location]);

  // Закрываем сайдбар при изменении маршрута
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Блокируем скролл когда сайдбар открыт
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Закрываем сайдбар при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) {
      searchInputRef.current?.focus();
      return;
    }
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  const handleLogout = async () => {
    await logout().unwrap();
    dispatch(authActions.logout());
    onClose();
    navigate("/");
  };

  const handleSignIn = () => {
    onClose();
    navigate("/login");
  };

  const trimmedSearch = search.trim();
  const searchLink = trimmedSearch ? `/search?q=${encodeURIComponent(trimmedSearch)}` : "#";

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
      >
        <div className={styles.content}>
          {/* Close button */}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
            type="button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Search */}
          <form className={styles.search} role="search" onSubmit={handleSubmit}>
            <input
              className={styles.searchInput}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
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
                } else {
                  onClose();
                }
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  d="m21 21-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          </form>

          {/* Navigation items for authenticated users */}
          {isAuthenticated && (
            <nav className={styles.nav}>
              <Link to="/bookmarks" className={styles.navItem} onClick={onClose}>
                FAVORITES
              </Link>
              <Link to="/cart" className={styles.navItem} onClick={onClose}>
                CART
              </Link>
              <Link to="/account" className={styles.navItem} onClick={onClose}>
                ACCOUNT
              </Link>
            </nav>
          )}

          {/* Auth button */}
          <div className={styles.authSection}>
            {isAuthenticated ? (
              <button className={styles.logoutButton} onClick={handleLogout} type="button">
                LOG OUT
              </button>
            ) : (
              <button className={styles.signInButton} onClick={handleSignIn} type="button">
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

