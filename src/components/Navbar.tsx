"use client"
import React, { useEffect, useState} from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';


import { FaBars, FaTimes,  } from "react-icons/fa";
const Navbar = ({ user, logout }) => {

const [isClient, setIsClient] = useState(false);
const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

// if (!isClient) return null; // Empêche le rendu côté serveur
if (!isClient) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 h-16">
      {/* Juste un placeholder avec la bonne hauteur */}
    </nav>
  );
}

const menuData = {
  particulier: {
    mainLink: '/transport-entre-particulier',
    sections: [
      {
        title: 'La solution de transport pour particulier',
        a: {
          text: "J'estime le prix d'envoi",
          href: "/start"
        },
        links: [] // Pas de liens dans cette section
      },
      {
        title: 'Envoyez tout n\'importe où',
        links: [
          { text: 'Pièces de véhicule', href: '/livraison/vehicule' },
          { text: 'Scooter', href: '/livraison/vehicule/scooter' },
          // { text: 'Commode', href: '/livraison/meuble/commode' },
          { text: 'Meuble', href: '/livraison/meuble' },
          { text: 'Vélo', href: '/livraison/vehicule/velo' },
          { text: 'Canapé', href: '/livraison/meuble/canape' },
          { text: 'Electroménager', href: '/livraison/electromenager-electronique' },
          { text: 'Pneu', href: '/livraison/vehicule/pneu' },
          // { text: 'Moto', href: '/livraison/vehicule/moto' },
          { text: 'Outils de jardinage', href: '/livraison/jardinage-decoration' },
          // { text: 'Moteur', href: '/livraison/vehicule/moteur' },
          // { text: 'Tondeuse', href: '/livraison/jardinage-decoration/tonde' }
        ]
      }
    ]
  },
  demenagement: {
    mainLink: '/demenagement',
    sections: [
      {
        title: 'Solution de déménagement',
        links: [
          { text: 'Appartement', href: '/livraison/demenagement/appartement' },
          { text: 'Bureau', href: '/livraison/demenagement/demenager_bureau' },
          { text: 'Maison', href: '/livraison/demenagement/maison' },
          { text: 'Studio', href: '/livraison/demenagement/studio' }
        ]
      },
      {
        title: 'Déménagement partout en France',
        links: [
          { text: 'Paris', href: '/demenagement/paris' },
          { text: 'Toulouse', href: '/demenagement/toulouse' },
          { text: 'Lille', href: '/demenagement/lille' },
          { text: 'Marseille', href: '/demenagement/marseille' },
          { text: 'Nice', href: '/demenagement/nice' },
          { text: 'Montpellier', href: '/demenagement/montpellier' },
          { text: 'Lyon', href: '/demenagement/lyon' },
          { text: 'Nantes', href: '/demenagement/nantes' },
          // { text: 'Strasbourg', href: '/demenagement/strasbourg' },
          { text: 'Bordeaux', href: '/demenagement/bordeaux' },
          // { text: 'Rennes', href: '/demenagement/rennes' },
          // { text: 'Grenoble', href: '/demenagement/grenoble' }
        ]
      }
    ]
  }
}


  return (
  



    <nav className="bg-white shadow-md sticky top-0 z-50">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <a href="/Accueil" className="text-2xl font-bold text-green-600">
          Ton-Transporteur
        </a>
      </div>


      {/* Desktop Menu */}
     <div className="hidden lg:flex space-x-8">
      {/* Menu Particulier */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-1 text-gray-700 hover:text-green-600 text-lg font-medium">
          Particulier <FaChevronDown className="w-3" />
        </Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-in"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute left-0 mt-2 w-[800px] bg-white shadow-xl rounded-md z-50 p-6">
            <div className="flex justify-between gap-8">
              <div className="w-1/2">
                <h4 className="font-bold text-xl mb-4 text-green-600">
                  <Link href={menuData.particulier.mainLink}>
                    La solution de transport pour particulier
                  </Link>
                </h4>
                <Link 
                  href={menuData.particulier.sections[0].a.href} 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md mb-6"
                >
                  {menuData.particulier.sections[0].a.text}
                </Link>
              </div>
              
              <div className="w-1/2">
                <h4 className="font-bold text-xl mb-4 text-green-600">Envoyez tout n'importe où</h4>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                  {menuData.particulier.sections[1].links.map((link) => (
                    <Menu.Item key={link.href}>
                      <Link href={link.href} className="text-gray-700 hover:text-green-600 block py-1 text-base">
                        {link.text}
                      </Link>
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Menu Déménagement */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-1 text-gray-700 hover:text-green-600 text-lg font-medium">
          Déménagement <FaChevronDown className="w-3" />
        </Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-in"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute left-0 mt-2 w-[800px] bg-white shadow-xl rounded-md z-50 p-6">
            <div className="flex justify-between gap-8">
              <div className="w-1/2">
                <h4 className="font-bold text-xl mb-4 text-green-600">
                  <Link href={menuData.demenagement.mainLink}>
                    Solution de déménagement
                  </Link>
                </h4>
                <div className="space-y-3">
                  {menuData.demenagement.sections[0].links.map((link) => (
                    <Menu.Item key={link.href}>
                      <Link href={link.href} className="text-gray-700 hover:text-green-600 block text-base">
                        {link.text}
                      </Link>
                    </Menu.Item>
                  ))}
                </div>
              </div>
              
              <div className="w-1/2">
                <h4 className="font-bold text-xl mb-4 text-green-600">Déménagement partout en France</h4>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                  {menuData.demenagement.sections[1].links.map((link) => (
                    <Menu.Item key={link.href}>
                      <Link href={link.href} className="text-gray-700 hover:text-green-600 block py-1 text-base">
                        {link.text}
                      </Link>
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Lien simple "Comment ça marche" */}
      <Link 
        href="/comment" 
        className="text-gray-700 hover:text-green-600 text-lg font-medium flex items-center"
      >
        Comment ça marche
      </Link>
    </div>



      {/* Auth Buttons - Solution clé pour l'hydratation */}
      <div className="hidden md:flex space-x-3 items-center">
        {user ? (
      
          <>
            <button
              onClick={logout}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Déconnexion
            </button>
            <a href="/Dashboard" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Dashboard
            </a>
          </>

        ) : (
          <>
          <a href="/auth/signin" className="text-gray-700 hover:text-green-600">
            Connexion
          </a>
          <a href="/auth/signup" className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
            Inscription
          </a>
        </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-green-600"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu mobile"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>



      
    </div>

    {/* Mobile Menu */}
    {isOpen && (
     <div className="md:hidden bg-white shadow-md absolute top-16 left-0 w-full py-4 z-50">
     <div className="container mx-auto px-6 space-y-4">
       {/* Menu Particulier - Mobile */}
       <div className="border-b border-gray-100 pb-2">
         <h3 className="text-green-600 font-medium">Particulier</h3>
         <div className="mt-2 space-y-2 pl-4">
           <Link
             href="/transport-entre-particulier"
             className="block text-gray-700 hover:text-green-600 py-1"
             onClick={() => setIsOpen(false)}
           >
             La solution de transport
           </Link>
           <Link
             href="/start"
             className="block text-gray-700 hover:text-green-600 py-1"
             onClick={() => setIsOpen(false)}
           >
             J'estime le prix d'envoi
           </Link>
           {/* Ajoutez d'autres liens si nécessaire */}
         </div>
       </div>
   
       {/* Menu Déménagement - Mobile */}
       <div className="border-b border-gray-100 pb-2">
         <h3 className="text-green-600 font-medium">Déménagement</h3>
         <div className="mt-2 space-y-2 pl-4">
           <Link
             href="/demenagement"
             className="block text-gray-700 hover:text-green-600 py-1"
             onClick={() => setIsOpen(false)}
           >
             Solution de déménagement
           </Link>
           <Link
             href="/livraison/demenagement/appartement"
             className="block text-gray-700 hover:text-green-600 py-1"
             onClick={() => setIsOpen(false)}
           >
             Appartement
           </Link>
           {/* Ajoutez d'autres liens si nécessaire */}
         </div>
       </div>
   
       {/* Lien Comment ça marche - Mobile */}
       <div className="border-b border-gray-100 pb-2">
         <Link
           href="https://faq.bring4you.com"
           className="text-green-600 font-medium hover:text-green-700"
           onClick={() => setIsOpen(false)}
         >
           Comment ça marche
         </Link>
       </div>
   
       {/* Auth Buttons Mobile */}
       <div className="pt-4 space-y-2">
         {!user ? (
           <>
             <Link 
               href="/auth/signin" 
               className="block text-gray-700 hover:text-green-600 py-2"
               onClick={() => setIsOpen(false)}
             >
               Connexion
             </Link>
             <Link 
               href="/auth/signup" 
               className="block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
               onClick={() => setIsOpen(false)}
             >
               Inscription
             </Link>
           </>
         ) : (
           <>
             <button
               onClick={() => {
                 logout();
                 setIsOpen(false);
               }}
               className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
             >
               Déconnexion
             </button>
             <Link 
               href="/Dashboard" 
               className="block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center"
               onClick={() => setIsOpen(false)}
             >
               Dashboard
             </Link>
           </>
         )}
       </div>
     </div>
   </div>
    )}
  </nav>
  );
}


export default Navbar;