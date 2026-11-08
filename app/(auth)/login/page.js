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
  authPrimaryButtonClass,
  authTextLinkClass,
} from "@/components/auth/AuthShell";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formState.email,
        password: formState.password,
      });

      if (signInError) {
        console.error("Login failed:", signInError);
        setError(t("invalidCredentials"));
      } else {
        const next = new URLSearchParams(window.location.search).get("next");
        router.push(getSafeRedirectPath(next));
      }
    } catch (signInError) {
      console.error("Login request failed:", signInError);
      setError(t("invalidCredentials"));
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
      title={t("logIn")}
      footer={
        <>
          {t("needAnAccount")}{" "}
          <Link href="/signup" className={authTextLinkClass}>
            {t("signUp")}
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

        <div>
          <AuthField
            id="password"
            label={t("password")}
            type="password"
            autoComplete="current-password"
            required
            value={formState.password}
            onChange={handleChange}
            placeholder={t("enterPassword")}
          />
          <Link
            href="/forgot-password"
            className="mt-2 inline-block text-sm font-medium text-palm-deep hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        {error && (
          <p role="alert" className={authErrorClass}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={authPrimaryButtonClass}
        >
          {isLoading ? t("loggingIn") : t("logIn")}
        </button>
      </form>
    </AuthShell>
  );
}
