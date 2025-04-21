import { useState } from 'react';
import { auth } from '../../lib/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PasswordResetModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendResetLink = async () => {
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await sendPasswordResetEmail(auth, email);
      toast.success('Un lien de réinitialisation vous a été envoyé par email');
      onClose(); // ou tu peux afficher une confirmation à la place
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Mot de passe oublié
          </h3>
          <p className="text-gray-600 mb-6">
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <button
            onClick={handleSendResetLink}
            disabled={loading}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin inline mr-2" />
                Envoi...
              </>
            ) : (
              'Envoyer le lien'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
