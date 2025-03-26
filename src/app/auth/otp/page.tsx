
"use client"
import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const VerifyPhoneNumber = () => {
  const [code, setCode] = useState('');

  const handleVerifyCode = async () => {
    const confirmationResult = JSON.parse(localStorage.getItem('confirmationResult'));
    const auth = getAuth();

    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      toast.success('Numéro de téléphone validé avec succès !');
      // Rediriger l'utilisateur ou effectuer d'autres actions
    } catch (error) {
      console.error("Error verifying code:", error);
      toast.error('Code invalide ou erreur de validation.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Validation du Numéro de Téléphone</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code de Validation :</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Entrez le code reçu par SMS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button
            onClick={handleVerifyCode}
            className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhoneNumber;