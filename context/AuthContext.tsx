"use client"
import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth'; // Réintégrez useAuthState
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
// Créez le contexte avec une valeur par défaut
type AuthContextType = {
  user: any;
  userData: any;
  loading: boolean;
  error: any;
  // FirebaseError: any;
  // FirebaseLoading: boolean;
  // FirebaseUser:any,
  logout: () => any;
  setUser: (user: any) => void;
};

// Créez le contexte avec le bon type
export const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: false,
  error: null,
  logout: () => {},
  // FirebaseUser:null,
  // FirebaseError: null,
  // FirebaseLoading: false,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [firebaseUser, firebaseLoading, firebaseError] = useAuthState(auth); // Utilisez useAuthState
  const [userData, setUserData] = useState(null); // Pour stocker les données supplémentaires de l'utilisateur
  const [loading, setLoading] = useState(true); // Pour gérer le chargement global
  const [error, setError] = useState(null); // Pour gérer les erreurs globales
 const router = useRouter()
  useEffect(() => {
    if (firebaseUser) {
      // Si l'utilisateur est connecté, récupérez ses informations supplémentaires
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid)); // Récupérez les données de Firestore
          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Mettez à jour les données utilisateur
          }
        } catch (err) {
          setError(err); // Gérez les erreurs
        } finally {
          setLoading(false); // Fin du chargement
        }
      };
      fetchUserData();
    } else {
      setLoading(false); // Si l'utilisateur n'est pas connecté, fin du chargement
      setUserData(null); // Réinitialisez les données utilisateur
    }
  }, [firebaseUser]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (err) {
      setError(err);
    }
  };

  // Valeur du contexte
  const contextValue = {
    logout ,
    user: firebaseUser, // Utilisez firebaseUser comme utilisateur principal
    userData, // Données supplémentaires de l'utilisateur
    loading: firebaseLoading || loading, // Combinez les états de chargement
    error: firebaseError || error, // Combinez les erreurs
    setUser: (user) => {
      // Fonction pour mettre à jour l'utilisateur manuellement (si nécessaire)
      setUserData(null); // Réinitialisez les données utilisateur
      setLoading(true); // Démarrez le chargement
      // Vous pouvez également mettre à jour firebaseUser ici si nécessaire
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};