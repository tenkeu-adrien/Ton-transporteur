import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Bring4You - Déménagement Marseille à Toulouse</title>
        <meta name="description" content="Solution de déménagement économique entre Marseille et Toulouse" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img 
              src="/img/logo-bleu.svg" 
              alt="Bring4You logo" 
              className="h-10"
            />
          </a>

          <div className="hidden md:flex space-x-4">
            <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
              Commerçant
              <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24">
                <path d="m7 10 5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            
            <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
              Particulier
              <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24">
                <path d="m7 10 5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            
            <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
              Transporteur
              <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24">
                <path d="m7 10 5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            
            <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
              Déménagement
              <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24">
                <path d="m7 10 5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            
            <a href="https://faq.bring4you.com/" className="text-gray-700 hover:text-green-600 transition-colors">
              Comment ça marche
            </a>
          </div>

          <div className="hidden md:flex space-x-2">
            <a href="/signin" className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors">
              Connexion
            </a>
            <a href="/signup" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Inscription
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Trouvez votre déménageur de Marseille à Toulouse
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-600 mb-8">
                Solution de déménagement économique, efficace et écologique
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/devis/demenagement" 
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Faire un devis
                </a>
                <a 
                  href="/tasks" 
                  className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Je suis transporteur
                </a>
              </div>
            </div>
            
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-lg mb-4 w-full max-w-md">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">MON CONSEILLER : lundi-vendredi 9h-18h</span>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                    0189711496
                  </button>
                </div>
              </div>
              <img 
                src="/img/illus.avif" 
                alt="B4Y Illustration" 
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Emergency Moving */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Déménagement en urgence de Marseille à Toulouse
                </h3>
                <h4 className="text-lg text-green-600 mb-4">
                  UN IMPERATIF OU UNE URGENCE ? BRING4YOU VOUS PROPOSE LA SOLUTION DE DEMENAGEMENT
                </h4>
                <p className="text-gray-600 mb-4">
                  Vous êtes pris au dernier moment dans l'école de vos rêves ou trouvez un nouveau boulot à Marseille ou à Toulouse et vous devez déménager en urgence ? Aucun souci ! Avec Bring4You, vous obtenez des réponses rapides pour un déménagement express entre Marseille et Toulouse en semaine comme en week end.
                </p>
                <a 
                  href="/devis/demenagement" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Devis en ligne
                </a>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <img 
                  src="/img/cities/transporteur.webp" 
                  alt="Transporteur" 
                  className="rounded-lg h-48 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Studio Moving */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Déménager un studio de Marseille à Toulouse
                </h3>
                <h4 className="text-lg text-green-600 mb-4">
                  BESOIN DE TROUVER UN PETIT CAMION OU D'UN UTILITAIRE POUR UN PETIT DEMENAGEMENT?
                </h4>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas besoin d'un camion de 20m3 impossible à garer dans votre rue pour effectuer le déménagement de votre studio de Marseille à Toulouse ? 1 lit. 1 frigo. 1 bureau et quelques cartons à déménager ? Bring4You vous trouve ce qu'il vous faut pour déménager votre studio simplement et au meilleur prix.
                </p>
                <a 
                  href="/devis/demenagement" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Devis en ligne
                </a>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <img 
                  src="/img/cities/colis.webp" 
                  alt="Colis" 
                  className="rounded-lg h-48 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Professional Moving */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Déménager vos locaux de Marseille à Toulouse
                </h3>
                <h4 className="text-lg text-green-600 mb-4">
                  BRING4YOU, C'EST AUSSI DES SOLUTIONS POUR LES PROFESSIONNELS
                </h4>
                <p className="text-gray-600 mb-4">
                  Devis gratuits en ligne. Solutions économiques, efficaces et écologiques pour les professionnels. Vous changez de locaux professionnels de Marseille à Toulouse et vous recherchez une solution de déménagement adaptée à la taille et aux besoins spécifiques ? Bring4You vous offre un service de qualité.
                </p>
                <a 
                  href="/devis/demenagement" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Devis en ligne
                </a>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <img 
                  src="/img/cities/meuble.webp" 
                  alt="Meuble" 
                  className="rounded-lg h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Déménagez facilement et rapidement de Marseille à Toulouse avec Bring4You
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p>
              Vous prévoyez un déménagement entre Marseille et Toulouse? Ne cherchez plus, Bring4You est là pour vous offrir un service professionnel et sécurisé qui vous facilitera la vie!
            </p>
            <p>
              Avec Bring4You, vous pouvez déménager facilement et rapidement de Marseille à Toulouse, sans tracas ni stress. Nous comprenons que chaque déménagement est unique, c'est pourquoi nous vous offrons un service sur mesure adapté à vos besoins.
            </p>
            <p>
              Que vous souhaitiez déménager un lit, des meubles ou même votre jardin, notre équipe de déménageurs expérimentés est là pour répondre à tous vos besoins. Nous disposons des ressources nécessaires pour assurer un transport sûr et efficace de vos biens, quels qu'ils soient.
            </p>
            <p>
              De plus, grâce à notre comparateur de devis en ligne, vous pouvez facilement comparer les différentes options de déménagement et choisir celle qui correspond le mieux à votre budget et à vos exigences. Nous nous engageons à vous fournir des tarifs compétitifs et transparents, sans frais cachés.
            </p>
            <p>
              La satisfaction de nos clients est notre priorité absolue, c'est pourquoi nous offrons des garanties déménagement pour vous assurer une tranquillité d'esprit totale. Nous mettons tout en œuvre pour que votre déménagement se déroule sans accroc, du début à la fin.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
            Comment trouver un déménageur entre Marseille et Toulouse ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <img 
                src="/img/box.png" 
                alt="Déposez une annonce" 
                className="h-24 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Déposez une annonce</h3>
              <p className="text-gray-600">
                Dites ce que vous voulez envoyer. Détaillez votre annonce avec l'adresse, les dimensions, le poids et le détail de livraison.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <img 
                src="/img/chat.png" 
                alt="Recevez des propositions" 
                className="h-24 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Recevez des propositions</h3>
              <p className="text-gray-600">
                Les voyageurs vous contactent par texto ou mail. Mettez-vous d'accord sur les détails de livraison (prix, date d'enlèvement et de livraison).
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <img 
                src="/img/check.png" 
                alt="Validez votre réservation" 
                className="h-24 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Validez votre réservation</h3>
              <p className="text-gray-600">
                Réglez en ligne pour bénéficier d'une assurance et suivre votre colis. Votre paiement ne sera versé au voyageur qu'une fois le colis livré.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}