import Link from 'next/link'
import { FaHome, FaShippingFast, FaSadTear } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-500 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center">
            <FaSadTear className="text-5xl mr-3" />
            <h1 className="text-3xl font-bold">404 - Page introuvable</h1>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Oups ! La page que vous cherchez  n'est pas disponible
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <FaHome /> Accueil
            </Link>
            
            <Link 
              href="/Dashboard" 
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <FaShippingFast /> Mes transports
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}