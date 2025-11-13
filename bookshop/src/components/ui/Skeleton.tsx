import { HTMLAttributes } from "react";
import styles from "./Skeleton.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export const Skeleton = ({ lines = 3, className = "", ...rest }: Props) => (
  <div {...rest} className={`${styles.root} ${className}`.trim()}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={styles.line} />
    ))}
  </div>
);



