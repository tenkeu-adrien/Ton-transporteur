'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RouterWrapper({ children }) {
  const router = useRouter()
  
  useEffect(() => {
    const handleError = (error) => {
      console.error('Router error:', error)
      // Rediriger vers une page d'erreur ou afficher un message
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [router])

  return children
}