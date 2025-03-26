"use client";
import clsx from "clsx";

export function Box({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl p-3 shadow-sm", // Styles de base
        className // Classes personnalisées
      )}
      {...props}
    >
      {children}
    </div>
  );
}