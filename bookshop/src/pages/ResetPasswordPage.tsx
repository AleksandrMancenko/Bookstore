import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/features/api/authApi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./ResetPasswordPage.module.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ email }).unwrap();
    } catch (err) {
      console.error("Reset password failed:", err);
    }
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>RESET PASSWORD</h1>
          
          <div className={styles.successMessage}>
            You will receive an email <strong>{email}</strong> with a link to reset your password!
          </div>

          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>

            <Button type="button" onClick={handleGoToHome} className={styles.submitButton}>
              GO TO HOME
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>RESET PASSWORD</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" disabled={isLoading} className={styles.submitButton}>
            RESET
          </Button>
        </form>
      </div>
    </div>
  );
}

