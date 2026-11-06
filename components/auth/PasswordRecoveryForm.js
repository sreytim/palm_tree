"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/common/LanguageProvider";
import { recoverySupabase } from "@/lib/supabase-recovery-client";
import {
  getRecoveryRedirectUrl,
  parseRecoveryCallback,
  parseRecoveryTokens,
} from "@/lib/password-recovery";

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

const recoveryLabelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
  color: "#5a4f3a",
  marginBottom: "6px",
};

const recoveryInputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #ddc79c",
  backgroundColor: "#fffaf0",
  outline: "none",
  fontSize: "16px",
  color: "#2b2417",
  boxSizing: "border-box",
};

// Password fields get an eye button so the visitor can check what they typed
// before saving it. The masked field shows the slashed eye (the password cannot
// be read); clicking swaps it for the open eye and reveals the text. The button
// is a real <button type="button">, so it never submits the form, and its label
// follows the language switcher.
function RecoveryField({ id, label, type = "text", ...inputProps }) {
  const { t } = useLanguage();
  const [isRevealed, setIsRevealed] = useState(false);
  const isPassword = type === "password";
  const revealLabel = isRevealed ? t("hidePassword") : t("showPassword");

  return (
    <div>
      <label htmlFor={id} style={recoveryLabelStyle}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          name={id}
          required
          type={isPassword && isRevealed ? "text" : type}
          style={
            isPassword
              ? { ...recoveryInputStyle, paddingRight: "48px" }
              : recoveryInputStyle
          }
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsRevealed((revealed) => !revealed)}
            aria-label={revealLabel}
            aria-pressed={isRevealed}
            title={revealLabel}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              width: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              border: "none",
              background: "none",
              color: "#5a4f3a",
              cursor: "pointer",
            }}
          >
            {isRevealed ? (
              <Eye size={20} aria-hidden="true" />
            ) : (
              <EyeOff size={20} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
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
      const redirectTo = getRecoveryRedirectUrl(window.location.origin);
      if (!redirectTo) {
        setError(t("passwordResetRequestFailed"));
        return;
      }
      const { error: resetError } = await recoverySupabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo },
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
  // "checking" while the link credentials are redeemed, then either "ready"
  // (the form that sets a new password) or "invalid".
  const [linkStatus, setLinkStatus] = useState("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  // React Strict Mode mounts effects twice in development, but a reset code can
  // only be redeemed once: the second exchange finds no code verifier and
  // reports a perfectly good link as invalid. The promise is kept on the
  // instance so both effect runs share one redemption.
  const redemptionRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    // Redeeming the link is what authorises the password change. It happens on
    // the recovery client, which keeps its session in its own cookie, so the
    // link never signs the visitor in to the archive.
    const redeemRecoveryLink = async () => {
      const { code, flowId, tokenHash, type } = parseRecoveryCallback(
        window.location.search,
      );
      const tokens = parseRecoveryTokens(window.location.hash);

      if (code) {
        const { error: codeError } =
          await recoverySupabase.auth.exchangeCodeForSession(
            code,
            flowId ? { flowId } : undefined,
          );
        if (codeError) {
          throw codeError;
        }
      } else if (tokenHash && type === "recovery") {
        const { error: verifyError } = await recoverySupabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (verifyError) {
          throw verifyError;
        }
      } else if (
        tokens.accessToken &&
        tokens.refreshToken &&
        tokens.type === "recovery"
      ) {
        const { error: sessionError } = await recoverySupabase.auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        });
        if (sessionError) {
          throw sessionError;
        }
      } else {
        // A reload after a successful redemption has no credentials left in
        // the address bar; the recovery session in its own cookie keeps the
        // form open for that case.
        const { data, error: userError } =
          await recoverySupabase.auth.getUser();
        if (userError || !data.user) {
          throw userError ?? new Error("Recovery session missing");
        }
      }

      // Drop the one-time credentials from the address bar so they are not
      // kept in history or shared by copying the link.
      window.history.replaceState({}, "", window.location.pathname);
    };

    if (!redemptionRef.current) {
      redemptionRef.current = redeemRecoveryLink();
    }

    redemptionRef.current
      .then(() => {
        if (!cancelled) {
          setLinkStatus("ready");
        }
      })
      .catch((linkError) => {
        console.error("Password reset link redemption failed:", linkError);
        if (!cancelled) {
          setLinkStatus("invalid");
        }
      });

    return () => {
      cancelled = true;
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
      const { error: updateError } = await recoverySupabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("Password update failed:", updateError);
        setError(t("passwordUpdateFailed"));
      } else {
        // End only the recovery session. The archive session lives under a
        // different storage key, and the new password still has to be typed at
        // the login form, so a reset link never doubles as a login.
        await recoverySupabase.auth.signOut({ scope: "local" });
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
      ) : linkStatus === "invalid" ? (
        <>
          <p role="alert" style={{ color: "#5a4f3a", fontSize: "14px" }}>
            {t("passwordResetLinkInvalid")}
          </p>
          <p style={{ marginTop: "24px", textAlign: "center" }}>
            <Link
              href="/forgot-password"
              style={{ color: "#435c34", fontWeight: "600" }}
            >
              {t("requestNewResetLink")}
            </Link>
          </p>
        </>
      ) : linkStatus === "checking" ? (
        <p role="status" style={{ color: "#5a4f3a", fontSize: "14px" }}>
          {t("checkingPasswordResetLink")}
        </p>
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
