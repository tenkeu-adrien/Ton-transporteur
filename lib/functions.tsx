"use client"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc, getDoc ,updateDoc} from "firebase/firestore";
// import { getApp } from "firebase/app";
import {db,auth} from './firebaseConfig'
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// // Initialisation Firebase
// const auth = getAuth(getApp());
// const db = getFirestore(getApp());

/**
 * Créer un nouvel utilisateur et l'ajouter à Firestore
 * @param {Object} userData - Informations de l'utilisateur
 * @returns {Promise<Object>} - Résultat de l'opération
 */










export const createUser = async (data) => {
  const auth = getAuth(); // Récupérer l'instance `auth`

  // // Configurer le reCAPTCHA
  // const appVerifier = new RecaptchaVerifier('recaptcha-container', {
  //   size: 'invisible',
  //   callback: (response) => {
  //     // reCAPTCHA résolu, permettre l'envoi du SMS
  //   },
  // }, auth);

  try {
    // Créer l'utilisateur avec email et mot de passe
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;












    await setDoc(doc(db, "users", user.uid), {
      email: data.email,
      uid: user.uid,
      ...data,
      createdAt: new Date(),
    });
    
    // // Envoyer le code de validation par SMS
    // const phoneNumber = data.phoneNumber; // Assurez-vous que le numéro est au format international (+1234567890)
    // const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

    // // Stocker `confirmationResult` pour une utilisation ultérieure
    // localStorage.setItem('confirmationResult', JSON.stringify(confirmationResult));
    console.log("Utilisateur créé et enregistré dans Firestore", user);             
    return user;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur ou de l'envoi du SMS :", error);
    throw error;
  }
};


/**
 * Connecter un utilisateur avec email et mot de passe
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} - Résultat de l'opération
 */
export const loginnUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Récupérer les infos depuis Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      return { success: true, user: userSnap.data() };
    } else {
      return { success: false, error: "User data not found in Firestore" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    // 1. Connexion à Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Vérifier si l'utilisateur est bien enregistré dans Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User data not found in Firestore");
    }

    return { success: true, user: userDoc.data() };
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return { success: false, error: error.message };
  }
};




import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../lib/firebaseConfig';
import React, { useEffect } from 'react';
import Loader from "@/components/Loader";

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/Accueil'); // Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />; // Affiche un message de chargement pendant la vérification
  }

  if (!user) {
    return null; // Ne rend rien si l'utilisateur n'est pas connecté (la redirection se fait dans useEffect)
  }

  return <>{children}</>; // Rend les composants enfants si l'utilisateur est authentifié
};

export default ProtectedRoute;







/**
 * Met à jour le statut d'un shipment
 * @param shipmentId - ID du shipment à mettre à jour
 * @param newStatus - Nouveau statut ("En attente", "Accepté", "Annulé", etc.)
 * @param cancelReason - [Optionnel] Raison de l'annulation
 * @returns Promise<void>
 */
// export const updateShipmentStatus = async (
//   shipmentId: string,
//   newStatus: string,
//   cancelReason?: string,
//   user?:string,
// ): Promise<void> => {
//   try {
//     const shipmentRef = doc(db, "shipments", shipmentId);
    
//     const updateData: {
//       status: string;
//       updatedAt: Date;
//       cancelReason?: string;
//       cancelledBy?: string;
//       user?:string
//     } = {
//       status: newStatus,
//       updatedAt: new Date(),
//     };

//     // Si c'est une annulation, ajoute la raison
//     if (newStatus === "Annuler" && cancelReason) {
//       updateData.cancelReason = cancelReason;
//       updateData.cancelledBy = user; // ou "transporteur" selon votre logique
//     }
// // console.log("newStatus" ,newStatus , 'shipmentId',shipmentId)
//     await updateDoc(shipmentRef, updateData);
    

    
//     // console.log(`Statut du shipment ${shipmentId} mis à jour à: ${newStatus}`);
//     return null
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour du statut:", error);
//     throw new Error("Échec de la mise à jour du statut");
//   }
// };


export const updateShipmentStatus = async (
  shipmentId: string,
  newStatus: string,
  cancelReason?: string,
  userr?: { id: string; firstName: string; lastName: string; email: string },
  recipientEmail?: string
): Promise<void> => {

   console.log("donnees que je recois" ,userr , newStatus ,shipmentId)
  try {
    const shipmentRef = doc(db, "shipments", shipmentId);
    
    // Récupérer le document avant la mise à jour pour obtenir le nom du colis
    const shipmentSnapshot = await getDoc(shipmentRef);
    
    if (!shipmentSnapshot.exists()) {
      // throw new Error("Shipment non trouvé");
      
    }

    const shipmentData = shipmentSnapshot.data();
    const shipmentName = shipmentData.objectName; // Supposons que le champ s'appelle 'objectName'

    const updateData: {
      status: string;
      updatedAt: Date;
      cancelReason?: string;
      cancelledBy?: string;
    } = {
      status: newStatus,
      updatedAt: new Date(),
    };

    if (newStatus === "Annuler" && cancelReason) {
      updateData.cancelReason = cancelReason;
      updateData.cancelledBy = userr?.id;
    }

    // Mise à jour du document Firestore
    await updateDoc(shipmentRef, updateData);

    // Envoi de l'email si on a toutes les infos nécessaires
    if (recipientEmail && userr && shipmentName) {
      let emailType = "";
      
      switch(newStatus) {
        case "Annuler":
          emailType = "Annuler";
          break;
        case "Accepté":
          emailType = "acceptance";
          break;
        case "Livré":
          emailType = "delivery";
          break;
        default:
          return;
      }
      try {
        const response = await fetch("/api/send-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: recipientEmail,
            shipment: { 
              objectName: shipmentName,
              id: shipmentId 
            },
            type: emailType,
            chatId: shipmentId,
            user: {
              firstName: userr.firstName,
              lastName: userr.lastName
            }
          }),
        });

        if (!response.ok) {
          console.error("Erreur lors de l'envoi de l'email");
        }else {
          return null
        }
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
      }finally{
        return null
      }
    }else{
      return null
    }

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw new Error("Échec de la mise à jour du statut");
  }
};
export function playNotificationSound() {
  try {
    const audio = new Audio('/sound/notification.mp3');
    audio.play().catch(e => {
      console.error('Erreur de lecture du son:', e);
      // Fallback pour les navigateurs mobiles
      if (typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate([200, 100, 200]);
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'audio:', error);
  }
}