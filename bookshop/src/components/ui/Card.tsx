import { HTMLAttributes, ReactNode, memo } from "react";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

export const Card = memo(({ header, footer, children, className = "", ...rest }: CardProps) => (
  <div {...rest} className={`${styles.card} ${className}`.trim()}>
    {header && <div className={styles.header}>{header}</div>}
    <div className={styles.body}>{children}</div>
    {footer && <div className={styles.footer}>{footer}</div>}
  </div>
));



