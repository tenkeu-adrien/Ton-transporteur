"use client"
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker"; // Installez react-datepicker si nécessaire
import "react-datepicker/dist/react-datepicker.css"; // Styles pour DatePicker
import { AuthContext } from "../../context/AuthContext";
import MapWithRoute from "./MapWithRoute";
import { IoMdArrowBack } from "react-icons/io";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaRegComments, FaSpinner } from "react-icons/fa";
import { FaBox, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle } from "react-icons/fa"; // Importez les icônes nécessaires
import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { auth, db } from "../../lib/firebaseConfig";
import { toast } from "react-toastify";
import { FaUser, FaUserCircle, FaEnvelope, FaPhone } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiMessageSquare } from "react-icons/fi";
import Loader from "./Loader";
// import Navbar from "./Navbar";
 

const TransporteurColis = ({ shipment ,loading ,error }) => {
  const [offerPrice, setOfferPrice] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isRange, setIsRange] = useState(true);
  const [otherShipments, setOtherShipments] = useState([]); // État pour stocker les autres shipments
  const [currentPage, setCurrentPage] = useState(1); // État pour la page actuelle
  const { user, logout } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardsPerPage = 5; // Nombre de cartes par page

  // Calculer les cartes à afficher pour la page actuelle
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = otherShipments.slice(indexOfFirstCard, indexOfLastCard);

  const currentUser = auth.currentUser
 

  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin'); // Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
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

 
  // useEffect(() => {
  //   const fetchOtherShipments = async () => {
  //     try {
  //       const shipmentsRef = collection(db, "shipments");
  //       const q = query(
  //         shipmentsRef,
  //         where("price", ">", 0)
  //       );
  //       const querySnapshot = await getDocs(q);
  //       const shipmentsData = querySnapshot.docs
  //         .map(doc => ({ id: doc.id, ...doc.data() }))
  //         .filter(s => s.id !== shipment.id);
  
  //       setOtherShipments(shipmentsData);
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération des autres shipments :", error);
  //     }
  //   };
  
  //   fetchOtherShipments();
  // }, [shipment?.id]);

 const handleClick =()=>{

  router.push(`/chat/${shipment.id}`)
 }





  // Afficher un indicateur de chargement si `loading` est true
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
        <span className="ml-3 text-lg">Chargement en cours...</span>
      </div>
    );
  }

  // Afficher un message d'erreur si `error` est présent
  if (error) {
    return (
      <div className="text-center text-red-600 p-6">
        <p>Erreur : {error}</p>
      </div>
    );
  }

  // Fonction pour soumettre l'offre
  const handleSubmitOffer = async () => {
    setIsSubmitting(true);
    try {
      // Créer le message dans la collection messages
      const messageRef = await addDoc(collection(db, "messages"), {
        sender: currentUser.uid,
        receiver: shipment.expediteurId,
        shipmentId:shipment.id,
        timestamp: serverTimestamp(),
        isRead: false,
        // senderName: currentUser.displayName,
        // avatar: currentUser.photoURL,
        users: [currentUser.uid, shipment.expediteurId],
        offerDetails: {
          price: offerPrice,
          startDate: startDate.toLocaleDateString(),
          endDate: isRange ? endDate.toLocaleDateString() : null,
          additionalInfo
        }
      });
       // Créer ou mettre à jour la conversation dans une collection "conversations"
    // await setDoc(doc(db, "conversations", `${currentUser.uid}_${shipment.expediteurId}`), {
    //   participants: [currentUser.uid, shipment.expediteurId],
    //   lastMessage: `Offre: ${offerPrice}€`,
    //   lastMessageTime: serverTimestamp(),
    //   shipmentId: shipment.id
    // });

    toast.success("Offre envoyée avec succès");
    
    // Redirection vers la page de chat
    router.push(`/chat/${shipment.id}?isTransporteur=true`);
    // const queryParams = new URLSearchParams({
  
    
//     if (shipment.id) {
//       queryParams.append("shipmentid", shipment.id);
//     }
// console.log("log des  shipment" , queryParams.toString())
    
    // router.push(`/chat/${shipment.expediteurId}?${shipment?.id}`);

    // router.push(`/chat/${shipment?.id}`);

  } catch (error) {
    console.error("Erreur:", error);
    toast.error("Erreur lors de l'envoi de l'offre");
  } finally {
    setIsSubmitting(false);
  }
};
  return (

    <>
      {/* <Navbar  user={user} logout={logout} message={message}  /> */}
    
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 dark:bg-dark-800">
      {/* Contenu Principal */}
      <div className="w-full lg:w-2/3">
        {/* Carte avec la Map */}
        <div className="mt-6">
        <div className="flex items-center space-x-2">
      <Link href={"/shipments"}>
        <span className="flex items-center space-x-2">
          <IoMdArrowBack className="text-3xl text-green-500" />
          <span className="text-green-500 lowercase">Back</span>
        </span>
      </Link>
    </div>
          <h2 className="text-xl font-bold mb-4">Carte et itinérairee</h2>        
        </div>
        <div className="bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-[400px] w-full">
          <MapWithRoute
          from={{
            lat: shipment.departure.coordinates.lat,
            lon: shipment.departure.coordinates.lon,
            address_line1: shipment.departure.address,
          }}
          to={{
            lat: shipment.destination.coordinates.lat,
            lon: shipment.destination.coordinates.lon,
            address_line1: shipment.destination.address,
          }}
        />
          </div>
         
       
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-dark-700 rounded-lg shadow-sm mt-8">
  <h2 className="text-xl font-semibold text-gray-700 dark:text-dark-100">
    Points de départ et d&apos;arrivée
  </h2>
  <div className="mt-4 space-y-3">
    {/* Point de départ */}
    <div className="flex items-center space-x-3">
    
      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full hover:scale-110 transition-transform">
  <FaMapMarkerAlt className="text-green-600 dark:text-green-300" />
</div>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Départ</p>
        <p className="text-sm text-gray-600 dark:text-dark-300">
          {shipment.pickupAddress}
        </p>
      </div>
      
    </div>
    

    {/* Point d'arrivée */}
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full hover:scale-110 transition-transform">
        <FaMapMarkerAlt className="text-blue-600 dark:text-blue-300" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Destination</p>
        <p className="text-sm text-gray-600 dark:text-dark-300">
          {shipment.deliveryAddress}
        </p>
      </div>
    </div>
  </div>
</div>
       



        {/* Galerie d'Images */}
        <div className="mt-6 bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-5">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-dark-100">
              Images du colis
            </h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {shipment.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  width={20}
                  height={32}
                />
              ))}
            </div>
          </div>
        </div>

    




