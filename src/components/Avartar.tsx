"use client";
import clsx from "clsx";

export function Avatar({ src, name, size = 8, initialColor = "auto" }) {
  // Générer les initiales à partir du nom
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  // Couleur de fond par défaut si aucune image n'est fournie
  const backgroundColor =
    initialColor === "auto"
      ? `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)` // Couleur aléatoire
      : initialColor;

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-cover bg-center",
        `size-${size}` // Taille dynamique (par exemple, size-8 pour h-8 w-8)
      )}
      style={{
        backgroundImage: src ? `url(${src})` : "none",
        backgroundColor: src ? "transparent" : backgroundColor,
      }}
    >
      {!src && (
        <span className="text-white font-semibold text-sm">{initials}</span>
      )}
    </div>
  );
}