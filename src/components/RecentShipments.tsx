"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

const RecentShipments = () => {

  // Données statiques de 6 shipments en Europe

  const staticShipments = [{
    id: 1,
    description: "Colis urgent Paris-Berlin",
    objectName: "Documents importants",
    images: ["/images/document.jpg"],
    weight: "0.5 kg",
    pickupAddress: "Paris, France",
    deliveryAddress: "Berlin, Allemagne",
    status: "En attente",
    price: "45",
    departureDate: "15/12",
    arrivalDate: "17/12"
  },
  {
    id: 2,
    description: "Matériel électronique",
    objectName: "Composants PC",
    images: ["/images/electronics.jpg"],
    weight: "8 kg",
    pickupAddress: "Barcelone, Espagne",
    deliveryAddress: "Rome, Italie",
    status: "En cours",
    price: "120",
    departureDate: "10/12",
    arrivalDate: "14/12"
  },
  {
    id: 3,
    description: "Meubles pour appartement",
    objectName: "Table en bois",
    images: ["/images/furniture.jpg"],
    weight: "25 kg",
    pickupAddress: "Amsterdam, Pays-Bas",
    deliveryAddress: "Vienne, Autriche",
    status: "Disponible",
    price: "180",
    departureDate: "18/12",
    arrivalDate: "21/12"
  },
  {
    id: 4,
    description: "Déménagement",
    objectName: "Collection 2024",
    images: ["/images/clothes.jpg"],
    weight: "12 kg",
    pickupAddress: "Milan, Italie",
    deliveryAddress: "Madrid, Espagne",
    status: "En attente",
    price: "85",
    departureDate: "20/12",
    arrivalDate: "23/12"
  },
  {
    id: 5,
    description: "Pièces automobiles",
    objectName: "Moteur complet",
    images: ["/images/car-parts.jpg"],
    weight: "150 kg",
    pickupAddress: "Stuttgart, Allemagne",
    deliveryAddress: "Prague, République Tchèque",
    status: "Disponible",
    price: "250",
    departureDate: "12/12",
    arrivalDate: "15/12"
  },
  {
    id: 6,
    description: "Art contemporain",
    objectName: "Sculpture en verre",
    images: ["/images/art.jpg"],
    weight: "5 kg (fragile)",
    pickupAddress: "Bruxelles, Belgique",
    deliveryAddress: "Londres, Royaume-Uni",
    status: "En cours",
    price: "300",
    departureDate: "14/12",
    arrivalDate: "16/12"
  }];
  const [shipments, setShipments] = useState([]);
  // useEffect(() => {
  //   const fetchShipments = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "shipments"));
  //       const firebaseShipments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  //       // On complète avec les statiques si moins de 6
  //       const finalShipments = firebaseShipments.length >= 6
  //         ? firebaseShipments.slice(0, 6)
  //         : [...firebaseShipments, ...staticShipments.slice(0, 6 - firebaseShipments.length)];

  //       setShipments(finalShipments);
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération des données :", error);
  //       // En cas d'erreur, fallback vers données statiques
  //       setShipments(staticShipments);
  //     }
  //   };

  //   fetchShipments();
  // }, []);


  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const q = query(
          collection(db, "shipments"),
          where("price", "!=", 0)
        );
        const querySnapshot = await getDocs(q);
        const firebaseShipments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        // On complète avec les statiques si moins de 6
        const finalShipments = firebaseShipments.length >= 6
          ? firebaseShipments.slice(0, 6)
          : [...firebaseShipments, ...staticShipments.slice(0, 6 - firebaseShipments.length)];
  
        setShipments(finalShipments);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        // En cas d'erreur, fallback vers données statiques
        setShipments(staticShipments);
      }
    };
  
    fetchShipments();
  }, []);

  // const [shipments] = useState([
  //   {
  //     id: 1,
  //     description: "Colis urgent Paris-Berlin",
  //     objectName: "Documents importants",
  //     images: ["/images/document.jpg"],
  //     weight: "0.5 kg",
  //     pickupAddress: "Paris, France",
  //     deliveryAddress: "Berlin, Allemagne",
  //     status: "En attente",
  //     price: "45",
  //     departureDate: "15/12",
  //     arrivalDate: "17/12"
  //   },
  //   {
  //     id: 2,
  //     description: "Matériel électronique",
  //     objectName: "Composants PC",
  //     images: ["/images/electronics.jpg"],
  //     weight: "8 kg",
  //     pickupAddress: "Barcelone, Espagne",
  //     deliveryAddress: "Rome, Italie",
  //     status: "En cours",
  //     price: "120",
  //     departureDate: "10/12",
  //     arrivalDate: "14/12"
  //   },
  //   {
  //     id: 3,
  //     description: "Meubles pour appartement",
  //     objectName: "Table en bois",
  //     images: ["/images/furniture.jpg"],
  //     weight: "25 kg",
  //     pickupAddress: "Amsterdam, Pays-Bas",
  //     deliveryAddress: "Vienne, Autriche",
  //     status: "Disponible",
  //     price: "180",
  //     departureDate: "18/12",
  //     arrivalDate: "21/12"
  //   },
  //   {
  //     id: 4,
  //     description: "Déménagement",
  //     objectName: "Collection 2024",
  //     images: ["/images/clothes.jpg"],
  //     weight: "12 kg",
  //     pickupAddress: "Milan, Italie",
  //     deliveryAddress: "Madrid, Espagne",
  //     status: "En attente",
  //     price: "85",
  //     departureDate: "20/12",
  //     arrivalDate: "23/12"
  //   },
  //   {
  //     id: 5,
  //     description: "Pièces automobiles",
  //     objectName: "Moteur complet",
  //     images: ["/images/car-parts.jpg"],
  //     weight: "150 kg",
  //     pickupAddress: "Stuttgart, Allemagne",
  //     deliveryAddress: "Prague, République Tchèque",
  //     status: "Disponible",
  //     price: "250",
  //     departureDate: "12/12",
  //     arrivalDate: "15/12"
  //   },
  //   {
  //     id: 6,
  //     description: "Art contemporain",
  //     objectName: "Sculpture en verre",
  //     images: ["/images/art.jpg"],
  //     weight: "5 kg (fragile)",
  //     pickupAddress: "Bruxelles, Belgique",
  //     deliveryAddress: "Londres, Royaume-Uni",
  //     status: "En cours",
  //     price: "300",
  //     departureDate: "14/12",
  //     arrivalDate: "16/12"
  //   }
  // ]);

  return (
    <div className="container mx-auto px-4 py-16 overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-8">Annonces récentes</h2>
      
      {/* Conteneur avec défilement horizontal */}
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex space-x-6 min-w-max">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0"
                style={{ width: "300px" }}
              >
                <div className="flex flex-col h-full">
                  {shipment.images && shipment.images.length > 0 && (
                    <div className="relative h-40 w-full mb-3">
                      <Image
                        src={shipment.images[0]}
                        alt={shipment.objectName}
                        fill
                        style={{ objectFit: "cover" }}
                        // objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                      {shipment.description}
                    </h2>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Objet</p>
                        <p className="font-medium">{shipment.objectName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Poids</p>
                        <p className="font-medium">{shipment.weight}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Départ</p>
                        <p className="font-medium line-clamp-1">{shipment.pickupAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Destination</p>
                        <p className="font-medium line-clamp-1">{shipment.deliveryAddress}</p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          shipment.status === "En attente" ? "bg-yellow-100 text-yellow-800" :
                          shipment.status === "En cours" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {shipment.status}
                        </span>
                        <span className="font-bold text-green-600">{shipment.price} €</span>
                      </div>
                      {/* <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors text-sm">
                        Voir détails
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton pour voir toutes les annonces */}
      {/* <div className="text-center mt-8">
        <Link href="/mes-colis" className="w-full capitalize bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors text-sm">
          Voir toutes les annonces
        </Link>
      </div> */}
    </div>
  );
};

export default RecentShipments;