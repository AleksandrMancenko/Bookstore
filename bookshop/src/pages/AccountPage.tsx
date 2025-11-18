import { FormEvent, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectUser } from "@/features/auth/auth.selectors";
import { authActions } from "@/features/auth/auth.slice";
import { useUpdateProfileMutation, useChangePasswordMutation } from "@/features/api/authApi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./AccountPage.module.css";

export default function AccountPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Загружаем данные пользователя при монтировании
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(authActions.clearError());

    if (!user) return;

    // Обновляем профиль
    try {
      await updateProfile({
        name,
        email,
        userId: user.id,
      }).unwrap();
    } catch (err) {
      console.error("Update profile failed:", err);
      return;
    }

    // Если заполнены поля пароля, меняем пароль
    const hasPasswordFields = currentPassword || newPassword || confirmPassword;
    if (hasPasswordFields) {
      // Проверяем, что все поля пароля заполнены
      if (!currentPassword || !newPassword || !confirmPassword) {
        // Можно показать ошибку, что нужно заполнить все поля
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordMismatch(true);
        return;
      }

      try {
        await changePassword({
          currentPassword,
          newPassword,
        }).unwrap();

        // Очищаем поля пароля после успешной смены
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMismatch(false);
      } catch (err) {
        console.error("Change password failed:", err);
        return;
      }
    }
  };

  const handleCancel = () => {
    // Восстанавливаем исходные значения
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMismatch(false);
    navigate(-1);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Link to="/" className={styles.backButton} aria-label="Back to main">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 12H6M6 12L10 8M6 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>ACCOUNT</h1>
      </div>

      <form className={styles.form} onSubmit={handleSave}>
        {/* PROFILE Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>PROFILE</h2>
          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isUpdatingProfile}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isUpdatingProfile}
              />
            </div>
          </div>
        </div>

        {/* PASSWORD Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>PASSWORD</h2>
          <div className={`${styles.fieldsGrid} ${styles.passwordGrid}`}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="current-password">
                Password
              </label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••"
                disabled={isChangingPassword}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="new-password">
                New password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordMismatch) {
                    setPasswordMismatch(false);
                  }
                }}
                placeholder="New password"
                disabled={isChangingPassword}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirm-password">
                Confirm new password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordMismatch) {
                    setPasswordMismatch(false);
                  }
                }}
                placeholder="Confirm new password"
                disabled={isChangingPassword}
              />
            </div>
          </div>
          {passwordMismatch && (
            <div className={styles.error}>Пароли не совпадают</div>
          )}
        </div>

        {/* Buttons */}
        <div className={styles.actions}>
          <Button
            type="submit"
            disabled={isUpdatingProfile || isChangingPassword}
            className={styles.saveButton}
          >
            SAVE CHANGES
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isUpdatingProfile || isChangingPassword}
            className={styles.cancelButton}
          >
            CANCEL
          </Button>
        </div>
      </form>
    </div>
  );
}

