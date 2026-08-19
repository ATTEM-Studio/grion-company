"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

type RevealTag = "div" | "section" | "span" | "p" | "ul" | "li" | "h2" | "h3" | "figure";

type RevealProps = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  delayMs?: number;
  /** Fires once and stays visible (default) or toggles with viewport. */
  once?: boolean;
};

/**
 * Lightweight scroll-reveal wrapper built on IntersectionObserver.
 * No animation library dependency — keeps the bundle small and respects
 * prefers-reduced-motion via CSS (see .reveal in globals.css).
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delayMs = 0,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  // Dynamic tag with a shared HTMLElement ref — cast once here so call
  // sites stay strongly typed on props while JSX overload resolution
  // doesn't fight the tag union.
  const Component = Tag as unknown as "div";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Component
      ref={ref as RefObject<HTMLDivElement>}
      className={cn("reveal", visible && "is-visible", className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
