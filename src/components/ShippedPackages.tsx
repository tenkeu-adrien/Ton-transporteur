"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaEdit, FaMapMarkerAlt, FaMoneyBillWave, FaSpinner } from "react-icons/fa";
import { MdDeleteForever, MdInfoOutline } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../lib/firebaseConfig";
import { getShipmentsByExpediteur } from "../../lib/firebaseUtils";
import EditModal from "./EditModal";
import { db } from "../../lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Image from "next/image";
const ShippedPackages = () => {
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [isLoading, setIsLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleEditClick = (shipment) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShipment(null);
  };

  const handleSave = async (updatedShipment) => {
    try {
      const shipmentRef = doc(db, "shipments", updatedShipment.id);
      await updateDoc(shipmentRef, updatedShipment);
      toast.success("Mise à jour réussie ✅");
      setShipments((prev) =>
        prev.map((shipment) =>
          shipment.id === updatedShipment.id ? updatedShipment : shipment
        )
      );
      handleCloseModal();
    } catch (error) {
    // console.log("erreur lors de la mmise  a jours" ,error)
      toast.error("Erreur lors de la mise à jour ❌");
    } finally {
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        const data = await getShipmentsByExpediteur(user.uid);
        setShipments(data);
      } catch (error) {
        console.error("Erreur lors du chargement des expéditions :", error);
      }
      setIsLoading(false);
    };

    fetchShipments();
  }, [user]);

  const filteredShipments =
    filterStatus === "Tous"
      ? shipments
      : shipments.filter((shipment) => shipment.status === filterStatus);

      const cardsPerPage = 5; // Nombre de cartes par page

      // Calculer les cartes à afficher pour la page actuelle
      const indexOfLastCard = currentPage * cardsPerPage;
      const indexOfFirstCard = indexOfLastCard - cardsPerPage;
      const currentCards = shipments.slice(indexOfFirstCard, indexOfLastCard);
    
      // Fonction pour changer de page
      const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg ">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-xl font-semibold mb-4 sm:mb-0">📦 Colis envoyés</h2>

          <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Link
            className="bg-green-400 p-2 rounded-sm text-white font-bold capitalize"
            href="/start"
          >
            Expédier un colis
          </Link>
    </motion.div>
          
        </div>

        {/* Filtre par statut */}
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2 font-medium">
            Filtrer par statut :
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="Tous">Tous</option>
            <option value="En cours">En cours</option>
            <option value="Livré">Livré</option>
            <option value="Annulé">Annulé</option>
            <option value="En attente">En attente</option>
          </select>
        </div>

        {/* Tableau pour les grands écrans */}
       

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
 {isLoading && (
    <div className="col-span-full text-center py-5">
      <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto" />
      <p className="text-gray-500 mt-2">Chargement des données...</p>
    </div>
  )}
  {!isLoading && filteredShipments.length === 0 && (
    <div className="col-span-full text-center py-5">
      <MdInfoOutline className="text-gray-500 text-4xl mx-auto" />
      <p className="text-gray-500 mt-2">Aucune donnée disponible</p>
    </div>
  )}
  
        {!isLoading &&
          filteredShipments.map((shipment) => (
            <Link
              key={shipment.id}
              href={`/colis/${shipment.id}`} // Redirection vers la page de détails
              className="block"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform transition-transform cursor-pointer">
                {/* Contenu de la carte */}
                <div className="flex">
                  {/* Image du colis */}
                  <div className="w-1/3 h-48 bg-gray-200 relative">
                    <Image
                      src={shipment.images[0] || "https://via.placeholder.com/400x200"}
                      alt="Image du colis"
                      className="w-full h-full object-cover"
                      width={300}
                      height={300}
                      
                    />
                    <span
                      className={`absolute top-2 right-2 px-3 py-1 text-white text-sm rounded ${getStatusColor(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>
                  </div>

                  {/* Informations du colis */}
                  <div className="w-2/3 p-4">
                    <h3 className="text-xl font-semibold mb-2">{shipment.objectName}</h3>
                    <div className="space-y-2 text-gray-600">
                      {/* Départ */}
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-green-600" />
                        <p>
                          <span className="font-medium">Départ :</span> {shipment.pickupAddress}
                        </p>
                      </div>

                      {/* Destination */}
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <p>
                          <span className="font-medium">Destination :</span> {shipment.deliveryAddress}
                        </p>
                      </div>

                      {/* Prix */}
                      <div className="flex items-center space-x-2">
                        <FaMoneyBillWave className="text-yellow-600" />
                        <p>
                          <span className="font-medium">Prix :</span> {shipment.price} €
                        </p>
                      </div>

                      {/* Date */}
                      <div className="grid grid-cols-2 gap-3 w-full">
  {/* Date d'enlèvement */}
  <div className="w-full items-center p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full shrink-0">
        <FaCalendarAlt className="text-yellow-600 dark:text-yellow-300" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Date d&apos;enlèvement</p>
        <p className="text-sm text-gray-600 dark:text-dark-300 truncate">
          {shipment.pickupDate && shipment.pickupDate.toDate
            ? shipment.pickupDate.toDate().toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Date invalide"}
        </p>
      </div>
    </div>
  </div>

  {/* Date de livraison */}
  <div className="w-full items-center p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full shrink-0">
        <FaCalendarAlt className="text-yellow-600 dark:text-yellow-300" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Date de livraison</p>
        <p className="text-sm text-gray-600 dark:text-dark-300 truncate">
          {shipment.deliveryDate && shipment.deliveryDate.toDate
            ? shipment.deliveryDate.toDate().toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Date invalide"}
        </p>
      </div>
    </div>
  </div>
</div>

                    </div>
                  </div>
                </div>

                {/* Informations de l'expéditeur */}
                {/* <div className="p-4 border-t border-gray-200 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={shipment.images[0] || "https://via.placeholder.com/40"}
                      alt="Photo de l'expéditeur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{shipment.senderName || "Expéditeur inconnu"}</p>
                    <p className="text-sm text-gray-500">Expéditeur</p>
                  </div>
                </div> */}
              </div>
            </Link>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft className="text-gray-700" />
          <span className="text-sm text-gray-700">Précédent</span>
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} sur {Math.ceil(filteredShipments.length / cardsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredShipments.length / cardsPerPage)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm text-gray-700">Suivant</span>
          <FaChevronRight className="text-gray-700" />
        </button>
      </div>
    
      </div>

      {isModalOpen && selectedShipment && (
        <EditModal
          shipment={selectedShipment}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default ShippedPackages;