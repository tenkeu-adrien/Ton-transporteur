"use client"
import React, { useEffect, useState} from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Navbar = ({ user, logout }) => {

const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

// if (!isClient) return null; // Empêche le rendu côté serveur

  const categories = [
    {
      name: 'Commerçant',
      options: [
        { label: 'Option 1 pour Commerçant', href: '/blog/commercant-option1' },
        { label: 'Option 2 pour Commerçant', href: '/blog/commercant-option2' },
        { label: 'Option 3 pour Commerçant', href: '/blog/commercant-option3' },
      ],
    },
    {
      name: 'Particulier',
      options: [
        { label: 'Option 1 pour Particulier', href: '/blog/particulier-option1' },
        { label: 'Option 2 pour Particulier', href: '/blog/particulier-option2' },
        { label: 'Option 3 pour Particulier', href: '/blog/particulier-option3' },
      ],
    },
    {
      name: 'Transporteur',
      options: [
        { label: 'Option 1 pour Transporteur', href: '/blog/transporteur-option1' },
        { label: 'Option 2 pour Transporteur', href: '/blog/transporteur-option2' },
        { label: 'Option 3 pour Transporteur', href: '/blog/transporteur-option3' },
      ],
    },
    {
      name: 'Déménagement',
      options: [
        { label: 'Option 1 pour Déménagement', href: '/blog/demenagement-option1' },
        { label: 'Option 2 pour Déménagement', href: '/blog/demenagement-option2' },
        { label: 'Option 3 pour Déménagement', href: '/blog/demenagement-option3' },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-md  sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className='flex gap-4'>
        <a href="/" className="text-2xl font-bold text-green-600 mr-4">
          Ton-Transporteur
        </a>

        <div className="space-x-6 flex items-center">
          {categories.map((category) => (
            <Menu as="div" key={category.name} className="relative">
              <Menu.Button className="text-gray-700 hover:text-green-600 focus:outline-none flex items-center gap-2">
                {category.name} <FaChevronDown className="ml-1 w-2" />
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right bg-white shadow-lg rounded-md focus:outline-none z-50">
                  <div className="p-2">
                    <h3 className="text-sm font-bold text-green-600">{category.name}</h3>
                    <div className="space-y-1">
                      {category.options.map((option) => (
                        <Menu.Item key={option.label}>
                          {({ active }) => (
                            <Link
                              href={option.href}
                              className={`${
                                active ? 'bg-gray-100 text-green-600' : 'text-gray-700'
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
        </div>
        <div className="space-x-3">
          {!user && (
            <>
              <Link href="/auth/signin" className="text-gray-700 hover:text-green-600">
                Connexion
              </Link>
              <Link href="/auth/signup" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Inscription
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                href="#"
                onClick={() => logout()}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Déconnexion
              </Link>
              <Link href="/Dashboard" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;