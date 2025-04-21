'use client'

import { useEffect, useState } from 'react'
import { auth } from '../../lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { FaWifi, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'

export default function FirebaseConnectionStatus({ children }) {
  const [status, setStatus] = useState('checking')
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus('error')
    }, 10000) // Timeout après 10 secondes

    const unsubscribe = auth.onAuthStateChanged((user) => {
      clearTimeout(timeout)
      setStatus('connected')
    }, (error) => {
      clearTimeout(timeout)
      setStatus('error')
    })

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  if (status === 'connected') {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'checking' ? (
          <>
            <FaSpinner className="animate-spin text-green-500 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Connexion en cours</h1>
            <p className="text-gray-600 mb-6">
              Nous établissons la connexion avec ton-transporteur...
            </p>
          </>
        ) : (
          <>
            <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
              <FaExclamationTriangle className="text-red-500 text-4xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Problème de connexion</h1>
            <p className="text-gray-600 mb-6">
              Impossible de se connecter à ton-transporteur. Vérifiez votre connexion internet.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  )
}