"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/common/LanguageProvider";
import { supabase } from "@/lib/supabase-client";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import AuthShell, {
  AuthField,
  authErrorClass,
  authFieldClass,
  authLabelClass,
  authNoticeClass,
  authPrimaryButtonClass,
  authTextLinkClass,
} from "@/components/auth/AuthShell";

export default function SignupPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const next = getSafeRedirectPath(
        new URLSearchParams(window.location.search).get("next"),
      );
      const redirectTo = new URL(next, window.location.origin).toString();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formState.email.trim().toLowerCase(),
        password: formState.password,
        options: { emailRedirectTo: redirectTo },
      });

      if (signUpError) {
        console.error("Signup failed:", signUpError);
        setError(t("accountCreationFailed"));
      } else if (data.session) {
        router.push(next);
      } else {
        setMessage(t("signupConfirmationRequired"));
      }
    } catch (signUpError) {
      console.error("Signup request failed:", signUpError);
      setError(t("accountCreationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthShell
      eyebrow={t("myAccount")}
      title={t("createAccount")}
      footer={
        <>
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className={authTextLinkClass}>
            {t("logIn")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className={authLabelClass}>
            {t("email")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            maxLength={254}
            required
            value={formState.email}
            onChange={handleChange}
            className={authFieldClass}
            placeholder={t("enterEmail")}
          />
        </div>

        <AuthField
          id="password"
          label={t("password")}
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={formState.password}
          onChange={handleChange}
          placeholder={t("enterPassword")}
          hint={t("passwordRequirement")}
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

        <button
          type="submit"
          disabled={isLoading}
          className={authPrimaryButtonClass}
        >
          {isLoading ? t("creatingAccount") : t("createAccount")}
        </button>
      </form>
    </AuthShell>
  );
}
