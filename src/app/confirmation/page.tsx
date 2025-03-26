"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic"; // Empêche le pre-rendering

export default function Confirmation() {
  const router = useRouter();

  useEffect(() => {
    // Vous pouvez ajouter ici une logique pour envoyer les données au backend
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Expédition Créée</h1>
        <p className="mb-6">Votre expédition a été créée avec succès !</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Créer une nouvelle expédition
        </button>
      </div>
    </div>
  );
}
