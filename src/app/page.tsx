"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    NProgress.start(); // Démarre la barre de chargement

    router.push("/Accueil"); // Redirige vers la page d'accueil

    const timeout = setTimeout(() => {
      NProgress.done(); // Arrête la barre de chargement après un petit délai
    }, 500);

    return () => {
      clearTimeout(timeout);
      NProgress.done(); // S'assure que NProgress s'arrête si le composant est démonté
    };
  }, [router]);

  return null; // Aucun affichage nécessaire
}
