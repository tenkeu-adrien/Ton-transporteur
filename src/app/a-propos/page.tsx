import Footer from '@/components/Footer';
import Head from 'next/head';
import Image from 'next/image';
import { FaTruck, FaUsers, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>À propos - Ton Transporteur | Votre partenaire logistique fiable</title>
        <meta name="description" content="Découvrez Ton Transporteur, votre solution de livraison rapide et sécurisée en France. Notre équipe dévouée et notre technologie innovante au service de vos envois." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section avec message de bienvenue */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-700 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
              <a href="/Accueil">
        <span className="flex items-center space-x-2 mb-4">
          <IoMdArrowRoundBack className="text-2xl text-white" />
          <span className="text-white text-3xl">Accueil</span>
        </span>
      </a>
                <h1 className="text-4xl font-bold mb-6">Bienvenue chez Ton Transporteur</h1>
                <p className="text-xl mb-8">
                  Depuis 2023, nous révolutionnons la livraison de colis en France avec un mélange unique 
                  d'expertise humaine et de technologie innovante. Votre satisfaction, notre moteur.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <FaTruck className="mr-2" />
                    <span>+1000 colis livrés</span>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <FaUsers className="mr-2" />
                    <span>90% de clients satisfaits</span>
                  </div>
                </div>
              </div>
              <div className="relative h-80 md:h-96">
                <Image 
                  src="/about-hero.jpg" // Image d'équipe ou de camion
                  alt="Équipe Ton Transporteur en action"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg shadow-xl"
                  priority
                />
                {/* Éléments design */}
                <div className="absolute -bottom-6 -left-6 bg-yellow-400 w-24 h-24 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc 1 - Présentation du transporteur */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-600 p-6 flex items-center">
              <FaTruck className="text-white text-3xl mr-4" />
              <h2 className="text-2xl font-bold text-white">Ton Transporteur en quelques mots</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Notre mission</h3>
                <p>
                  Simplifier la logistique pour tous. Particuliers, artisans ou entreprises, 
                  nous proposons des solutions sur mesure pour vos envois, avec transparence 
                  et fiabilité.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800">Nos engagements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaShieldAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Colis assurés jusqu'à 5000€ par défaut</span>
                  </li>
                  <li className="flex items-start">
                    <FaChartLine className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Suivi en temps réel de chaque envoi</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-64 md:h-full">
                <Image 
                  src="/transport-presentation.jpg" // Image de véhicules ou entrepôt
                  alt="Flotte de véhicules Ton Transporteur"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloc 2 - Équipe technique */}
        <div className="max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-6 flex items-center">
              <FaUsers className="text-white text-3xl mr-4" />
              <h2 className="text-2xl font-bold text-white">Notre équipe technique</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="relative h-64 md:h-full">
                <Image 
                  src="/tech-team.jpg" // Image d'équipe technique
                  alt="Équipe technique Ton Transporteur"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">L'innovation au service du transport</h3>
                <p>
                  Nos 15 experts développent en permanence des outils pour optimiser vos livraisons :
                  algorithmes de routage intelligent, interface simplifiée, et notifications proactives.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Notre stack technique</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow">Next.js</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow">Node.js</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow">React Native</span>
                    <span className="bg-white px-3 py-1 rounded-full text-sm shadow">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bandeau valeurs */}
        <div className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">Nos valeurs fondamentales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {icon: <FaShieldAlt className="text-3xl mb-4 text-green-400" />, 
                 title: "Sécurité", 
                 text: "Tous nos transporteurs sont vérifiés et formés"},
                {icon: <FaTruck className="text-3xl mb-4 text-green-400" />, 
                 title: "Réactivité", 
                 text: "Délais optimisés grâce à notre réseau dense"},
                {icon: <FaUsers className="text-3xl mb-4 text-green-400" />, 
                 title: "Proximité", 
                 text: "Une équipe disponible 24/7 pour vos besoins"}
              ].map((item, index) => (
                <div key={index} className="text-center p-6 bg-gray-700 rounded-lg">
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AboutPage;