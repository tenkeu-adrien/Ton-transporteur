
import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebaseConfig';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { oobCode } = router.query;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setError('');
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success('Mot de passe réinitialisé avec succès');
      setSuccess(true);
      setTimeout(() => router.push('/auth/signin'), 2000);
    } catch (err) {
      setError('Lien invalide ou expiré');
    }
  };

  useEffect(() => {
    if (oobCode) {
      verifyPasswordResetCode(auth, oobCode).catch(() => {
        setError('Code de réinitialisation invalide ou expiré');
      });
    }
  }, [oobCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">Mot de passe réinitialisé. Redirection...</p>}

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />

        <button
          onClick={handleReset}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
