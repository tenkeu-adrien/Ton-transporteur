"use client"

 import Head from "next/head";
import Link from "next/link";
import { auth, messaging } from "../../../lib/firebaseConfig";
import {useRouter} from "next/navigation"
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
import { PopularPackages } from "@/components/ShipementColis";
import Image from "next/image";

export default function Home() {



  const { user,logout} = useContext(AuthContext);


  // console.log("data de user  connecter  dans accueil ; userData" ,userData)
   const router = useRouter()
  return (
    <>
      <Head>
  <title>Tton Transporteur - Service de Livraison Fiable et Écologique</title>
  <meta name="description" content="Avec Ton Transporteur, bénéficiez d&apos;un service de livraison fiable et écologique. Suivez vos colis en temps réel et améliorez l&apos;efficacité de vos opérations logistiques." />
</Head>

      {/* demande de permission pour la notification */}
      {/* <FCMSetup /> */}

 <Navbar  user={user} logout={logout}  />
{/* {user && <ChatButton recipientId={user?.uid}/>} */}
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
    Envoyez et recevez vos colis partout en France et en Europe. Économisez de l&apos;argent car aucun frais de commission n&apos;est appliqué : vous payez exactement vos frais de transport.
  </p>
  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
    <Link className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"  href="/start">
      Expédier ou recevoir un colis
    </Link>
    <Link href="/mes-colis" className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition duration-300">
      Voir les colis sur ma route
    </Link>
  </div>
</div>

          {/* Image illustrative */}
          <div className="relative h-[400px] mt-10 w-[600px]">
            <Image
              src="/images/accueil.png" 
              alt="Transport de colis"
              // layout="fill"
              // objectFit="cover"
              width={600}
              height={600}
              className="rounded-lg shadow-lg  "
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
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Transparent & Économique</h3>
  <p className="text-gray-600">
    Chez nous, <span className="font-semibold text-green-600">aucun frais caché</span> - 
    vous ne payez <span className="font-semibold">que les frais de transport</span>.
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
        <h2 className="text-3xl font-bold text-center mb-8">Comment s&apos;effectue une expédition chez nous ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">1. Publiez votre colis</h3>
            <p>Décrivez votre colis, fixez un prix et choisissez une date de livraison.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">2. Trouvez un transporteur sans commission – Vous ne payez que les frais de transport ! </h3>
            <p>Recevez des propositions du transporteurs fiables et sélectionnez celui qui vous convient.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">3. Suivez votre colis</h3>
            <p>Suivez en temps réel la livraison de votre colis jusqu&apos;à sa destination.</p>
          </div>
        </div>
      </div>


<PopularPackages/>


      <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-16 text-white text-center rounded-xl shadow-lg mx-4 my-8 relative overflow-hidden">
  {/* Illustration côté droit (remplacer par votre image) */}
  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[url('/images/delivery-truck.png')] bg-contain bg-no-repeat bg-right hidden md:block"></div>
  
  <div className="relative z-10 max-w-2xl mx-auto px-4">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
      Ton-Transporteur propose une assurance pour tous vos envois
    </h1>
    <p className="text-lg md:text-xl mb-8 opacity-90">
      Un pépin peut arriver à tout moment sur la route. Avec Ton-Transporteur, vos colis voyagent toujours assurés !
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link 
        href="/start" 
        className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-md hover:scale-105"
      >
        Souscrire maintenant
      </Link>
      <Link 
        href="/auth/signin" 
        className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-all"
      >
        Se connecter
      </Link>
    </div>
  </div>
</div>
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

      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 rounded-2xl">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-3xl font-bold  mb-12">Ce que disent nos clients</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Témoignage 1 - Brocanteuse */}
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 italic mb-4">
        "Ravi de cette première expérience avec Ton-Transporteur. Application très bien faite et efficace. Facile pour la validation des livraisons. Aucun frais de commission à payer pour la mise en relation avec un transporteur. Je recommande !"
        </p>
        <p className="font-semibold text-green-700">Marie L.</p>
      </div>

      {/* Témoignage 2 - Voyageur régulier */}
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 italic mb-4">
       " Je suis un voyageur régulier. J'habite Amsterdam depuis plusieurs années et je rentre souvent à Amiens. J'ai enregistré mon trajet pour recevoir des propositions de livraison de colis de la part de particuliers."
        </p>
        <p className="font-semibold text-green-700">Thomas P.</p>
      </div>

      {/* Témoignage 3 - Responsable logistique */}
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 italic mb-4">
          "Un gain de temps et d'argent : pas de frais intermédiaires, juste des transporteurs sérieux."
        </p>
        <p className="font-semibold text-green-700">Sophie K.</p>
      </div>

      {/* Témoignage 4 - Déménagement */}
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-center mb-4">
        <div className="bg-green-100 p-3 rounded-full">
        <img 
  src="/images/moving-truck.png" 
  alt="Camion de déménagement"
  className="h-8 w-8 object-contain   filter brightness-0 saturate-100 invert-55 sepia-30 saturate-1496 hue-rotate-349 brightness-102 contrast-101"
/>
</div>

        </div>
        <p className="text-gray-600 italic mb-4">
          "Première et bonne expérience avec Ton-Transporteur. Pour mon déménagement, je recommande déjà mon entourage pour leurs besoins de livraison. J&apos;ai réussi à trouver un chauffeur alors que ce n&apos;était pas gagné. Déménagement réalisé à la perfection. Je pense donc que tout le monde peut l&apos;utiliser !"
        </p>
        <p className="font-semibold text-green-700">Luc D.</p>
      </div>



      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-center mb-4">
        <div className="bg-orange-100 p-3 rounded-full">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17H3a1 1 0 01-1-1V6a1 1 0 011-1h13a1 1 0 011 1v3h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1a3 3 0 01-6 0H9a3 3 0 01-6 0zM17 17a3 3 0 006 0" />
  </svg>
</div>

        </div>
        <p className="text-gray-600 italic mb-4">
        "Je suis responsable logistique et je dois gérer une centaine d&apos;expéditions. Avec Ton-Transporteur, je gère toutes mes livraisons de manière simple et automatisée."
        </p>
        <p className="font-semibold text-green-700">Martin L.</p>
      </div>
    </div>


  

    {/* Call-to-action */}
    {/* <div className="mt-12 bg-green-50 inline-block px-6 py-3 rounded-full border border-green-200">
     
    </div> */}
  </div>
</div>
      {/* Section : Arguments de vente uniques */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Pourquoi choisir notre plateforme ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
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
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-4">🚛 0% de frais de commission</h3>
          <p>
          Vous ne payez que le prix du transport !
      </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-green-600 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-lg mb-8">Rejoignez notre communauté dès aujourd&apos;hui.</p>
        <Link href="/auth/signup" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          S&apos;inscrire maintenant
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




// je travaille sur une application nextjs avec firebase et j'aimerais 
// que si la connexion firebase et mon projet prends du temps qu'il rediriger un vers un composant lui indiquant le probleme de connexionavec icon 
// associe mon application c'est ton-transporteur  je veux que ce soit  une page comme 404 dans mon application nextjs et aussi stylise moi  aussi mon fichier 404  
// de mon application nextjs 14
