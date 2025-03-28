"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../../lib/firebaseConfig"; // Assurez-vous d'avoir configuré Firebase
import Link from "next/link";
import { getShipments } from "../../lib/firebaseUtils";
import Image from "next/image";

const RecentShipments = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      // const querySnapshot = await getDocs(collection(db, "shipments"));
      // const shipmentsData = querySnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
    
      // }));
      // setShipments(shipmentsData);
      const data =  await getShipments()
      setShipments(data)
    };

    fetchShipments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Annonces récentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shipments.slice(0, 3).map((shipment) => (
          <div
            key={shipment.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Conteneur flex pour l'image et le contenu */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Afficher l'image si elle existe */}
              {shipment.images && shipment.images.length > 0 && (
                <Image
                  src={shipment.images[0]} // Afficher la première image du tableau
                  alt={shipment.objectName || "Image du colis"}
                  className="w-full md:w-1/3 h-48 object-cover rounded-md"
                  width={200}
                  height={300}
                />
              )}
              {/* Contenu */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  {shipment.description}
                </h2>
                <p className="text-gray-700 mb-2">
                  Objet : {shipment.objectName || "Non spécifié"}
                </p>
                <p className="text-gray-700 mb-2">
                  Poids : {shipment.weight} 
                </p>
                <p className="text-gray-700 mb-2">
                  De : {shipment.pickupAddress}
                </p>
                <p className="text-gray-700 mb-2">
                  À : {shipment.deliveryAddress}
                </p>
                <p className="text-gray-700 mb-2">
                  Statut : {shipment.status || "Non spécifié"}
                </p>
                <p className="text-gray-700 mb-2">
                  Prix : {shipment.price ? `${shipment.price} €` : "Non spécifié"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="text-center mt-8">
        <Link
          href="/shipments"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
        >
          Voir toutes les annonces
        </Link>
      </div> */}
    </div>
  );
};

export default RecentShipments;