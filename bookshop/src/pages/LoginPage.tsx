import { FormEvent, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useLoginMutation, useSignupMutation } from "@/features/api/authApi";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectAuthLoading, selectAuthError } from "@/features/auth/auth.selectors";
import { authActions } from "@/features/auth/auth.slice";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  
  const passwordChanged = searchParams.get("passwordChanged") === "true";

  // SIGN IN state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // SIGN UP state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const error = useAppSelector(selectAuthError);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(authActions.clearError());

    try {
      await login({ email: signInEmail, password: signInPassword }).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(authActions.clearError());
    setPasswordMismatch(false);

    // Проверка совпадения паролей
    if (signUpPassword !== signUpConfirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      await signup({ name: signUpName, email: signUpEmail, password: signUpPassword }).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const signInForm = (
    <form className={styles.form} onSubmit={handleSignIn}>
      {passwordChanged && (
        <div className={styles.successMessage}>
          Your password has been changed !
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="signin-email">
          Email
        </label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Your email"
          value={signInEmail}
          onChange={(e) => setSignInEmail(e.target.value)}
          required
          disabled={isLoginLoading}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="signin-password">
          Password
        </label>
        <Input
          id="signin-password"
          type="password"
          placeholder="Your password"
          value={signInPassword}
          onChange={(e) => setSignInPassword(e.target.value)}
          required
          disabled={isLoginLoading}
        />
      </div>

      <div className={styles.forgotPassword}>
        <a
          href="/reset-password"
          className={styles.forgotLink}
          onClick={(e) => {
            e.preventDefault();
            navigate("/reset-password");
          }}
        >
          Forgot password ?
        </a>
      </div>

      <Button type="submit" disabled={isLoginLoading} className={styles.submitButton}>
        SIGN IN
      </Button>
    </form>
  );

  const signUpForm = (
    <form className={styles.form} onSubmit={handleSignUp}>
      {error && <div className={styles.error}>{error}</div>}
      {passwordMismatch && (
        <div className={styles.error}>Пароли не совпадают</div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="signup-name">
          Name
        </label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Your name"
          value={signUpName}
          onChange={(e) => setSignUpName(e.target.value)}
          required
          disabled={isSignupLoading}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="signup-email">
          Email
        </label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Your email"
          value={signUpEmail}
          onChange={(e) => setSignUpEmail(e.target.value)}
          required
          disabled={isSignupLoading}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="signup-password">
          Password
        </label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Your password"
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
          required
          disabled={isSignupLoading}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="signup-confirm-password">
          Confirm password
        </label>
        <Input
          id="signup-confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={signUpConfirmPassword}
          onChange={(e) => {
            setSignUpConfirmPassword(e.target.value);
            if (passwordMismatch) {
              setPasswordMismatch(false);
            }
          }}
          required
          disabled={isSignupLoading}
        />
      </div>

      <Button type="submit" disabled={isSignupLoading} className={styles.submitButton}>
        SIGN UP
      </Button>
    </form>
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Tabs
          tabs={[
            { id: "signin", label: "SIGN IN", content: signInForm },
            { id: "signup", label: "SIGN UP", content: signUpForm },
          ]}
          defaultTab="signin"
        />
      </div>
    </div>
  );
}
