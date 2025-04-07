// import { FaFacebook } from "react-icons/fa";

// import { FiMinus } from "react-icons/fi";
// import { IoLogoWhatsapp } from "react-icons/io5";
// import { FaInstagram } from "react-icons/fa6";
// import Head from "next/head";

// const Footer = () => {
//   const phoneNumber = "+330757953218";
//   const message = "Bonjour, j'ai une question à propos de votre service.";
//   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

//   const handleClick = () => {
//     window.open(whatsappUrl, "_blank");
//   };

//   return (
//     <>
//       <Head>
//         <title>Ton Transporteur - Livraison Rapide et Sécurisée de Colis</title>
//         <meta name="description" content="Ton Transporteur offre des services de livraison rapide et sécurisée pour vos colis. Optimisez vos envois avec notre solution de transport fiable et écologique." />
//       </Head>

//       <footer className="bg-gray-600 text-white py-14">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             {/* Première partie : Titre et description */}
//             <div>
//               <h2 className="text-2xl font-bold text-green-500">Ton-Transporteur</h2>
//               <p className="mt-4 text-sm">Votre partenaire fiable pour l&apos;expédition de colis. Rapide, sécurisé et économique.</p>
//               <div className="flex items-center gap-2 mt-4">
//                 <a href="/cgu" className="text-green-500 hover:underline">CGU</a>
//                 <a href="/politique-confidentialite" className="text-green-500 hover:underline">Politique de Confidentialité</a>
//               </div>
//             </div>

//             {/* Deuxième partie : Catégories d'objets */}
//             <div>
//               <h3 className="text-lg font-semibold text-green-500">Catégories d'objets</h3>
//               <FiMinus size={40} />
//               <ul className="mt-4 space-y-2">
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Transport meubles
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Transport électroménager
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Transport matériel high-tech
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Livraison de colis
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             {/* Troisième partie : Déménagement par ville */}
//             <div>
//               <h3 className="text-lg font-semibold text-green-500">Déménagement par ville</h3>
//               <FiMinus size={40} />
//               <ul className="mt-4 space-y-2">
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Déménagement Paris
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Déménagement Lyon
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Déménagement Marseille
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Déménagement Bordeaux
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             {/* Quatrième partie : Contact et réseaux sociaux */}
//             <div>
//               <h3 className="text-lg font-semibold text-green-500">Contactez-nous</h3>
//               <FiMinus size={40} />
//               <ul className="mt-4 space-y-2">
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Centre d&apos;aide
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="flex items-center text-sm hover:text-green-500">
//                     <span className="mr-2">→</span> Devis gratuit
//                   </a>
//                 </li>
//               </ul>
//               <div className="mt-6 flex space-x-4">
//                 <a href="https://www.facebook.com/profile.php?id=61574925503075" className="text-white hover:text-green-500" target="_blank" rel="noopener noreferrer">
//                   <FaFacebook className="w-8 h-8" />
//                 </a>
//                 <a href="#" className="text-white hover:text-green-500" rel="noopener noreferrer" target="_blank">
//                   <FaInstagram className="w-8 h-8" />
//                 </a>
//                 <a href="#" onClick={handleClick} className="text-white hover:text-green-500" rel="noopener noreferrer">
//                   <IoLogoWhatsapp className="w-8 h-8" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// };

// export default Footer;


import { FaFacebook } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";
import Head from "next/head";
import { AiOutlineX } from "react-icons/ai";

const Footer = () => {
  const phoneNumber = "+330757953218";
  const message = "Bonjour, j'ai une question à propos de votre service.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Head>
        <title>Ton Transporteur - Livraison Rapide et Sécurisée de Colis</title>
        <meta name="description" content="Ton Transporteur offre des services de livraison rapide et sécurisée pour vos colis. Optimisez vos envois avec notre solution de transport fiable et écologique." />
      </Head>

      <footer className="bg-gray-600 text-white py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Première partie : Titre et description */}
            <div>
              <h2 className="text-2xl font-bold text-green-500">Ton-Transporteur</h2>
              <p className="mt-4 text-sm">Votre partenaire fiable pour l&apos;expédition de colis. Rapide, sécurisé et économique.</p>
              <div className="flex items-center gap-2 mt-4">
                <a href="/cgu" className="text-green-500 hover:underline">CGU</a>
                <a href="/politique-confidentialite" className="text-green-500 hover:underline">Politique de Confidentialité</a>
              </div>
            </div>

            {/* Deuxième partie : Catégories d'objets */}
            <div>
              <h3 className="text-lg font-semibold text-green-500">Catégories d'objets</h3>
              <FiMinus size={40} />
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/start" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Transport meubles
                  </a>
                </li>
                <li>
                  <a href="/start" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Transport électroménager
                  </a>
                </li>
                <li>
                  <a href="/start" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Transport matériel high-tech
                  </a>
                </li>
                <li>
                  <a href="/start" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Livraison de colis
                  </a>
                </li>
              </ul>
            </div>

            {/* Troisième partie : Déménagement par ville */}
            <div>
              <h3 className="text-lg font-semibold text-green-500">Déménagement par ville</h3>
              <FiMinus size={40} />
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/start" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Déménagement Paris
                  </a>
                </li>
                <li>
                  <a href="/start" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Déménagement Lyon
                  </a>
                </li>
                <li>
                  <a href="/start" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Déménagement Marseille
                  </a>
                </li>
                <li>
                  <a href="/start" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Déménagement Bordeaux
                  </a>
                </li>
              </ul>
            </div>

            {/* Quatrième partie : Contact et réseaux sociaux */}
            <div>
              <h3 className="text-lg font-semibold text-green-500">Contactez-nous</h3>
              <FiMinus size={40} />
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/a-propos" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> A propos
                  </a>
                </li>
                <li>
                  <a href="/nous-contacter" className="flex items-center text-sm hover:text-green-500">
                    <span className="mr-2">→</span> Nous-contacter
                  </a>
                </li>
              </ul>
              <div className="mt-6 flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61574925503075" className="text-white hover:text-green-500" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="w-8 h-8" />
                </a>
                <a href="/start" className="text-white hover:text-green-500" rel="noopener noreferrer" target="_blank">
                  <FaInstagram className="w-8 h-8" />
                </a>
                {/* <a href="#" onClick={()=>handleClick} className="text-white hover:text-green-500" rel="noopener noreferrer">
                  <IoLogoWhatsapp className="w-8 h-8" />
                </a> */}

                <a 
  href={`https://wa.me/+330757953218?text=${encodeURIComponent("Bonjour, j'ai une question à propos de votre service.")}`}
  className="text-white hover:text-green-500"
  target="_blank"
  rel="noopener noreferrer"
>
  <IoLogoWhatsapp className="w-8 h-8" />

</a>

<a 
  href="https://x.com/Tontransporteur"
  className="text-white hover:text-green-500"
  target="_blank"
  rel="noopener noreferrer"
>
<AiOutlineX className="w-8 h-8" />

</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;