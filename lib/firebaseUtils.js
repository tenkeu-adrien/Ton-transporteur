import { db } from "../lib/firebaseConfig"; // Assure-toi que ton Firebase est bien configuré
import { collection, getDocs , doc , getDoc ,query, where} from "firebase/firestore";

// import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const getShipments = async () => {
  try {
    const shipmentsCollection = collection(db, "shipments");
    const snapshot = await getDocs(shipmentsCollection);
    
    // Récupérer les shipments avec prix > 0
    const shipmentsWithPrice = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(shipment => shipment.price !== 0 && shipment.price !== "0");

    // Récupérer les informations des expéditeurs pour chaque shipment
    const shipmentsWithExpediters = await Promise.all(
      shipmentsWithPrice.map(async (shipment) => {
        if (shipment.expediteurId) {
          const expediteurDoc = await getDoc(doc(db, "users", shipment.expediteurId));
          if (expediteurDoc.exists()) {
            // On ajoute les informations de l'expéditeur dans un champ 'expediteur'
            return {
              ...shipment,
              expediteur: {
                id: expediteurDoc.id,
                ...expediteurDoc.data()
              }
            };
          }
        }
        // Si pas d'expediteurId ou si l'utilisateur n'existe pas
        return {
          ...shipment,
          expediteur: null
        };
      })
    );

    return shipmentsWithExpediters;
  } catch (error) {
    console.error("Erreur lors de la récupération des shipments :", error);
    return [];
  }
};


// import { db } from "./firebase"; // Assurez-vous que la connexion Firebase est bien configurée
// import { collection, query, where, getDocs } from "firebase/firestore";

// import { db } from "./firebaseConfig"; // Vérifie que db est bien importé

export const getShipmentsByExpediteur = async (expediteurId) => {
  try {
    const q = query(collection(db, "shipments"), where("expediteurId", "==", expediteurId)); // ✅ query est bien défini ici
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erreur lors de la récupération des expéditions :", error);
    return [];
  }

};


