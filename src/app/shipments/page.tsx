"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState,useEffect } from "react";
import Transporteur from "@/components/Transporteur";
import { getShipments } from "../../../lib/firebaseUtils";
// export const metadata: Metadata = {
//   title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

const Settings = () => {
   
    // État pour le filtre de statut
    const [filterStatus, setFilterStatus] = useState("Tous");
    // const [shipments, setShipments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Gestion des couleurs selon le statut
    const getStatusColor = (status) => {
      switch (status) {
        case "En cours":
          return "bg-blue-500";
        case "Livré":
          return "bg-green-500";
        case "Annulé":
          return "bg-red-500";
        case "En attente":
          return "bg-yellow-500";
        default:
          return "bg-gray-500";
      }
    };
    const [shipments, setShipments] = useState([]);
console.log("shipments" ,shipments)
    useEffect(() => {
      const fetchShipments = async () => {
        setIsLoading(true); // Début du chargement
        try {
          const data = await getShipments();
          setShipments(data);
        } catch (error) {
          console.error("Erreur lors du chargement des expéditions :", error);
        }
        setIsLoading(false); // Fin du chargement
      };
  
      fetchShipments();
    }, []);

  console.log("data provenant de firebase" , shipments)
    // Filtrer les expéditions en fonction du statut sélectionné
    const filteredShipments = filterStatus === "Tous"
      ? shipments
      : shipments.filter((shipment) => shipment.status === filterStatus);
  return (
    <DefaultLayout>
      <div className="mx-auto ">
        <Breadcrumb pageName="Gestion des Expédition " />

<Transporteur  data={shipments} isLoading={isLoading}/>

      </div>
    </DefaultLayout>
  );
};

export default Settings;









// export default ShippedPackages;



