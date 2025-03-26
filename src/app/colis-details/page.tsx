"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ShipmentDetails() {
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    localStorage.setItem('weight', weight);
    localStorage.setItem('dimensions', dimensions);
    localStorage.setItem('content', content);
    router.push('/confirmation');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Détails du Colis</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Poids (kg) :</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Dimensions (cm) :</label>
          <input
            type="text"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            placeholder="L x l x h"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contenu :</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Soumettre
        </button>
      </div>
    </div>
  );
}
