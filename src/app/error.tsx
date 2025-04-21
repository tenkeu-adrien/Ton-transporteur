'use client'

import { useEffect } from 'react'
import { FaExclamationCircle, FaHome } from 'react-icons/fa'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-500 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center">
            <FaExclamationCircle className="text-5xl mr-3" />
            <h1 className="text-3xl font-bold">Erreur inattendue</h1>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Une erreur est survenue dans Ton-transporteur :
          </p>
          <p className="text-red-500 bg-red-50 p-3 rounded mb-6 font-mono text-sm">
            {error.message}
          </p>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => reset()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Réessayer
            </button>
            
            <Link 
              href="/Accueil" 
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              <FaHome /> Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}