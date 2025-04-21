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


















  const categories = [
    {
      name: 'Catégories d\'objets',
      options: [
        { label: 'Transport meubles', href: '/start' },
        { label: 'Transport matériel high-tech', href: '/start' },
        { label: 'Transport matériel de bricolage', href: '/start' },
      ],
    },
    {
      name: 'Particulier',
      options: [
        { label: 'Expédier ou recevoir un colis', href: '/start' },
        { label: 'Comment ça marche ?', href: '/start' },
        { label: 'Devis déménagement', href: '/start' },
      ],
    },
    {
      name: 'Services de Déménagement',
      options: [
        { label: 'Devis déménagement', href: '/start' },
        { label: 'Préparation et emballage', href: '/start' },
        { label: 'Transport et livraison', href: '/start' },
      ]
    }
  ];

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
      <div className="hidden lg:flex space-x-6">
        {categories.map((category) => (
          <Menu as="div" key={category.name} className="relative">
            <Menu.Button className="text-gray-700 hover:text-green-600 flex items-center gap-2">
              {category.name} <FaChevronDown className="w-3" />
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50">
                <div className="p-2">
                  <h3 className="text-sm font-bold text-green-600">{category.name}</h3>
                  <div className="space-y-1">
                    {category.options.map((option) => (
                      <Menu.Item key={option.label}>
                        {({ active }) => (
                          <Link
                            href={option.href}
                            className={`${
                              active ? "bg-gray-100 text-green-600" : "text-gray-700"
                            } block px-4 py-2 rounded-md`}
                          >
                            {option.label}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ))}
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
          {categories.map((category) => (
            <div key={category.name} className="border-b border-gray-100 pb-2">
              <h3 className="text-green-600 font-medium">{category.name}</h3>
              <div className="mt-2 space-y-2 pl-4">
                {category.options.map((option) => (
                  <Link
                    key={option.label}
                    href={option.href}
                    className="block text-gray-700 hover:text-green-600 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

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