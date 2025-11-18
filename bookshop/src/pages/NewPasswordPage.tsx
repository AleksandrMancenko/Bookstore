import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSetNewPasswordMutation } from "@/features/api/authApi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./NewPasswordPage.module.css";

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [setNewPassword, { isLoading, isSuccess }] = useSetNewPasswordMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMismatch(false);

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      const token = searchParams.get("token");
      await setNewPassword({ password, token: token || undefined }).unwrap();
      // После успешной установки пароля редиректим на логин с сообщением
      navigate("/login?passwordChanged=true");
    } catch (err) {
      console.error("Set new password failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>NEW PASSWORD</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          {passwordMismatch && (
            <div className={styles.error}>Пароли не совпадают</div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordMismatch) {
                  setPasswordMismatch(false);
                }
              }}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm-password">
              Confirm password
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordMismatch) {
                  setPasswordMismatch(false);
                }
              }}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" disabled={isLoading} className={styles.submitButton}>
            SET PASSWORD
          </Button>
        </form>
      </div>
    </div>
  );
}

