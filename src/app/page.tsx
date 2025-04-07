"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Loader from "@/components/Loader";
import { firebaseConfig } from "../../lib/firebaseConfig";

export default function Home() {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    NProgress.start();

    // Timer pour le loader (5 secondes)
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    // Redirection après 5 secondes
    const redirectTimer = setTimeout(() => {
      router.push("/Accueil");
      NProgress.done();
    }, 1000);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(redirectTimer);
      NProgress.done();
    };
  }, [router]);
  useEffect(() => {
    if ('serviceWorker' in navigator && firebaseConfig) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('SW registered');
        })
        .catch(err => {
          console.log('SW registration failed:', err);
        });
    }
  }, []);

  if (showLoader) {
    return <Loader />
      
  }

  return null;
}