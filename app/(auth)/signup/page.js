"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";

export default function SignupPage() {
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
      const { error: signUpError } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
      });

      if (signUpError) {
        setError("Invalid email or password");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Invalid email or password");
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
          Sign Up
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
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
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
              placeholder="Enter your email"
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
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
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
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p role="alert" style={{ color: "#7e3f21", fontSize: "14px" }}>
              {error}
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
            {isLoading ? "Creating account..." : "Create Account"}
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
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#435c34", fontWeight: "600" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
