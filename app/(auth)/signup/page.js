"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/common/LanguageProvider";
import { supabase } from "@/lib/supabase-client";
import { getSafeRedirectPath } from "@/lib/safe-redirect";

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
      <div
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
            marginBottom: "24px",
            fontFamily: "var(--font-display)",
          }}
        >
          {t("signUp")}
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#5a4f3a",
                marginBottom: "6px",
              }}
            >
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
              placeholder={t("enterEmail")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#5a4f3a",
                marginBottom: "6px",
              }}
            >
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={formState.password}
              onChange={handleChange}
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
              placeholder={t("enterPassword")}
            />
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#435c34",
              color: "#f5ecd9",
              fontWeight: "600",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.5 : 1,
              fontSize: "16px",
            }}
          >
            {isLoading ? t("creatingAccount") : t("createAccount")}
          </button>
        </form>
        <p
          style={{
            color: "#5a4f3a",
            fontSize: "14px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" style={{ color: "#435c34", fontWeight: "600" }}>
            {t("logIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
