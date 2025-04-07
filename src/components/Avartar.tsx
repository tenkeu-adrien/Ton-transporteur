"use client";
import clsx from "clsx";

export function Avatar({ src, name, size = 8 }) {
  // Générer les initiales à partir du nom
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-cover bg-center",
        `size-${size}`
      )}
      style={{
        backgroundImage: src ? `url(${src})` : "none",
        backgroundColor: src ? "transparent" : "#6b7280", // Gris par défaut
      }}
    >
      {!src && (
        <span className="text-white font-semibold text-sm">{initials}</span>
      )}
    </div>
  );
}
