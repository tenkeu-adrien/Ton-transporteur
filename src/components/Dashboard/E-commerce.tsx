"use client";
// import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tabless/TableOne";
import CardDataStats from "../CardDataStats";
import { FaClock, FaSpinner, FaTimesCircle, FaCheckCircle, FaBox } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import { db } from "../../../lib/firebaseConfig";


// const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
//   ssr: false,
// });

const ECommerce: React.FC = () => {

  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const { user ,userData} = useContext(AuthContext);



  // console.log("user" ,user?.uid ,"stats" ,stats ,"userData" ,userData?.role)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const shipmentsRef = collection(db, "shipments");
        let shipmentQuery;
  
        // Filtrer d'abord les envois avec un prix supérieur à 0
        let baseQuery = query(shipmentsRef, where("price", "!=", 0));
  
        // Appliquer un filtre supplémentaire selon le rôle de l'utilisateur
        if (userData?.role === "expediteur") {
          shipmentQuery = query(baseQuery, where("expediteurId","==", user?.uid));
        } else {
          // Pour l'admin, garder uniquement le filtre sur le prix
          shipmentQuery = baseQuery;
        }
  
        const querySnapshot = await getDocs(shipmentQuery);
        const newStats = {
          total: 0,
          delivered: 0,
          pending: 0,
          cancelled: 0
        };
        querySnapshot.forEach((doc) => {
          const shipment = doc.data();
          newStats.total++;
  
          switch (shipment.status) {
            case "Accepter":
              newStats.delivered++;
              break;
            case "En attente":
              newStats.pending++;
              break;
            case "Annuler":
              newStats.cancelled++;
              break;
          }
        });
  
        setStats(newStats);
      } catch (error) {
        // console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, [user,userData]);
  


  if (loading) {
    return<div className="col-span-full text-center py-5">
    <FaSpinner className="animate-spin text-green-500 text-4xl mx-auto" />
    <p className="text-gray-500 mt-2">Chargement des données...</p>
  </div>;
  }
  return (
    <>
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
<CardDataStats
  title="Total colis"
  total={stats.total.toString()}
  rate={stats.total > 0 ? `${((stats.total - stats.cancelled) / stats.total * 100).toFixed(1)}%` : "0%"}
  levelUp
>
  <FaBox className="fill-green-500 dark:fill-white" size={22} />
</CardDataStats>

<CardDataStats
  title="Total colis livrés"
  total={stats.delivered.toString()}
  rate={stats.total > 0 ? `${((stats.delivered / stats.total) * 100).toFixed(1)}%` : "0%"}
  levelUp
>
  <FaCheckCircle className="fill-green-500 dark:fill-white" size={22} />
</CardDataStats>

<CardDataStats
  title="Total colis en attente"
  total={stats.pending.toString()}
  rate={stats.total > 0 ? `${((stats.pending / stats.total) * 100).toFixed(1)}%` : "0%"}
  levelUp={stats.pending < stats.total / 2}
>
  <FaClock className="fill-green-500 dark:fill-white" size={22} />
</CardDataStats>

<CardDataStats
  title="Total colis annulés"
  total={stats.cancelled.toString()}
  rate={stats.total > 0 ? `${((stats.cancelled / stats.total) * 100).toFixed(1)}%` : "0%"}
  levelDown
>
  <FaTimesCircle className="fill-green-500 dark:fill-white" size={22} />
</CardDataStats>
    </div>

      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"> */}
    
        {/* <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div> */}
        <ChatCard />
      {/* </div> */}
    </>
  );
};

export default ECommerce;
