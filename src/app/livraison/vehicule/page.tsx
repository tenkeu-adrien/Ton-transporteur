"use client"
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { AuthContext } from '../../../../context/AuthContext';
import { useContext } from 'react';
import Footer from '@/components/Footer';
import { 
    FaCar, 
    FaCouch, 
    FaTv, 
    FaTree, 
    FaBasketballBall, 
    FaTruckMoving, 
    FaBox, 
    FaShoppingCart, 
    FaTools, 
    FaBoxOpen 
  } from 'react-icons/fa'
export default function HomePage() {
  // Données pour la section FAQ (Structured Data)
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Comment expédier votre pièces de véhicule ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "1. Déposez votre demande de livraison <a href=https://bring4you.com/create>ici</a> <br/>2. Recevez des propositions<br/> 3. Validez votre réservation "
        }
      },
      {
        "@type": "Question",
        "name": "Quel type de pièces de véhicule puis-je envoyer ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vous pouvez envoyer tout type de pièces de véhicule via Bring4You. Petit, moyen, gros : Nous envoyons beaucoup de pièces de véhicule à travers toute la France et l'Europe. Bring4You peut livrer tout n'importe où !"
        }
      },
      {
        "@type": "Question",
        "name": "Pourquoi c'est moins cher ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Grâce à un nouveau concept: le covoiturage de colis ou colis-voiturage ! Des particuliers effectuent le transport garantissant ainsi un prix imbattable. Ainsi vous ne payez que le transporteur et non tous les frais associés à une société professionnelle. Ainsi les prix sont jusqu'à 4 fois moins cher qu'avec un transporteur professionnel. Bring4You est le site de référence en France de livraison de colis entre particuliers. Des milliers de pièces automobiles ont ainsi été livrées via Bring4You aux 4 coins de la France."
        }
      }
    ]
  };
  const { user,logout} = useContext(AuthContext);
  // Données pour les produits
  const vehicleParts = [
    "voiture", "moto", "pièce automobile", "remorque", "pneu", 
    "siège", "carrosserie", "moteur", "jante", "capot",
    "scooter", "boite de vitesse", "pare-choc", "vélo", 
    "aile de voiture", "sachoche de moto", "vespa", "hardtop",
    "porte de voiture", "banquette de voiture", "vélo électrique"
  ];

  // Données pour les catégories
  const categories = [
    { name: "pièces de véhicule", icon: <FaCar size={40} />, href: "/livraison/vehicule" },
    { name: "meuble", icon: <FaCouch size={40} />, href: "/livraison/meuble" },
    { name: "électroménagers", icon: <FaTv size={40} />, href: "/livraison/electromenager-electronique" },
    { name: "outils de jardinage, objets décorations", icon: <FaTree size={40} />, href: "/livraison/jardinage-decoration" },
    { name: "equipements sportifs", icon: <FaBasketballBall size={40} />, href: "/livraison/equipement-sportif" },
    { name: "déménagement", icon: <FaTruckMoving size={40} />, href: "/livraison/demenagement" },
    { name: "colis", icon: <FaBox size={40} />, href: "/livraison/colis" },
    { name: "achats", icon: <FaShoppingCart size={40} />, href: "/livraison/achats" },
    { name: "bricolage", icon: <FaTools size={40} />, href: "/livraison/bricolage" },
    { name: "livraison de tout type de colis", icon: <FaBoxOpen size={40} />, href: "/livraison/autre" }
  ];

  // Témoignages
  const testimonials = [
    {
      text: "Dommage que je ne connaissais pas ce site avant. Je suis plus que satisfait. Dorénavant tout mes envois passeront par Ton-transporteur.",
      author: "Stéphane G."
    },
    {
      text: "Je recommande à 200%. La meilleure solution pour transporter des pièces de véhicule ou de moto.",
      author: "Carine B."
    },
    {
      text: "J'ai un garage et j'achète des pièces en ligne sur leboncoin. Moteur, vespa, pièces automobiles, boite de vitesse...: je fais tous livrer par Ton-transporteur.",
      author: "Fabrice J."
    }
  ];

  return (
    <>
     
<Navbar  user={user} logout={logout}/>
      <section className="content">
  <div className="bg-gray-100 py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center">
        <div className="w-full lg:w-5/12">
          <div className="hidden md:block space-y-4"></div>
          <h1 className="text-4xl font-bold mb-4">Livraison de pièces de véhicules, motos, vélos</h1>
          <h2 className="text-2xl mb-6">
            La solution logistique pour commerçants et particuliers
          </h2>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full lg:w-6/12 px-2 mb-4">
              <Link href="/start" passHref>
                <span role="button" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded cursor-pointer transition text-xl">
                  J'envoie des pièces de véhicules, motos, vélos
                </span>
              </Link>
            </div>
            {/* <div className="w-full lg:w-6/12 px-2 mb-4">
              <Link href="/tasks" passHref>
                <span role="button" className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded cursor-pointer transition">
                  Je suis transporteur
                </span>
              </Link>
            </div> */}
          </div>
        </div>
        <div className="w-full lg:w-5/12">
          <div className="mb-4"></div>
          <span className="inline-block">
          <div className="text-center -mr-[350px]"> 
              <a className="mb-1 inline-block text-3xl text-green-400" href="/Accueil" >
               Ton-Transporteur
              </a>

              <p className="2xl:px-20">
                {/* Bienvenue ! */}
              </p>
        
              <span className="inline-block">
              
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 720 722.539" role="img" className="mt-12 "  >
  <g id="Group_64" data-name="Group 64" transform="translate(-600.001 -166)">
    <g id="Group_63" data-name="Group 63" transform="translate(39.127 -21.613)">
      <path id="Path_1-1224" data-name="Path 1" d="M275.321,690.449,270.949,673.2a223.916,223.916,0,0,0-23.758-8.524l-.552,8.015-2.238-8.83c-10.012-2.862-16.824-4.121-16.824-4.121s9.2,34.987,28.5,61.735l22.486,3.95-17.469,2.519a90.608,90.608,0,0,0,7.811,8.28c28.072,26.057,59.34,38.013,69.838,26.7s-3.749-41.6-31.822-67.656c-8.7-8.078-19.635-14.56-30.579-19.664Z" transform="translate(417.297 140.418)" fill="#f2f2f2"/>
      <path id="Path_2-1225" data-name="Path 2" d="M345.1,652.214l5.171-17.023a223.933,223.933,0,0,0-15.931-19.578l-4.615,6.576,2.648-8.716c-7.093-7.623-12.273-12.221-12.273-12.221s-10.208,34.706-7.516,67.579l17.207,15-16.259-6.874a90.606,90.606,0,0,0,2.409,11.128c10.562,36.817,31.149,63.214,45.982,58.958s18.295-37.551,7.732-74.368c-3.274-11.414-9.283-22.614-16.013-32.638Z" transform="translate(389.102 159.921)" fill="#f2f2f2"/>
    </g>
    <g id="Group_62" data-name="Group 62" transform="translate(44.037 -0.462)">
      <path id="Path_22-1226" data-name="Path 22" d="M734.978,247.559h-3.956V139.187A62.725,62.725,0,0,0,668.3,76.462H438.687a62.725,62.725,0,0,0-62.725,62.725V733.736a62.725,62.725,0,0,0,62.725,62.725H668.3a62.725,62.725,0,0,0,62.724-62.724V324.7h3.956Z" transform="translate(360 90)" fill="#e6e6e6"/>
      <path id="Path_23-1227" data-name="Path 23" d="M671.423,93.336H641.454a22.255,22.255,0,0,1-20.607,30.659H489.306A22.254,22.254,0,0,1,468.7,93.335H440.708a46.843,46.843,0,0,0-46.843,46.843V733.864a46.843,46.843,0,0,0,46.843,46.843H671.423a46.843,46.843,0,0,0,46.843-46.843h0V140.177a46.843,46.843,0,0,0-46.842-46.842Z" transform="translate(359.405 89.439)" fill="#fff"/>
      <path id="Path_6-1228" data-name="Path 6" d="M530.421,337.151a23.626,23.626,0,0,1,11.827-20.472,23.637,23.637,0,1,0,0,40.939,23.621,23.621,0,0,1-11.823-20.467Z" transform="translate(355.65 82.117)" fill="#ccc"/>
      <path id="Path_7-1229" data-name="Path 7" d="M561.158,337.151a23.625,23.625,0,0,1,11.827-20.472,23.637,23.637,0,1,0,0,40.939,23.621,23.621,0,0,1-11.823-20.467Z" transform="translate(354.627 82.117)" fill="#ccc"/>
      <circle id="Ellipse_1" data-name="Ellipse 1" cx="23.637" cy="23.637" r="23.637" transform="translate(921.189 395.631)" fill="#16e610"/>
      <path id="Path_8-1230" data-name="Path 8" d="M627.963,409.252H490.2a4.953,4.953,0,0,1-4.947-4.947V266.543A4.953,4.953,0,0,1,490.2,261.6H627.963a4.953,4.953,0,0,1,4.947,4.947V404.3a4.953,4.953,0,0,1-4.947,4.947ZM490.2,263.576a2.971,2.971,0,0,0-2.968,2.968V404.306a2.971,2.971,0,0,0,2.968,2.968H627.963a2.971,2.971,0,0,0,2.968-2.968V266.544a2.971,2.971,0,0,0-2.968-2.968Z" transform="translate(356.366 83.844)" fill="#ccc"/>
      <rect id="Rectangle_1" data-name="Rectangle 1" width="211.284" height="1.979" transform="translate(803.805 598.696)" fill="#ccc"/>
      <circle id="Ellipse_2" data-name="Ellipse 2" cx="6.672" cy="6.672" r="6.672" transform="translate(803.805 572.996)" fill="#16e610"/>
      <rect id="Rectangle_2" data-name="Rectangle 2" width="211.284" height="1.979" transform="translate(803.805 665.417)" fill="#ccc"/>
      <circle id="Ellipse_3" data-name="Ellipse 3" cx="6.672" cy="6.672" r="6.672" transform="translate(803.805 639.718)" fill="#16e610"/>
      <path id="Path_977-1231" data-name="Path 977" d="M658.244,670.068H591.472a4.355,4.355,0,0,1-4.35-4.35v-23.4a4.355,4.355,0,0,1,4.35-4.35h66.772a4.355,4.355,0,0,1,4.35,4.35v23.4a4.355,4.355,0,0,1-4.35,4.35Z" transform="translate(352.978 71.328)" fill="#16e610"/>
      <circle id="Ellipse_7" data-name="Ellipse 7" cx="6.672" cy="6.672" r="6.672" transform="translate(825.57 572.996)" fill="#16e610"/>
      <circle id="Ellipse_8" data-name="Ellipse 8" cx="6.672" cy="6.672" r="6.672" transform="translate(847.335 572.996)" fill="#16e610"/>
      <circle id="Ellipse_9" data-name="Ellipse 9" cx="6.672" cy="6.672" r="6.672" transform="translate(825.57 639.718)" fill="#16e610"/>
      <circle id="Ellipse_10" data-name="Ellipse 10" cx="6.672" cy="6.672" r="6.672" transform="translate(847.335 639.718)" fill="#16e610"/>
    </g>
    <path id="Path_88-1232" data-name="Path 88" d="M966.106,823.539H251.642c-1.529,0-2.768-.546-2.768-1.218s1.239-1.219,2.768-1.219H966.106c1.528,0,2.768.546,2.768,1.219S967.634,823.539,966.106,823.539Z" transform="translate(351.127 65)" fill="#e6e6e6"/>
    <g id="Group_61" data-name="Group 61" transform="translate(-21145.078 -2078.104)">
      <path id="Path_92-1233" data-name="Path 92" d="M893.722,361.268l-16.8,33.257L826.7,417.359c-5.364,9.065-22.409,9.759-23.649,3.9-1.391-6.576,20.7-17.161,20.7-17.161l42.012-28.416,3.676-24.463Z" transform="translate(21477.109 2335.737)" fill="#ffb9b9"/>
      <path id="Path_93-1234" data-name="Path 93" d="M742.662,464.215,745.76,489l-17.969,1.24-1.858-26.023Z" transform="translate(21626.188 2455.967)" fill="#ffb9b9"/>
      <path id="Path_94-1235" data-name="Path 94" d="M900.869,676.83a48.641,48.641,0,0,0,4.434-5.422c2.575-3.564,4.86,14.716,4.86,14.716s2.479,7.435,1.859,11.153-14.87,3.718-17.349,3.1-14.87,0-14.87,0H861.215c-16.11-7.435,0-12.392,0-12.392,4.957-.62,21.686-16.11,21.686-16.11l3.718-6.815c2.478-.62,4.957,8.674,4.957,8.674Z" transform="translate(21465.504 2264.419)" fill="#090814"/>
      <path id="Path_95-1236" data-name="Path 95" d="M802.8,464.616l3.1,24.784-17.969,1.24-1.859-26.024Z" transform="translate(21612.521 2455.876)" fill="#ffb9b9"/>
      <path id="Path_96-1237" data-name="Path 96" d="M961.005,677.231a48.7,48.7,0,0,0,4.434-5.422c2.575-3.564,4.86,14.716,4.86,14.716s2.478,6.816,1.859,10.533-14.87,3.717-17.349,3.1-14.87.62-14.87.62H921.351c-16.11-7.435,0-12.392,0-12.392,4.957-.62,21.686-16.11,21.686-16.11l3.718-6.815c2.478-.62,4.957,8.674,4.957,8.674Z" transform="translate(21451.836 2264.328)" fill="#090814"/>
      <path id="Path_97-1238" data-name="Path 97" d="M930.929,446.165c2.479,3.1,1.239,13.631,1.239,13.631s4.337,34.078,2.478,37.176,1.239,5.576,3.1,9.914,3.718,14.87,3.718,14.87c10.533,8.674,9.914,48.329,9.914,48.329l3.717,35.317c-1.239,3.718-18.588,4.337-21.066,3.718s-9.914-56.384-9.914-56.384l-16.729-31.6s1.239,84.265,1.239,87.983-16.729,1.859-20.447,1.859-3.718-61.96-3.718-61.96l-3.718-16.109-19.827-73.732V450.5l3.1-4.337S928.451,443.067,930.929,446.165Z" transform="translate(21463.943 2314.471)" fill="#090814"/>
      <circle id="Ellipse_11" data-name="Ellipse 11" cx="19.208" cy="19.208" r="19.208" transform="translate(22348.404 2581.572)" fill="#ffb9b9"/>
      <path id="Path_98-1239" data-name="Path 98" d="M901.99,251.326c3.893,8.67,1.588,20.779-6.2,34.078l31.6-14.87-4.957-4.337,1.239-12.392Z" transform="translate(21456.018 2358.437)" fill="#ffb9b9"/>
      <path id="Path_99-1240" data-name="Path 99" d="M894.154,275.527c-4.138,2.46-6.613,6.98-8.034,11.58a109.735,109.735,0,0,0-4.716,26.218l-1.5,26.64L861.316,410.6c16.109,13.631,25.4,10.533,47.089-.62S932.57,413.7,932.57,413.7s1.859-.62,0-2.478,0,0,1.859-1.859,0,0-.62-1.859,0-.62.62-1.239-2.478-6.2-2.478-6.2l4.957-46.47,6.2-65.677c-7.435-9.294-28.5-17.349-28.5-17.349L895.394,284.2c-6.2,2.478-1.239-7.435-1.239-7.435Z" transform="translate(21463.852 2354.064)" fill="#16e610"/>
      <path id="Path_100-1241" data-name="Path 100" d="M968.242,343.937l2.478,37.176-31.6,45.231c0,10.533-5.576,13.012-5.576,13.012a81.9,81.9,0,0,1-5.576-10.533c-3.1-6.816,1.859-12.392,1.859-12.392l21.686-45.85-9.294-22.925Z" transform="translate(21448.936 2337.39)" fill="#ffb9b9"/>
      <path id="Path_101-1242" data-name="Path 101" d="M960.1,293.046c10.533,3.718,12.392,43.992,12.392,43.992-12.392-6.816-27.262,4.337-27.262,4.337s-3.1-10.533-6.816-24.164a23.68,23.68,0,0,1,4.957-22.306S949.563,289.329,960.1,293.046Z" transform="translate(21446.549 2349.247)" fill="#16e610"/>
      <path id="Path_102-1243" data-name="Path 102" d="M928.148,237.734c-2.445-1.956-5.781,1.6-5.781,1.6l-1.956-17.606s-12.226,1.467-20.051-.489-9.047,7.091-9.047,7.091a62.8,62.8,0,0,1-.245-11c.489-4.4,6.847-8.8,18.095-11.737s17.116,9.781,17.116,9.781C934.1,219.283,930.593,239.691,928.148,237.734Z" transform="translate(21457.121 2368.931)" fill="#090814"/>
    </g>
  </g>
</svg>
              </span>
            </div>
              </span>
        </div>
      </div>
    </div>
  </div>

  {/* How to send section */}
  <section id="how_to_send_seo" className="container mx-auto px-4 py-8">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold">Comment expédier votre pièces de véhicule ?</h2>
    </div>

    <div className="flex flex-wrap justify-center -mx-4">
      <div className="w-full lg:w-4/12 px-4 mb-8">
        <Image 
          src="/boite-en-carton.png" 
          className="mx-auto mb-4" 
          alt="Envoyez des colis pas cher"
          width={100}
          height={100}
        />
        <h3 className="text-xl font-semibold mb-2">Déposez une annonce</h3>
        <p className="text-justify">
          Proposez votre pièces de véhicule à l'envoi. Détaillez votre annonce avec l'adresse, les dimensions et le prix
          proposé pour la livraison. Pensez à ajouter une photo de votre pièces de véhicule.
        </p>
      </div>
      <div className="w-full lg:w-4/12 px-4 mb-8">
        <Image 
          src="/bulle-de-discussion.png" 
          className="mx-auto mb-4" 
          alt="Faites-vous livrer un colis par un particulier"
          width={100}
          height={100}
        />
        <h3 className="text-xl font-semibold mb-2">Recevez des propositions</h3>
        <p className="text-justify">
          Les voyageurs vous contactent par texto ou mail. Mettez-vous d'accord sur les détails de livraison de votre
          pièces de véhicule (prix, date d'enlèvement et de livraison).
        </p>
      </div>
      <div className="w-full lg:w-4/12 px-4 mb-8">
        <Image 
          src="/verifier.png" 
          className="mx-auto mb-4" 
          alt="Expediteur et voyageurs economisent de l'argent avec la livaison de colis entre particuliers"
          width={100}
          height={100}
        />
        <h3 className="text-xl font-semibold mb-2">Validez votre réservation</h3>
        <p className="text-justify">
<p className="text-justify text-gray-600">
  Vous ne payez que le prix du transport  Aucun frais supplémentaire ne vous sera demandé, et le paiement se fait directement au moment de l'envoi ou à la livraison.
</p>

        </p>
      </div>
    </div>
    {/* <div className="text-center">
      <Link href="https://faq.bring4you.com">
        <span className="text-blue-500 hover:underline cursor-pointer">Plus de détails</span>
      </Link>
    </div> */}
  </section>

  {/* Product link section */}
  <section id="product_link" className="container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-center mb-6">Quel type de pièces automobiles puis-je envoyer ?</h2>
    <p className="text-justify mb-4">
      Vous pouvez envoyer tout type de pièces automobiles via Ton-transporteur. Petit, moyen, gros, encombrants nous avons une solution pour toutes vos demandes d'expédition de pièces automobiles. Ton-transporteur est notamment spécialisé dans l'envoi de pièces automobiles encombrants comme des jantes, des roues, des moteurs,... Ton-transporteur livre également de nombreuses motos et scooters à travers toute la France. Envoyer une pièce automobile n'a jamais été aussi simple.
    </p>
    <p className="mb-4">Voici des exemples de colis que vous pouvez envoyer :</p>
    <div className="flex flex-wrap -mx-2">
      {vehicleParts.map((part, index) => (
        <div key={index} className="w-1/2 lg:w-1/4 px-2 mb-2">
          <div className="text-left">
            <Link href={`/livraison/vehicule/${part.replace(/\s+/g, '-')}`}>
              <span className="text-blue-500 hover:underline cursor-pointer">{part}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-center mt-8">
      <div className="w-full lg:w-4/12">
        <a href="/start" >
          <span id="btn_send_discover" className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded cursor-pointer transition" role="button">
            <i className="fa fa-suitcase"></i>
            &nbsp;&nbsp;J'envoie un colis
          </span>
        </a>
      </div>
    </div>
  </section>

  {/* Category detail section */}
  <section id="category_detail" className="container mx-auto px-4 py-8">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-center mb-6">La solution de transport la moins chère</h2>
      <p className="text-justify">
        Vous avez des pièces de véhicule à expédier ? Pas de problème vous pouvez livrer avec Ton-transporteur tout sorte de pièce de véhicule: pneus, remorques, carrosserie, moteur, jantes, capot, échappement, compresseur, bougies, courroie, freins, rétroviseur, filtre à air, habitacle, cardan, boudies d'allumage, durite, culasse, pneus, alternateur, filtre à carburant, pompe à eau, essuie-glaces... La liste est longue mais vous raiment livrer tout type de pièces automobiles : pièces détachées, pièces de rechange, piéces d'origine, pièces neuves, pièces de voiture, pièces d'occasion,...Souvent le coup de livraison exorbitant de livraison empêche de livrer des pièces auto indispensables à votre véhicule. Ton-transporteur aide ainsi des particuliers à expédier ces pièces automobiles à travers toute la France. Le prix de livraison dépend du volume, poids et du trajet. Pour livrer des roues de Paris à Marseille, comptez environ 50€. Si le bien à livrer est volumineux ou encombrant comme un moteur, un capot ou une boite de vitesse comptez plutôt autour de 100€. Si votre véhicule est cassé : vous pouvez transporter vos pièces automobiles nécessaires à la réparation de votre véhicule : compresseur de climatisation, injecteur, rotules, démarreur, pièces pour golf, alfa,... Soyez rassurés les bien sont assurés contre le bris et le vol accidentel ! Plus qu'une chose à faire: déposer votre demande en cliquant sur "J'expédie".
      </p>
    </div>
    <div>
      <h2 className="text-3xl font-bold text-center mb-6">Pourquoi c'est moins cher ?</h2>
      <p className="text-justify">
        La réponse est simple: grâce à la livraison de colis entre particuliers, des particuliers livrent vos pièces automobiles. Ils remboursent ainsi une partie de leur trajet. Les prix d'envoi de pièces automobiles sont ainsi jusqu'à 4 fois moins cher qu'avec un transporteur professionnel. La livraison de colis par des particuliers garantit un prix imbattable. Vous ne payez que le transporteur et non tous les frais associés à une société professionnelle. Bring4You est le site de référence en France de livraison de pièces automobiles entre particuliers. Des milliers de pièces automobiles ont ainsi été livrées via Ton-transporteur aux 4 coins de la France.
      </p>
    </div>
  </section>

  {/* Categories section */}
  <section id="categories" className="container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-center mb-6">Envoyez ou transportez tout type de colis</h2>
    <div className="flex flex-wrap -mx-2">
    {categories.map((category, index) => (
  <div key={index} className="w-1/2 lg:w-1/4 px-4 mb-6">
    <Link href={category.href} passHref>
      <span className="block bg-gray-200 rounded overflow-hidden mx-auto text-center p-12 hover:bg-gray-300 transition-colors">
        <div className="flex justify-center text-green-600 text-3xl">
          {category.icon}
        </div>
      </span>
    </Link>
    <div className="text-center font-semibold mt-2">{category.name}</div>
  </div>
))}
    </div>
  </section>

  {/* Testimonials section */}
  <section id="endorsement" className="container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-center mb-6">
      98% de nos clients nous recommandent :
      <Link href="/Accueil#livraison">
        <span className="text-green-500 hover:underline ml-2 cursor-pointer">Lire plus d'avis</span>
      </Link>
    </h2>
    <div className="flex flex-wrap -mx-4">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="w-full lg:w-4/12 px-4 mb-8">
          <div className="border-none">
            <Image 
              src="/user.png" 
              className="rounded-full mx-auto" 
              alt="User"
              width={50}
              height={50}
            />
            <p className="text-left my-4">{testimonial.text}</p>
            <p className="text-center font-semibold"><b>{testimonial.author}</b></p>
          </div>
        </div>
      ))}
    </div>
  </section>
</section>
<Footer />
    </>
  );
}