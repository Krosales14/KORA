import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  href = "#",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
      : "border border-white/15 bg-white/5 text-white hover:bg-white/10";

  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}