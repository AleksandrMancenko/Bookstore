import { ButtonHTMLAttributes, memo } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

export const Button = memo(({ variant = "primary", loading = false, disabled, children, ...rest }: ButtonProps) => {
  const isDisabled = disabled || loading;
  const className = [
    styles.btn,
    variant === "primary" && styles.primary,
    variant === "secondary" && styles.secondary,
    variant === "ghost" && styles.ghost,
    isDisabled && styles.disabled,
    rest.className
  ].filter(Boolean).join(" ");
  return (<button {...rest} disabled={isDisabled} className={className}>{loading ? "..." : children}</button>);
});



