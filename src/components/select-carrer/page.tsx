"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectCarrier() {
  const [carrier, setCarrier] = useState('');
  const router = useRouter();
  const handleNext = () => {
    localStorage.setItem('carrier', carrier);
    router.push('/colis-details');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sélectionner un Transporteur</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Choisissez un transporteur :</label>
          <select
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            required
          >
            <option value="">Sélectionnez un transporteur</option>
            <option value="carrier1">Transporteur 1</option>
            <option value="carrier2">Transporteur 2</option>
            <option value="carrier3">Transporteur 3</option>
          </select>
        </div>
        <button
          onClick={handleNext}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
