"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AuthShell, {
  AuthField,
  authErrorClass,
  authNoticeClass,
  authPrimaryButtonClass,
  authTextLinkClass,
} from "@/components/auth/AuthShell";
import { useLanguage } from "@/components/common/LanguageProvider";
import { recoverySupabase } from "@/lib/supabase-recovery-client";
import {
  getRecoveryRedirectUrl,
  parseRecoveryCallback,
  parseRecoveryTokens,
} from "@/lib/password-recovery";

function RecoveryPageFrame({ title, children }) {
  const { t } = useLanguage();

  return (
    <AuthShell eyebrow={t("myAccount")} title={title}>
      {children}
    </AuthShell>
  );
}

// Password fields get an eye button so the visitor can check what they typed
// before saving it. The shared auth field owns that behaviour, so the recovery
// pages offer exactly the same controls as the sign-in form.
function RecoveryField(props) {
  return <AuthField required {...props} />;
}

function RecoverySubmitButton({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={authPrimaryButtonClass}
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
      <p className="text-sm leading-relaxed text-ink-soft">
        {t("forgotPasswordInstructions")}
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
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
          <p role="alert" className={authErrorClass}>
            {error}
          </p>
        )}
        {message && (
          <p role="status" className={authNoticeClass}>
            {message}
          </p>
        )}
        <RecoverySubmitButton disabled={isLoading}>
          {isLoading ? t("sendingResetEmail") : t("sendResetEmail")}
        </RecoverySubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link href="/login" className={authTextLinkClass}>
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
          <p role="status" className={authNoticeClass}>
            {t("passwordUpdated")}
          </p>
          <p className="mt-6 text-center">
            <Link
              href="/login"
              className={authTextLinkClass}
            >
              {t("backToLogin")}
            </Link>
          </p>
        </>
      ) : linkStatus === "invalid" ? (
        <>
          <p role="alert" className="text-sm leading-relaxed text-ink-soft">
            {t("passwordResetLinkInvalid")}
          </p>
          <p className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className={authTextLinkClass}
            >
              {t("requestNewResetLink")}
            </Link>
          </p>
        </>
      ) : linkStatus === "checking" ? (
        <p role="status" className="text-sm leading-relaxed text-ink-soft">
          {t("checkingPasswordResetLink")}
        </p>
      ) : (
        <>
          <p
            className="text-sm leading-relaxed text-ink-soft"
          >
            {t("chooseNewPassword")}
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
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
              <p role="alert" className={authErrorClass}>
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
