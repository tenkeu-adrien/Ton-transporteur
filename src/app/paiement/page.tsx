"use client"
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export const dynamic = "force-dynamic"; // Empêche le pre-rendering

export default function Paiement() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const response = await fetch(
      'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/createCheckoutSession',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // 10,00 € en cents
          currency: 'eur',
          description: 'Frais d\'expédition de colis',
        }),
      }
    );
    const session = await response.json();

    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Paiement des frais d&apos;expédition</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Chargement...' : 'Payer maintenant'}
      </button>
    </div>
  );
}