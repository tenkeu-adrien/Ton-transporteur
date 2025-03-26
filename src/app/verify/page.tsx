"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    setError("");
    try {
      const userRef = doc(db, "users", "USER_ID"); // Remplace par l'ID réel de l'utilisateur
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("Utilisateur introuvable !");
        return;
      }

      const userData = userSnap.data();
      if (userData.verificationCode === code) {
        await updateDoc(userRef, { active: true });
        router.push("/dashboard"); // Redirige vers le tableau de bord
      } else {
        setError("Code incorrect !");
      }
    } catch (err) {
      setError("Erreur lors de la vérification !");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Vérification du code
        </h2>
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Entrez le code reçu"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={handleVerify}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md"
        >
          Vérifier
        </button>
      </div>
    </div>
  );
}
