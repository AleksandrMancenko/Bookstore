import styles from "./Footer.module.css";

export function Footer() {
  return (
    <div className={styles.footerSection}>
      <div className={styles.footerSeparator} aria-hidden="true" />
      <footer className={styles.footer}>
        <span className={styles.footerCopy}>©2022 Bookstore</span>
        <span className={styles.footerRights}>All rights reserved</span>
      </footer>
    </div>
  );
}

