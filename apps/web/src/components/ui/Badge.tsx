import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "info" | "success" | "warning" | "danger";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({
  children,
  variant = "neutral",
}: BadgeProps) {
  return (
    <span className={`fv-badge fv-badge-${variant}`}>
      {children}
    </span>
  );
}
