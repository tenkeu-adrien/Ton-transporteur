"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaRegComments, FaSpinner, FaSearch } from "react-icons/fa";
import ShipmentModal from "./ShipmentModal";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import Loader from "./Loader";
import { AuthContext } from "../../context/AuthContext";
import { FiPackage } from "react-icons/fi";

const Transporteur = ({ data, isLoading }) => {
  const [filterStatus, setFilterStatus] = useState("En attente");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, loading, userData } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const cardsPerPage = 5;

  useEffect(() => {
    if (userData?.role !== "transporteur") {
      router.back();
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepter":
        return "bg-green-500";
      case "Annuler":
        return "bg-red-500";
      case "En attente":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Fonction de filtrage combinée (statut + recherche)
  const filteredShipments = data.filter((shipment) => {
    const statusMatch = filterStatus === "Tous" || shipment.status === filterStatus;
    
    if (searchTerm === "") return statusMatch;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      statusMatch && (
        (shipment.objectName && shipment.objectName.toString().toLowerCase().includes(searchLower)) ||
        (shipment.reference && shipment.reference.toString().toLowerCase().includes(searchLower)) ||
        (shipment.price && shipment.price.toString().includes(searchTerm))
    ));
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredShipments.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredShipments.length / cardsPerPage);

  const handleClick = (shipmentId) => {
    router.push(`/chat/${shipmentId}`);
  };

  return (
    <>
      <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-xl font-semibold mb-4 sm:mb-0">📦 Colis a expédier</h2>   
        </div>

        {/* Ajout de la barre de recherche et du filtre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom, référence ou prix..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="flex items-center">
            <label htmlFor="statusFilter" className="mr-2 font-medium whitespace-nowrap">
              Filtrer par statut :
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="Tous">Tous</option>
              <option value="En attente">En attente</option>
              <option value="Accepter">Accepter</option>
              <option value="Annuler">Annuler</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading && (
            <div className="col-span-full text-center py-5">
              <FaSpinner className="animate-spin text-green-500 text-4xl mx-auto" />
              <p className="text-gray-500 mt-2">Chargement des données...</p>
            </div>
          )}
          
          {!isLoading && currentCards.length === 0 && (
            <div className="col-span-full text-center py-5">
              <FiPackage className="text-green-600 text-4xl mx-auto" />
              <p className="text-gray-500 mt-2">
                {searchTerm ? "Aucun résultat trouvé pour votre recherche" : "Aucun colis actif trouvé."}
              </p>
            </div>
          )}

{!isLoading &&
      filteredShipments.map((shipment) => (
        <a
          key={shipment.id}
          href={`/colis/${shipment.id}`} // Redirection vers la page de détails
          className="block"
        >
          <div className="bg-white rounded-lg shadow-lg mt-4 overflow-hidden justify-center hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform transition-transform cursor-pointer">
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
                <p>
                      <span className="font-medium text-sm">Référence:</span> {shipment?.reference ?? null}
                    </p>
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

                 <div className="flex flex-row gap-3">

                 <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <FaCalendarAlt className="text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Date d&apos;enlèvement</p>
              <p className="text-sm text-gray-600 dark:text-dark-300">
              {shipment.pickupDate && shipment.pickupDate .toDate
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



                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <FaCalendarAlt className="text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Date de livraison</p>
              <p className="text-sm text-gray-600 dark:text-dark-300">
               
                    {shipment.deliveryDate && shipment.deliveryDate.toDate
                            ? shipment.deliveryDate.toDate().toLocaleString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Date invalideee"}
</p>
            </div>
          </div>
                 </div>
                </div>
              </div>
            </div>

            {/* Informations de l'expéditeur */}
<div className="p-4 border-t border-gray-200 flex items-center justify-between">
  <div className="flex items-center space-x-4">
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <Image
        src={shipment.images[0] || "https://via.placeholder.com/40"}
        alt="Photo de l'expéditeur"
        className="w-full h-full object-cover"
        width={300}
        height={300}
      />
    </div>
    <div>
      <p className="font-medium">{shipment?.expediteur?.firstName || "Expéditeur inconnu"}</p>
      <p className="text-sm text-gray-500">Expéditeur</p>
    </div>
  </div>
  {shipment.status !== "Annulerr" && <button
    onClick={(e) =>{
      e.preventDefault() ;
      e.stopPropagation() ;
       handleClick(shipment.id)}}
    className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-lg shadow hover:bg-green-600 transition duration-300"
  >
    <FaRegComments className="w-4 h-4" />
    <span>Discuter</span>
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
  </button> }
  
</div>
          </div>
        </a>
      ))}
  </div>

        {/* Pagination (inchangée) */}
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
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm text-gray-700">Suivant</span>
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>

        {selectedShipment && (
          <ShipmentModal
            shipment={selectedShipment}
            onClose={() => setSelectedShipment(null)}
          />
        )}
      </div>
    </>
  );
};

export default Transporteur;