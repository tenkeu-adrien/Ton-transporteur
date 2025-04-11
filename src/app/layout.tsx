// "use client"

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
// import React, { useEffect, useState } from "react";
import { log } from "console";
// import { useRouter } from "next/navigation";
import { AuthProvider } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import NotificationSetup from "@/components/NotificationSetup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Configuration pour rendre la transition plus fluide

  return (
    <html lang="en">
    <body suppressHydrationWarning={true}>
      <ToastContainer />
            
      <AuthProvider>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {children}
        </div>
      </AuthProvider>
    </body>
  </html>
  );
}
