"use client"

import Image from "next/image";
 import Head from "next/head";
import Link from "next/link";
import { auth, messaging } from "../../../lib/firebaseConfig";
import {useRouter} from 'next/navigation'
import { FaFacebook } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import Chat from "@/components/Chat";
import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { FiMinus } from "react-icons/fi";
import FCMSetup from "@/components/FCMSetup";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";
import RecentShipments from "@/components/RecentShipments";
import AddressForm from "@/components/AddressForm";
import Footer from "@/components/Footer";
import { ChatButton } from "@/components/ChatButton";

export default function Home() {

  const [message, setMessage] = useState("Chargement...");



  useEffect(() => {
    fetch("http://127.0.0.1:5001/projecttextfirebase/us-central1/helloWorld")
      .then((res) => res.text())
      .then(setMessage)
      .catch(() => setMessage("Erreur de chargement"));
  }, []);


 
  

  const { user,logout} = useContext(AuthContext);
const handleStart =()=>{
  router.push("/start")
}

  // console.log("data de user  connecter  dans accueil ; userData" ,userData)
   const router = useRouter()
  return (
    <>
      <Head>
  <title>Ton Transporteur - Service de Livraison Fiable et Écologique</title>
  <meta name="description" content="Avec Ton Transporteur, bénéficiez d'un service de livraison fiable et écologique. Suivez vos colis en temps réel et améliorez l'efficacité de vos opérations logistiques." />
</Head>

      {/* demande de permission pour la notification */}
      {/* <FCMSetup /> */}

 <Navbar  user={user} logout={logout}  />
{user && <ChatButton recipientId={user?.uid}/>}
<div className="bg-gray-100 min-h-screen">
<section className="relative bg-green-300 py-16 overflow-hidden">
      {/* Fond avec arrondis en bas */}
      <div className="absolute inset-0 bg-white transform skew-y-3 origin-top-left rounded-b-[100px] z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Texte descriptif et boutons */}
          <div className="text-center md:text-left">
  <h1 className="text-4xl font-bold text-gray-800 mb-6">
    Transportez vos colis légers, lourds et déménagement simplement et écologiquement
  </h1>
  <span className="mb-3">Bienvenue sur Trouve ton transporteur</span>
  <p className="text-gray-600 mb-8">
    Envoyez et recevez vos colis partout en France et en Europe. Économisez de l'argent car aucun frais de commission n'est appliqué : vous payez exactement vos frais de transport.
  </p>
  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
    <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300" onClick={() => handleStart()}>
      Expédier ou recevoir un colis
    </button>
    <button className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition duration-300">
      Voir les colis sur ma route
    </button>
  </div>
</div>

          {/* Image illustrative */}
          <div className="relative h-[500px]">
            <Image
              src="/images/home_page.avif" // Remplacez par le chemin de votre image
              alt="Transport de colis"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

      {/* Section avantages */}

      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Pourquoi choisir Ton-transporteur ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Économique</h3>
              <p className="text-gray-600">
                Faites des économies en partageant les frais de transport.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Écologique</h3>
              <p className="text-gray-600">
                Réduisez votre empreinte carbone en optimisant les trajets.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Communautaire</h3>
              <p className="text-gray-600">
                Rejoignez une communauté de particuliers de confiance.
              </p>
            </div>
          </div>
        </div>
      </section>
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-green-600 py-20 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Trouvez des transporteurs fiables pour vos colis</h1>
        <p className="text-lg mb-8">Livrez ou transportez des colis en toute simplicité.</p>
        <div className="space-x-4">
          <Link href="/start" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Commencer
          </Link>
          <Link href="/auth/signin" className="bg-transparent border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600">
            Se connecter
          </Link>
        </div>
      </div>

      {/* Section : Comment ça marche ? */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Comment s'effectue une expédition chez nous ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">1. Publiez votre colis</h3>
            <p>Décrivez votre colis, fixez un prix et choisissez une date de livraison.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">2. Trouvez un transporteur</h3>
            <p>Recevez des propositions de transporteurs fiables et sélectionnez celui qui vous convient.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">3. Suivez votre colis</h3>
            <p>Suivez en temps réel la livraison de votre colis jusqu&aposà sa destination.</p>
          </div>
        </div>
      </div>

      {/* Section : Annonces publiées */}
      {/* <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Annonces récentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shipments.slice(0, 3).map((shipment) => (
            <div key={shipment.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{shipment.description}</h2>
              <p className="text-gray-700 mb-2">Poids : {shipment.weight} kg</p>
              <p className="text-gray-700 mb-2">De : {shipment.pickupAddress}</p>
              <p className="text-gray-700 mb-2">À : {shipment.deliveryAddress}</p>
              <p className="text-gray-700">Statut : {shipment.status}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/shipments" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
            Voir toutes les annonces
          </Link>
        </div>
      </div> */}
          <RecentShipments />
      {/* Section : Comment envoyer un colis ? */}
      <div className="bg-gray-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Comment envoyer un colis avec nous ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
              <h3 className="text-xl font-semibold mb-4">Étape 1 : Créez un compte</h3>
              <p>Inscrivez-vous en quelques minutes pour accéder à notre plateforme.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
              <h3 className="text-xl font-semibold mb-4">Étape 2 : Publiez votre colis</h3>
              <p>Décrivez votre colis et fixez un prix pour attirer des transporteurs.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
              <h3 className="text-xl font-semibold mb-4">Étape 3 : Choisissez un transporteur</h3>
              <p>Sélectionnez un transporteur fiable parmi les propositions reçues.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
              <h3 className="text-xl font-semibold mb-4">Étape 4 : Suivez votre colis</h3>
              <p>Suivez en temps réel la livraison de votre colis.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section : Arguments de vente uniques */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Pourquoi choisir notre plateforme ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">🚚 Transporteurs vérifiés</h3>
            <p>Nous vérifions chaque transporteur pour garantir la sécurité de vos colis.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">💸 Prix compétitifs</h3>
            <p>Fixez un prix équitable et trouvez des transporteurs au meilleur tarif.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">📱 Suivi en temps réel</h3>
            <p>Suivez votre colis en temps réel grâce à notre plateforme intuitive.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">🌟 Avis vérifiés</h3>
            <p>Consultez les avis des autres utilisateurs pour choisir le meilleur transporteur.</p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-green-600 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-lg mb-8">Rejoignez notre communauté dès aujourd&aposhui.</p>
        <Link href="/auth/signup" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          S'inscrire maintenant
        </Link>
      </div>
    </div>





      {/* Pied de page */}
<Footer />
    </div>
    </>
  );
}

// // "use client"


// // import AddressAutocomplete from '@/components/AddressForm';
// // import MapWithRoute from '@/components/MapWithRoute';
// // import { useState } from 'react';

// // const ExpeditionForm = () => {
// //   const [departureAddress, setDepartureAddress] = useState<any>(null);
// //   const [deliveryAddress, setDeliveryAddress] = useState<any>(null);
// //   console.log('Adresse de départ :', departureAddress);
// //   console.log('Adresse de destination :', deliveryAddress);
// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (departureAddress && deliveryAddress) {
// //       console.log('Adresse de départ :', departureAddress);
// //       console.log('Adresse de destination :', deliveryAddress);
// //       // Envoyer les données à votre backend ou effectuer d'autres actions
// //     } else {
// //       alert('Veuillez sélectionner une adresse de départ et une adresse de destination.');
// //     }
// //   };

// //   return (

// //     <>
// //      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
// //       <div className="mb-5">
// //         <label className="block mb-2 font-bold">Adresse de départ :</label>
// //         <AddressAutocomplete onSelectAddress={setDepartureAddress} />
// //       </div>
// //       <div className="mb-5">
// //         <label className="block mb-2 font-bold">Adresse de destination :</label>
// //         <AddressAutocomplete onSelectAddress={setDeliveryAddress} />
// //       </div>
// //       <button
// //         type="submit"
// //         className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //       >
// //         Valider
// //       </button>
// //     </form>
// //  <MapWithRoute   from={departureAddress??0}  to={deliveryAddress??0} />

// //     </>
// //     );
// // };

// // export default ExpeditionForm;
// "use client"
// import AddressAutocomplete from "@/components/AddressForm";
// import MapWithRoute from "@/components/MapWithRoute";
// // import AddressAutocomplete from '@/components/AddressForm';
// // import MapWithRoute from '@/components/MapWithRoute';
// // import { useState } from 'react';

// // const ExpeditionForm = () => {
// //   const [departure, setDeparture] = useState<any>(null);
// //   const [destination, setDestination] = useState<any>(null);

// //   return (
// //     <div className="max-w-4xl mx-auto p-4">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
// //         <div>
// //           <label className="block mb-2 font-bold">Adresse de départ :</label>
// //           <AddressAutocomplete
// //             onSelectAddress={(address) =>
// //               setDeparture({
// //                 lat: address.properties.lat,
// //                 lon: address.properties.lon,
// //                 address: address.properties.formatted,
// //               })
// //             }
// //           />
// //         </div>
// //         <div>
// //           <label className="block mb-2 font-bold">Adresse de destination :</label>
// //           <AddressAutocomplete
// //             onSelectAddress={(address) =>
// //               setDestination({
// //                 lat: address.properties.lat,
// //                 lon: address.properties.lon,
// //                 address: address.properties.formatted,
// //               })
// //             }
// //           />
// //         </div>
// //       </div>
// //       {departure && destination && (
// //         <MapWithRoute departure={departure} destination={destination} />
// //       )}
// //     </div>
// //   );
// // };

// // export default ExpeditionForm;

// import { useState } from "react";

// const ExpeditionForm = () => {
//   const [departure, setDeparture] = useState<any>(null);
//   const [destination, setDestination] = useState<any>(null);

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="block mb-2 font-bold">Adresse de départ :</label>
//           <AddressAutocomplete
//             onSelectAddress={(address) =>
//               setDeparture({
//                 lat: address.properties.lat,
//                 lon: address.properties.lon,
//                 address_line1: address.properties.formatted,
//               })
//             }
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-bold">Adresse de destination :</label>
//           <AddressAutocomplete
//             onSelectAddress={(address) =>
//               setDestination({
//                 lat: address.properties.lat,
//                 lon: address.properties.lon,
//                 address_line1: address.properties.formatted,
//               })
//             }
//           />
//         </div>
//       </div>

//       {departure && destination && (
//         <div className="mt-6">
//           <h2 className="text-xl font-bold mb-4">Carte et itinéraire</h2>
//           <MapWithRoute from={departure} to={destination} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExpeditionForm;