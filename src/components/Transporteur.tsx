"use client";
import Link from "next/link";
import React, {useContext, useEffect, useState } from "react";
import {FaChevronLeft, FaChevronRight, FaRegComments, FaSpinner } from "react-icons/fa";
import {MdInfoOutline } from "react-icons/md";
import ShipmentModal from "./ShipmentModal";
import { useRouter } from "next/navigation";
// import { AuthContext } from "../../context/AuthContext";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import Loader from "./Loader";
import { AuthContext } from "../../context/AuthContext";
const Transporteur = ({ data, isLoading }) => {
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const { user, logout ,loading  ,userData} = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1); // État pour la pagination
  const router =useRouter()
  const cardsPerPage = 5; // Nombre de cartes par page

  console.log("userData" ,userData)
  // Calculer les cartes à afficher pour la page actuelle
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = data.slice(indexOfFirstCard, indexOfLastCard);

  useEffect(() => {
    if (userData?.role != "transporteur") {
      router.push('/mes-colis'); // Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />; // Affiche un message de chargement pendant la vérification
  }

  if (!user) {
    return null; // Ne rend rien si l'utilisateur n'est pas connecté (la redirection se fait dans useEffect)
  }
  
  // Fonction pour changer de page
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

  const filteredShipments = filterStatus === "Tous"
    ? currentCards
    : currentCards.filter((shipment) => shipment.status === filterStatus);


    const handleViewDetails = (id) => {
      router.push(`/colis/${id}`); // Navigue vers la page de détails du colis
    };
    // const { user, userData, loading, error  ,logout} = useContext(AuthContext);
    const message="chargement"
    const handleClick =(shipmentId)=>{
      router.push(`/chat/${shipmentId}`)
    }
  return (
    <>
      <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-xl font-semibold mb-4 sm:mb-0">📦 Colis a expédier</h2>   
   </div>
   <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-medium">
          Filtrer par statut :
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1); // Réinitialiser à la première page lors du changement de filtre
          }}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="Tous">Tous</option>
          <option value="En attente">En attente</option>
          <option value="Accepter">Accepter</option>
          <option value="Annuler">Annuler</option>
        </select>
      </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                {/* {new Date(shipment?.deliveryDate).toLocaleString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })} */}
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
  <button
    onClick={(e) =>{
      e.preventDefault() ;
      e.stopPropagation() ;
       handleClick(shipment.id)}}
    className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-lg shadow hover:bg-green-600 transition duration-300"
  >
    <FaRegComments className="w-4 h-4" />
    <span>Discuter</span>
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
  </button>
</div>




          </div>
        </Link>
      ))}
  </div>

 
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