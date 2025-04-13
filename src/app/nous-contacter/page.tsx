
import Footer from '@/components/Footer';
import Head from 'next/head';
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaExclamationTriangle, FaHeadset } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';

const ContactPage = () => {
  return (
    <>
      <Head>
        <title>Contactez Ton Transporteur - Service Client 24/7</title>
        <meta name="description" content="Besoin d'aide ? Notre équipe est disponible 24h/24 pour répondre à vos questions sur le transport et la livraison de vos colis en France." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section avec phrase d'accueil */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-700 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
              <a href="/Accueil">
        <span className="flex items-center space-x-2 mb-4">
          <IoMdArrowBack className="text-2xl text-white" />
          <span className="text-white text-3xl">Accueil</span>
        </span>
      </a>
                <h1 className="text-4xl font-bold mb-6">Nous sommes là pour vous aider !</h1>
                <p className="text-xl mb-8">
                  Chez Ton-Transporteur, nous mettons un point d'honneur à vous offrir un service client exceptionnel, disponible 24h/24. 
                  Que ce soit pour une question sur votre livraison, un déménagement ou un problème technique, notre équipe vous répond avec professionnalisme.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <FaPhone className="mr-2" />
                    <span>+33 7 57 95 32 18</span>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <FaEnvelope className="mr-2" />
                    <span >contact@ton-transporteur.fr</span>
                  </div>
                </div>
              </div>
              <div className="relative h-80 md:h-96">
                <Image 
                  src="/images/contact-hero.jpg" // Remplacez par votre image
                  alt="Équipe de transporteurs souriants"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                  priority
                />
                {/* Éléments design sur l'image */}
                <div className="absolute -bottom-6 -right-6 bg-yellow-400 w-24 h-24 rounded-full opacity-30"></div>
                <div className="absolute -top-6 -left-6 bg-blue-400 w-20 h-20 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Deux blocs de contact */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bloc 1 - Contacter notre équipe */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-600 p-4 flex items-center">
              <FaHeadset className="text-white text-2xl mr-3" />
              <h2 className="text-xl font-bold text-white">Contacter notre équipe</h2>
            </div>
            <div className="p-6">
              <div className="relative h-48 mb-6">
                <Image 
                  src="/images/customer-support.jpg" // Image Freepik d'équipe support
                  alt="Service client disponible 24/7"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                
              </div>
              <p className="mb-4">
              Vous rencontrez une difficulté    ?  
               Contactez-nous à <span className='text-xl text-green-500'>contact@ton-transporteur.fr</span>  -  Notre service client s'engage à vous répondre le plus rapidement possible.
    Nous sommes disponibles du lundi au vendredi de 09h30 à 19h00 et le samedi de 09h30 à 16h00 (sauf jours fériés)  
    pour répondre à toutes vos questions concernant :
              </p>  
              <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Devis et tarifs </li>
              <li>Les options de livraison</li>
                <li>Le suivi de votre colis</li>
                <li>Les assurances transports</li>
              </ul>
              <a  href="tel:+33757953218" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                Contacter par téléphone
              </a>
              {/* <a ></a> */}
            </div>
          </div>

          {/* Bloc 2 - Signaler un problème */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-orange-500 p-4 flex items-center">
              <FaExclamationTriangle className="text-white text-2xl mr-3" />
              <h2 className="text-xl font-bold text-white"> un  problème à  Signaler ?</h2>
            </div>
            <div className="p-6">
              <div className="relative h-48 mb-6">
                <Image 
                  src="/images/contact.jpg" // Image Freepik de problème technique
                  alt="Signaler un problème technique"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <p className="mb-4">
                Vous rencontrez un problème avec notre service ? Signalez-le au  <span className='text-xl text-green-500'>contact@ton-transporteur.fr</span>   nous nous engageons à :
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>Vous répondre dans les plus brefs delais</li>
                <li>Trouver une solution adaptée</li>
                <li>Vous tenir informé à chaque étape</li>
                <li>Améliorer notre service grâce à votre feedback</li>
              </ul>
              {/* <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                Signaler un bug
              </button> */}
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        {/* <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Envoyez-nous un message</h2>
          <p className="text-center text-gray-600 mb-8">Nous vous répondrons dans les plus brefs délais</p>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Pseudo</label>
              <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
              <input type="text" id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message"  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                Envoyer le message
              </button>
            </div>
          </form>
        </div> */}
      </div>


      <Footer />
    </>
  );
};

export default ContactPage;