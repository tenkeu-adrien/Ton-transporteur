"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaHashtag, FaMapMarkerAlt, FaRegComments, FaSearch, FaSpinner } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa6";
import { auth, db } from "../../lib/firebaseConfig";
import { updateShipmentStatus } from "../../lib/functions";
import { collection, getDocs, limit, onSnapshot, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./Loader";
import { FiPackage } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
const ShipmentCard = ({ shipment, handleClick, handleCancelShipment }) => {
  // Déplacer les états de la modale dans un composant séparé
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/Accueil'); // Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />; // Affiche un message de chargement pendant la vérification
  }

  if (!user) {
    return null; // Ne rend rien si l'utilisateur n'est pas connecté (la redirection se fait dans useEffect)
  }

  const [cancelReason, setCancelReason] = useState('');
  function getStatusColor(status: string) {
    switch (status) {
      case "En attente":
        return "bg-yellow-500"; // Jaune pour les envois en attente
      // case "Accepter":
      //   return "bg-blue-500"; // Bleu pour les envois en cours
      case "Accepter":
        return "bg-green-500"; // Vert pour les envois livrés
      case "Annuler":
        return "bg-red-500"; // Rouge pour les envois annulés
      default:
        return "bg-gray-500"; // Gris pour les statuts inconnus
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform transition-transform cursor-pointer">
      {/* ... contenu de la carte ... */}
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
                  <a
                    className="text-xl font-semibold mb-2 block capitalize" 
                    href={`/colis/${shipment.id}`}
                  >
                    {shipment.objectName}
                  </a>
                  <p className="flex items-center">
      <FaHashtag className="mr-2" /> {/* Ajoutez l'icône ici */}
      <span className="font-medium text-sm">Référence du colis:</span> {shipment?.reference ?? null}
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

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {/* Date d'enlèvement */}
                      <div className="w-full items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-yellow-100 rounded-full shrink-0">
                            <FaCalendarAlt className="text-yellow-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700">Date d&apos;enlèvement</p>
                            <p className="text-sm text-gray-600 truncate">
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
                      <div className="w-full items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-yellow-100 rounded-full shrink-0">
                            <FaCalendarAlt className="text-yellow-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700">Date de livraison</p>
                            <p className="text-sm text-gray-600 truncate">
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
      {/* Boutons d'action */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        {/* ... bouton Discuter ... */}
        <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClick(shipment.id);
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-lg shadow hover:bg-green-600 transition duration-300 relative"
                  >
                    <FaRegComments className="w-4 h-4" />
                    <span>Discuter</span>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </button>
        {/* Bouton Annuler l'offre */}
        <button
          onClick={(e) => { 
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600 transition duration-300"
        >
          Annuler l&apos;offre
        </button>

        {/* Modale d'annulation */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <div 
                      className="bg-white p-5 rounded-lg shadow-lg w-80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold mb-3">Pourquoi annuler l'offre ?</h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`cancelReason-${shipment.id}`}
                            value="client_annulation"
                            onChange={(e) => {  
                              e.preventDefault();
                              e.stopPropagation();
                              setCancelReason(e.target.value);
                            }}
                            className="form-radio"
                          />
                          <span>Le client a décidé d'annuler le transport</span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`cancelReason-${shipment.id}`}
                            value="transporteur_annulation"
                            onChange={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCancelReason(e.target.value);
                            }}
                            className="form-radio"
                          />
                          <span>Le transporteur a décidé d'annuler la livraison</span>
                        </label>
                      </div>

                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={(e) => {  
                            e.preventDefault();
                            e.stopPropagation();
                            setIsModalOpen(false);
                          }}
                          className="bg-gray-300 px-3 py-1 rounded-lg text-sm"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation();
                            if (cancelReason) {
                              handleCancelShipment(shipment.id, cancelReason);
                              setIsModalOpen(false);
                            }
                          }}
                          disabled={!cancelReason}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
                        >
                          Confirmer
                        </button>
                      </div>
                    </div>
          </div>
        )}
      </div>
    </div>
  );
};


const ShipmentsList = () => {
  const [filterStatus, setFilterStatus] = useState("En attente");
  const [isLoading, setIsLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [transporteur, setTransporteur] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { user, userData } = useContext(AuthContext);

  useEffect(() => {
    const fetchTransporteur = async () => {
      const q = query(
        collection(db, "users"),
        where("role", "==", "transporteur"),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setTransporteur({ id: doc.id, ...doc.data() });
      }
    };
  
    fetchTransporteur();
  }, []);

  const handleCancelShipment = async (shipmentId, reason) => {
    let newStatus = "Annuler";
    let cancelReason = reason;
    let recipientEmail = transporteur?.email;
    let userr = { ...userData, id: user?.uid };
    await updateShipmentStatus(shipmentId, newStatus, cancelReason, userr, recipientEmail);
    toast.info("Offre Annuler");
  };

  const handleClick = (shipmentId) => {
    router.push(`/chat/${shipmentId}`);
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchShipments = () => {
      setIsLoading(true);
      const q = query(
        collection(db, "shipments"),
        where("expediteurId", "==", user.uid)
      );
    
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const shipmentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShipments(shipmentsData);
        setIsLoading(false);
      }, (error) => {
        setIsLoading(false);
      });
    
      return () => unsubscribe();
    };

    fetchShipments();
  }, [user]);

  // Fonction de recherche
  const filteredShipments = shipments.filter((shipment) => {
    // Filtrage par statut
    const statusMatch = filterStatus === "Tous" || shipment.status === filterStatus;
    const searchTermLower = searchTerm.toLowerCase();
    // Filtrage par terme de recherche
    const searchMatch = 
    searchTerm === "" ||
    shipment.objectName?.toString().toLowerCase().includes(searchTermLower) ||
    shipment.reference?.toString().toLowerCase().includes(searchTermLower) ||
    shipment.price?.toString().includes(searchTerm);
  
  return statusMatch && searchMatch;
});

  const cardsPerPage = 5;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredShipments.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredShipments.length / cardsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-semibold mb-4 sm:mb-0">📦 Mes colis</h2>   
      </div>
      
      {/* Barre de recherche et filtre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
            <option value="Annuler">Annuler</option>
            <option value="En attente">En attente</option>
            <option value="Accepter">Accepter</option>
          </select>
        </div>
      </div>

      {/* Liste des colis (reste inchangé) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {isLoading && (
          <div className="col-span-full text-center py-5">
            <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto" />
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

        {!isLoading && currentCards.map((shipment) => (
          <ShipmentCard 
            key={shipment.id}
            shipment={shipment}
            handleClick={handleClick}
            handleCancelShipment={handleCancelShipment}
          />
        ))}
      </div>

      {/* Pagination (reste inchangé) */}
      {filteredShipments.length > cardsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
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
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            <span className="text-sm text-gray-700">Suivant</span>
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentsList;