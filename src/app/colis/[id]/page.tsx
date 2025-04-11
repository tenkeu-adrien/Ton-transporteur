


"use client"; // Indique que ce composant est exécuté côté client

import {useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebaseConfig";
import TransporteurColis from "@/components/TransporteurColis";
// import { AuthContext } from "../../../../context/AuthContext";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function ColisDetailsPage() {
  const params = useParams(); // Récupère les paramètres de l'URL
  const [shipment, setShipment] = useState(null); // État pour stocker les données du colis
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs



  useEffect(() => {
    // Fonction pour récupérer les données du colis
    const fetchShipment = async () => {
      try {
        // Vérifier que `params.id` est une chaîne de caractères
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
        if (!id) {
          // throw new Error("ID du colis non trouvé dans l'URL");
        }
  
        const docRef = doc(db, "shipments", id);
        const docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          // throw new Error("Colis non trouvé");
      
        }
  
        const shipmentData = docSnap.data();
        
        // Récupérer les informations de l'expéditeur
        const expediteurRef = doc(db, "users", shipmentData.expediteurId);
        const expediteurSnap = await getDoc(expediteurRef);
        
        let expediteurData = null;
        if (expediteurSnap.exists()) {
          expediteurData = expediteurSnap.data();
        } else {
          // console.warn("Expéditeur non trouvé");
        }
  
        // console.log("shipment" ,shipment)
        // Formatage des données du colis avec les informations de l'expéditeur
        const formattedShipment = {
          id: docSnap.id,
          ...shipmentData,
          createdAt: shipmentData.createdAt.toDate().toISOString(),
          expediteur: expediteurData ? {
            id: shipmentData.expediteurId,
            firstName: expediteurData.firstName || '',
            lastName: expediteurData.lastName || '',
            email: expediteurData.email || '',
            phone: expediteurData.phoneNumber || '',
            // Ajoutez d'autres champs de l'expéditeur selon vos besoins
          } : null
        };
  
        setShipment(formattedShipment);
      } catch (err) {
        setError(err.message);
        // console.error("Erreur lors de la récupération des données:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchShipment();
  }, [params.id]);

  // Affiche le composant TransporteurColis avec les données du colis
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Gestion des Expédition" />
        <TransporteurColis shipment={shipment} loading={loading} error={error} />
      </div>
    </DefaultLayout>
  );
}


