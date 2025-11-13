import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ fullWidth = true, className = "", ...rest }, ref) => (
    <input ref={ref} {...rest} className={`${styles.input} ${fullWidth ? styles.full : ""} ${className}`.trim()} />
  )
);