<div className="mt-6 bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden">
  <div className="p-4 sm:p-5">
    <h2 className="text-xl font-semibold text-gray-700 dark:text-dark-100 flex items-center space-x-2">
      <FaInfoCircle className="text-green-600 dark:text-green-300" /> {/* Icône pour le titre */}
      <span>Caractéristiques du Colis</span>
    </h2>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Nom du colis */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
          <FaBox className="text-green-600 dark:text-green-300" /> {/* Icône pour le nom du colis */}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Nom du colis</p>
          <p className="text-sm text-gray-600 dark:text-dark-300">{shipment.objectName}</p>
        </div>
      </div>

      {/* Prix proposé */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          <FaMoneyBillWave className="text-blue-600 dark:text-blue-300" /> {/* Icône pour le prix */}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Prix proposé</p>
          <p className="text-sm text-gray-600 dark:text-dark-300">{shipment.price} €</p>
        </div>
      </div>

      {/* Statut */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
          <FaInfoCircle className="text-purple-600 dark:text-purple-300" /> {/* Icône pour le statut */}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Statut</p>
          <p className="text-sm text-gray-600 dark:text-dark-300">{shipment.status}</p>
        </div>
      </div>

      {/* Date d'enlèvement */}
      <div className="flex flex-row gap-2">
      
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
                          {shipment?.deliveryDate && shipment.deliveryDate.toDate
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
  <div className="mt-6 bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden">
  <div className="p-4 sm:p-5">
    <h2 className="text-xl font-semibold text-gray-700 dark:text-dark-100 flex items-center space-x-2">
      <FaUser className="text-green-600 dark:text-green-300" />
      <span>Informations de l&apos;Expéditeur</span>
    </h2>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Nom complet */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
          <FaUserCircle className="text-green-600 dark:text-green-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Nom complet</p>
          <p className="text-sm text-gray-600 dark:text-dark-300">
            {shipment.expediteur.firstName} {shipment.expediteur.lastName}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          <FaEnvelope className="text-blue-600 dark:text-blue-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Email</p>
          <p className="text-sm text-gray-600 dark:text-dark-300">{shipment.expediteur.email}</p>
        </div>
      </div>

      {/* Téléphone */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-600 rounded-lg">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
          <FaPhone className="text-purple-600 dark:text-purple-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-dark-100">Téléphone</p>
          <p className="text-sm text-gray-600 dark:text-dark-300">{shipment.expediteur.phone}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>




      </div>

      {/* Barre Latérale Droite - Formulaire d'Offre */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-5">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-dark-100">
              Faire une Offre
            </h2>

            {/* Champ pour le Prix */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300">
                Prix proposé {shipment.price} (€)
              </label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                placeholder="propose un  prix au client"
              />
            </div>

            {/* Sélecteur de Date */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300">
                Disponibilité
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <button
                  onClick={() => setIsRange(true)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    isRange
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-dark-100"
                  }`}
                >
                  Plage de dates
                </button>
                <button
                  onClick={() => setIsRange(false)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    !isRange
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-dark-100"
                  }`}
                >
                  Date unique
                </button>
              </div>

              <div className="mt-2">
                {isRange ? (
                  <div className="flex space-x-2">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Date de début"
                      className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="Date de fin"
                      className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                    />
                  </div>
                ) : (
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    selectsRange={false}
                    placeholderText="Sélectionnez une date"
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                  />
                )}
              </div>

            </div>
            {/* </div> */}

            {/* Champ pour les Informations Complémentaires */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300">
                Informations complémentaires
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 dark:border-dark-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:text-dark-100"
                rows={4}
                placeholder="Ajoutez des détails..."
              />
            </div>

            {/* Bouton pour Soumettre l'Offre */}
            <div className="mt-6 flex items-center gap-4">
  <button
    onClick={handleSubmitOffer}
    disabled={isSubmitting}
    className="flex-1 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex items-center justify-center disabled:bg-green-300"
  >
    {isSubmitting ? (
      <>
        <FaSpinner className="animate-spin mr-2" />
        Soumission en cours...
      </>
    ) : (
      "Soumettre"
    )}
  </button>
  
  <span className="text-gray-500">ou</span>
  
  <button
    onClick={handleClick}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition duration-300"
  >
    <FaRegComments className="w-5 h-5" />
    <span>Discuter</span>
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
  </button>
</div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden mt-8">
      <div className="p-4 sm:p-5">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-dark-100 mb-4">
          Autres Shipments Disponibles
        </h2>
        <div className="space-y-4">
          {/* Afficher les cartes de la page actuelle */}
          {currentCards.map((otherShipment) => (
            <Link
              key={otherShipment.id}
              href={`/colis/${otherShipment.id}`} // Redirection vers la page de détails
              className="block"
            >
              <div className="flex items-start p-3 bg-gray-50 dark:bg-dark-600 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                {/* Image du colis (plus petite) */}
                {otherShipment.images && otherShipment.images.length > 0 && (
                  <Image
                    src={otherShipment.images[0]} // Afficher la première image
                    alt={`Image de ${otherShipment.objectName}`}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                    width={20} // Taille réduite
                    height={20}
                  />
                )}

                {/* Informations du colis */}
                <div className="flex-1">
                  {/* Nom du colis */}
                  <div className="flex items-center space-x-2 mb-1">
                    <FaBox className="text-green-600 dark:text-green-300" />
                    <p className="text-sm font-medium text-gray-700 dark:text-dark-100">
                      {otherShipment.objectName}
                    </p>
                  </div>

                  {/* Prix proposé */}
                  <div className="flex items-center space-x-2 mb-1">
                    <FaMoneyBillWave className="text-blue-600 dark:text-blue-300" />
                    <p className="text-sm text-gray-600 dark:text-dark-300">
                      {otherShipment.price} €
                    </p>
                  </div>

                  {/* Adresse de départ */}
                  <div className="flex items-center space-x-2 mb-1">
                    <FaMapMarkerAlt className="text-purple-600 dark:text-purple-300" />
                    <p className="text-sm text-gray-600 dark:text-dark-300">
                      Départ : {otherShipment.pickupAddress}
                    </p>
                  </div>

                  {/* Adresse d'arrivée */}
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-yellow-600 dark:text-yellow-300" />
                    <p className="text-sm text-gray-600 dark:text-dark-300">
                      Arrivée : {otherShipment.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          {/* Bouton Précédent */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-600 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="text-gray-700 dark:text-dark-100" />
            <span className="text-sm text-gray-700 dark:text-dark-100">Précédent</span>
          </button>

          {/* Numéro de page */}
          <span className="text-sm text-gray-700 dark:text-dark-100">
            Page {currentPage} sur {Math.ceil(otherShipments.length / cardsPerPage)}
          </span>

          {/* Bouton Suivant */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(otherShipments.length / cardsPerPage)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-600 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm text-gray-700 dark:text-dark-100">Suivant</span>
            <FaChevronRight className="text-gray-700 dark:text-dark-100" />
          </button>
        </div>
      </div>
    </div>
      </div>
      
    </div>
    </>
  );
};

export default TransporteurColis;