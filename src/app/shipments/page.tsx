"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
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
    // const [shipments, setShipments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Gestion des couleurs selon le statut
   
    const [shipments, setShipments] = useState([]);
// console.log("shipments" ,shipments)
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

  // console.log("data provenant de firebase" , shipments)
    // Filtrer les expéditions en fonction du statut sélectionné

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



