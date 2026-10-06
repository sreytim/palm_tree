"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/common/LanguageProvider";
import { supabase } from "@/lib/supabase-client";

function RecoveryPageFrame({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: "#f5ecd9",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 18px 45px rgba(74,46,23,0.12)",
          border: "1px solid #ddc79c",
          backgroundColor: "#f5ecd9",
        }}
      >
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#2b2417",
            marginBottom: "12px",
            fontFamily: "var(--font-display)",
          }}
        >
          {title}
        </h1>
        {children}
      </section>
    </div>
  );
}

function RecoveryField({ id, label, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: "500",
          color: "#5a4f3a",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        required
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #ddc79c",
          backgroundColor: "#fffaf0",
          outline: "none",
          fontSize: "16px",
          color: "#2b2417",
          boxSizing: "border-box",
        }}
        {...inputProps}
      />
    </div>
  );
}

function RecoverySubmitButton({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "#435c34",
        color: "#f5ecd9",
        fontWeight: "600",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: "16px",
      }}
    >
      {children}
    </button>
  );
}

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const redirectTo = new URL("/reset-password", window.location.origin);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: redirectTo.toString() },
      );

      if (resetError) {
        console.error("Password reset email request failed:", resetError);
        setError(t("passwordResetRequestFailed"));
      } else {
        setMessage(t("passwordResetEmailSent"));
      }
    } catch (requestError) {
      console.error("Password reset email request failed:", requestError);
      setError(t("passwordResetRequestFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecoveryPageFrame title={t("forgotPassword")}>
      <p style={{ color: "#5a4f3a", fontSize: "14px", marginBottom: "24px" }}>
        {t("forgotPasswordInstructions")}
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <RecoveryField
          id="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          label={t("email")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("enterEmail")}
        />
        {error && (
          <p role="alert" style={{ color: "#7e3f21", fontSize: "14px" }}>
            {error}
          </p>
        )}
        {message && (
          <p role="status" style={{ color: "#435c34", fontSize: "14px" }}>
            {message}
          </p>
        )}
        <RecoverySubmitButton disabled={isLoading}>
          {isLoading ? t("sendingResetEmail") : t("sendResetEmail")}
        </RecoverySubmitButton>
      </form>
      <p
        style={{
          color: "#5a4f3a",
          fontSize: "14px",
          marginTop: "24px",
          textAlign: "center",
        }}
      >
        <Link href="/login" style={{ color: "#435c34", fontWeight: "600" }}>
          {t("backToLogin")}
        </Link>
      </p>
    </RecoveryPageFrame>
  );
}

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [recoveryChecked, setRecoveryChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setRecoveryReady(true);
        setRecoveryChecked(true);
      }
    });
    const timeout = window.setTimeout(() => setRecoveryChecked(true), 10000);

    return () => {
      window.clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("passwordRequirement"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("Password update failed:", updateError);
        setError(t("passwordUpdateFailed"));
      } else {
        setIsComplete(true);
      }
    } catch (updateError) {
      console.error("Password update request failed:", updateError);
      setError(t("passwordUpdateFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecoveryPageFrame title={t("resetPassword")}>
      {isComplete ? (
        <>
          <p role="status" style={{ color: "#435c34", fontSize: "14px" }}>
            {t("passwordUpdated")}
          </p>
          <p style={{ marginTop: "24px", textAlign: "center" }}>
            <Link
              href="/login"
              style={{ color: "#435c34", fontWeight: "600" }}
            >
              {t("backToLogin")}
            </Link>
          </p>
        </>
      ) : !recoveryReady ? (
        <>
          <p
            role={recoveryChecked ? "alert" : "status"}
            style={{ color: "#5a4f3a", fontSize: "14px" }}
          >
            {recoveryChecked
              ? t("passwordResetLinkInvalid")
              : t("checkingPasswordResetLink")}
          </p>
          {recoveryChecked && (
            <p style={{ marginTop: "24px", textAlign: "center" }}>
              <Link
                href="/forgot-password"
                style={{ color: "#435c34", fontWeight: "600" }}
              >
                {t("requestNewResetLink")}
              </Link>
            </p>
          )}
        </>
      ) : (
        <>
          <p
            style={{ color: "#5a4f3a", fontSize: "14px", marginBottom: "24px" }}
          >
            {t("chooseNewPassword")}
          </p>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <RecoveryField
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              label={t("newPassword")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("enterNewPassword")}
            />
            <RecoveryField
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              label={t("confirmPassword")}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={t("confirmNewPassword")}
            />
            {error && (
              <p role="alert" style={{ color: "#7e3f21", fontSize: "14px" }}>
                {error}
              </p>
            )}
            <RecoverySubmitButton disabled={isLoading}>
              {isLoading ? t("updatingPassword") : t("updatePassword")}
            </RecoverySubmitButton>
          </form>
        </>
      )}
    </RecoveryPageFrame>
  );
}
