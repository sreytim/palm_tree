"use client";

import { useEffect, useRef, useState } from "react";

export default function FadeIn({
  children,
  className = "",
  as = "div",
  delay = 0,
}) {
  const Component = as;
  const elementRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (
      !element ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    setIsReady(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={elementRef}
      className={`reveal ${className}`}
      data-reveal-ready={isReady ? "true" : undefined}
      data-reveal-visible={isVisible ? "true" : undefined}
      style={{ "--reveal-delay": `${Math.max(0, delay)}ms` }}
    >
      {children}
    </Component>
  );
}
