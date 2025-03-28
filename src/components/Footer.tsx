
import { FaFacebook } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa6";
import Head from "next/head";
 // Fonction pour recentrer la carte et ajuster le zoom
 const Footer = () => {


  const phoneNumber = "+330757953218"; // Remplacez par votre numéro de téléphone
  const message = "Bonjour, j'ai une question à propos de votre service."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };


  //  const map = useMap();
 
  //  useEffect(() => {
  //    if (from && to) {
  //      // Définir les limites de la carte pour inclure les deux points
  //      const bounds = [
  //        [from.lat, from.lon], // Point de départ
  //        [to.lat, to.lon],    // Point d'arrivée
  //      ];
  //      map.fitBounds(bounds, { padding: [50, 50] }); // Ajuster la carte avec un padding
  //    }
  //  }, [from, to, map]);
 
 
 // Fonction pour récupérer la distance et la durée du trajet avec Geoapify
//  const fetchRouteInfo = async (from, to, setDistance, setDuration) => {
//    const apiKey = "5e00291885f84efeb6c5c57d1103c4fa";
//    const url = `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lon}|${to.lat},${to.lon}&mode=truck&apiKey=${apiKey}`;
 
//    try {
//      const response = await fetch(url);
//      const data = await response.json();
 
//      if (data.features && data.features.length > 0) {
//        const route = data.features[0].properties;
//        setDistance(route.distance / 1000); // Convertir en km
//        setDuration(route.time / 60); // Convertir en minutes
//      }
//    } catch (error) {
//      console.error("Erreur lors de la récupération des données de route :", error);
//    }
//  };
 
//  const MapWithRoute = ({ from, to }) => {
//    const [distance, setDistance] = useState<number | null>(null);
//    const [duration, setDuration] = useState<number | null>(null);
 
//    useEffect(() => {
//      if (from && to) {
//        fetchRouteInfo(from, to, setDistance, setDuration);
//      }
//    }, [from, to]);
 
//    if (!from || !to || !from.lat || !from.lon || !to.lat || !to.lon) {
//      return <p>Veuillez sélectionner des adresses valides.</p>;
//    }
 
//    // Calculer le centre initial de la carte
//    const center = [(from.lat + to.lat) / 2, (from.lon + to.lon) / 2];
 
   return (
    <>
   <Head>
  <title>Ton Transporteur - Livraison Rapide et Sécurisée de Colis</title>
  <meta name="description" content="Ton Transporteur offre des services de livraison rapide et sécurisée pour vos colis. Optimisez vos envois avec notre solution de transport fiable et écologique." />
</Head>

    <footer className="bg-gray-600 text-white py-14">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* <!-- Première partie : Titre et description --> */}
      <div>
        <h2 className="text-2xl font-bold text-green-500">Ton-Transporteur</h2>
        <p className="mt-4 text-sm">Votre partenaire fiable pour l&apos;expédition de colis. Rapide, sécurisé et économique.</p>
        <div className="flex items-center gap-2"> 
          <a href="/cgu" className="text-green-500 hover:underline">CGU</a>
 <a href="/politique-confidentialite" className="text-green-500 hover:underline">Politique de Confidentialité</a>
 </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-green-500">Société</h3>
        <FiMinus   size={40}  />
        <ul className="mt-4 space-y-2">
          <li>
            <a href="#" className="flex items-center text-sm hover:text-green-500">
              <span className="mr-2">→</span> À propos
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-sm hover:text-green-500">
              <span className="mr-2 ">→</span> ton-transporteur
            </a>
          </li>
        </ul>
        <h3 className="text-lg font-semibold text-green-500 mt-6">Ressources</h3>
        {/* <FiMinus   size={40}  /> */}
        <ul className="mt-4 space-y-2">
          <li>
            <a href="#" className="flex items-center text-sm hover:text-green-500">
              <span className="mr-2">→</span> Blog
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-sm hover:text-green-500">
              <span className="mr-2">→</span> Assurances
            </a>
          </li>
        </ul>
      </div>

      {/* <!-- Troisième partie : Articles de blog --> */}
      <div>
        <h3 className="text-lg font-semibold text-green-500">Découvrir</h3>
<FiMinus   size={40}  />
        <ul className="mt-4 space-y-2">
          <li>
            <a href="#" className="flex items-center text-sm hover:text-green-500">
              <span className="mr-2">→</span> Déménagement rapide
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-sm hover:text-green-500">
              <span className="mr-2">→</span> Petit déménagement
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-sm hover:text-green-500">
              <span className="mr-2">→</span> Livraison par cher
            </a>
          </li>
        </ul>
      </div>

      {/* <!-- Quatrième partie : Suivez-nous --> */}
      <div>
        <h3 className="text-lg font-semibold text-green-500">Suivez-nous</h3>
        <FiMinus   size={40}  />
        <ul className="mt-4 space-y-2">
          <li>
            <a href="#" className="flex items-center text-sm hover:text-green-500">
              <span className="mr-2">→</span> Centre d&apos;aide
            </a>
          </li>
        </ul>
        <div className="mt-6 flex space-x-4">
          <a href="https://www.facebook.com/profile.php?id=61574925503075" className="text-white hover:text-green-500"    target="_blank" rel="noopener noreferrer" >
          <FaFacebook  className="w-8 h-8" />
          </a>
          <a href="#" className="text-white hover:text-green-500" rel="noopener noreferrer"  target="_blank">
          <FaInstagram className="w-8 h-8" />

          </a>
          <a href="#"   onClick={handleClick} className="text-white hover:text-green-500"  rel="noopener noreferrer" >
          <IoLogoWhatsapp className="w-8 h-8" />

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