// pages/index.tsx
"use client"
import Navbar from "@/components/Navbar";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";


export default function Home() {
  const { user,logout} = useContext(AuthContext);
    const testimonials = [
        {
          name: "Marc T",
          rating: 5,
          comment: "Je suis très satisfaite du service qui a été très rapide."
        },
        {
          name: "Thierry B.",
          rating: 5,
          comment: "J'ai été ravie qu'on puisse enlever mes colis en bas de chez moi, les livrer en province dans un délai très raisonnable."
        },
        {
          name: "Ludovic C.",
          rating: 5,
          comment: "Ce n'est pas le premier transport que je fais mais c'est toujours un plaisir. Cela permet de diminuer un peu la note de péage."
        },
        {
          name: "Claire V.",
          rating: 5,
          comment: "Je ne connaissais pas cette plateforme. Ayant un transport de meuble a effectuer, j'ai tenté. Une demie journée après avoir déposé mon annonce, j'ai été contacté."
        },
        {
          name: "Sandrine P.",
          rating: 5,
          comment: "Très bonne expérience pour la première fois, rapide et efficace et moins cher que les prestataires habituels. Je recommande !"
        }
      ];
   const cards= [ {
        role: "Je veux envoyer un colis",
        description: "Vous avez un colis ou un meuble à envoyer ? Notre transporteur s’occupe de tout.",
        image: "/user.png",
        link: "/start",
      },
      {
        role: "Je suis un expéditeur",
        description: "Je souhaite envoyer un colis ou organiser un déménagement facilement avec Ton-Transporteur.",
        image: "/user.png",
        link: "/start",
      },
      {
        role: "Je suis une boutique partenaire",
        description: "Je souhaite livrer mes clients rapidement et à moindre coût.",
        image: "/user.png",
        link: "/start",
      }]
      
    //   const TestimonialsAndFAQ = () => {
        
      
       
      
        const renderStars = (rating: number) => {
          return (
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1a1 1 0 0 1 .897.557l2.857 5.79 6.39.934a1 1 0 0 1 .554 1.705l-4.623 4.503 1.09 6.362a1 1 0 0 1-1.45 1.054L12 18.9l-5.715 3.005a1 1 0 0 1-1.45-1.054l1.09-6.362-4.623-4.503a1 1 0 0 1 .553-1.705l6.39-.935 2.858-5.789A1 1 0 0 1 12 1"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
          );
        };


  return (
    <main>


      <Navbar  user={user} logout={logout}/>
        <section className="bg-green-500 overflow-hidden pt-24 xl:pt-36 2xl:pt-40 px-4 md:px-12 xl:px-16 2xl:px-[10rem] min-h-screen">
      <div className="max-w-7xl mx-auto relative py-24">
        <div className="flex flex-col gap-8 max-w-full lg:max-w-[750px] z-[1] relative">
          <h1 className="text-gray-950 text-xl md:text-3xl font-bold leading-tight text-white">
          Ton-Transporteur est une application web qui vous permet de trouver des solutions pour tous types de transports d’objets et de marchandises générales.
          </h1>
          <p className="text-gray-950 text-2xl font-normal text-white">
          Économique, Simple et Écologique
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
            <a
              href="/auth/signup"
              className="bg-green-800 hover:bg-green-700 active:bg-gray-900 text-white px-6 py-3 text-base font-medium rounded w-full sm:w-auto transition"
            >
              Je m'inscris !
            </a>
          </div>
        </div>
        <Image
          src="/comment-1.jpg"
          alt="Comment ça marche"
          className="absolute left-[750px] top-0 bottom-0 h-[80%] xl:h-[90%] max-h-[600px] w-auto object-contain hidden lg:block"
          width={100}
          height={100}
        />
      </div>
    </section>
    <section className="bg-white px-10 py-16 -mt-[350px]">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        <div className="space-y-8 flex-1">
          <h2 className="text-gray-950 text-4xl font-bold">
            Envoyez ou recevez simplement !
          </h2>
          <p className="text-gray-950 text-lg">
            Ton-transporteur est une <strong>solution de livraison</strong> collaborative qui s’appuie sur une communauté de livreurs particuliers et professionnels pour permettre des livraisons <strong>moins chères, <span  rel="noreferrer" className="underline text-green-600">plus écologiques</span> dans des délais très courts</strong>, de presque tout, partout en France.
          </p>
          <p className="text-gray-950 text-lg">
            Ton-transporteur permet la livraison de <strong>tout ce qui ne passe pas</strong> par les solutions d'envoi classiques ou qui coûte trop cher à expédier : mobilier, électroménager, vaisselle, objets de déco, miroirs, matériel de jardin, équipements de loisirs, etc.
          </p>
          <p className="text-gray-950 text-lg">
            Vous envoyez ou recevez vos objets volumineux, lourds ou fragiles <strong>à moindre coût et rapidement.</strong> Cocolis vous met en relation avec quelqu'un qui fait déjà le trajet !
          </p>
          <p className="text-gray-950 text-lg">
            Notre service fonctionne aussi pour les professionnels : si vous êtes <strong>commerçant</strong> et que vous avez besoin d'une nouvelle solution de livraison, contactez-nous pour avoir plus d'infos !
          </p>
          <a
            href="/start"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Déposer une annonce
          </a>
        </div>
        <div className="relative flex-1">
          <Image
            src="/comment-2.jpg"
            alt="livraison economique"
            className="w-full h-full object-contain rounded-2xl max-h-[300px] lg:max-h-none"
            width={100}
            height={100}
          />
        </div>
      </div>
    </section>




    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {cards.map((card) => (
    <div key={card.role} className="flex flex-col items-center text-center gap-4">
      <img src={card.image} alt={card.role} className="w-24 h-24 object-contain" />
      <h3 className="text-xl font-bold">{card.role}</h3>
      <p className="text-gray-700">{card.description}</p>
      <a href={card.link}>
        <span className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">En savoir plus</span>
      </a>
    </div>
  ))}
</div>







<section className="px-6 py-16 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          La meilleure solution de mise en relation pour envoyer ou recevoir un bien.
        </h2>
        <p className="text-lg text-gray-800 mb-12">
          Ton-Transporteur connecte particuliers et professionnels pour permettre des livraisons plus économiques, écologiques et rapides.
        </p>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Étape 1 */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <Image src="/boite-en-carton.png" alt="Étape 1" className="w-24 h-24 object-contain"  width={100} height={100}/>
            <h3 className="text-xl font-semibold text-gray-800">Déposez une annonce</h3>
            <p className="text-center text-gray-700 text-base">
              Indiquez ce que vous souhaitez envoyer, le lieu de départ et d'arrivée. Ton-Transporteur suggère un prix en fonction du volume et de la distance.
            </p>
          </div>

          {/* Étape 2 */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <Image src="/bulle-de-discussion.png" alt="Étape 2" className="w-24 h-24 object-contain"   width={100} height={100}/>
            <h3 className="text-xl font-semibold text-gray-800">Recevez des propositions</h3>
            <p className="text-center text-gray-700 text-base">
              Vous recevez des propositions de personnes qui font le trajet. Vous pouvez échanger avec eux et réserver une place dans leur véhicule.
            </p>
          </div>

          {/* Étape 3 */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <Image src="/verifier.png" alt="Étape 3" className="w-24 h-24 object-contain" width={100} height={100} />
            <h3 className="text-xl font-semibold text-gray-800">Confirmez la réception du bien</h3>
            <p className="text-center text-gray-700 text-base">
              Le transporteur est payé quand vous confirmez la bonne réception. Tous les profils sont vérifiés et une assurance est proposée.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="px-6 py-16 bg-green-50">
      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Ton-Transporteur et la sécurité</h2>
          <p className="text-gray-800 text-lg">
            Ton-Transporteur propose <strong  className="text-green-600 underline">une assurance</strong> pour protéger vos biens <strong>jusqu'à 5 000 euros</strong> lors du transport. Elle couvre la casse et le vol pendant le trajet.
          </p>
          <p className="text-gray-800 text-lg">
            L'année dernière, seulement <strong>0,002%</strong> des livraisons ont nécessité un dossier d’assurance. Notre service est super fiable !
          </p>
          <p className="text-gray-800 text-lg">
            <strong>✓ Des profils vérifiés.</strong> L'identité de nos membres est vérifiée pour garantir la sécurité des échanges sur la plateforme.
          </p>
        </div>
        <div className="flex-1">
          <Image
            src="/umbrella.png"
            alt="Sécurité transport"
            className="w-[3500px] h-auto rounded-lg shadow-md"
            width={100}
            height={0}
          />
        </div>
      </div>
    </section>





    <div className="bg-white">
      {/* Testimonials Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Ce que nos clients disent</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg flex flex-col gap-6 h-full">
              <div className="flex flex-wrap flex-col md:flex-row-reverse justify-start md:justify-end items-start md:items-center gap-3">
                {renderStars(testimonial.rating)}
                <h3 className="text-gray-900 font-medium">{testimonial.name}</h3>
              </div>
              <p className="text-gray-900">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section className="py-12 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Questions fréquentes</h3>
          
          <div className="space-y-4 w-full">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 bg-white rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 md:p-6 focus:outline-none"
                  aria-expanded="false"
                  aria-controls={`faq-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-gray-900"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.827.688A11.27 11.27 0 0 0 5.11 3.024a11.7 11.7 0 0 0-2.087 2.088A11.3 11.3 0 0 0 .725 11.06c-.047.591-.047 1.29 0 1.882a11.27 11.27 0 0 0 2.567 6.283c.426.512.972 1.058 1.484 1.484a11.27 11.27 0 0 0 6.283 2.567c.32.026.556.034.94.034.386 0 .621-.008.942-.034a11.292 11.292 0 0 0 7.767-4.05 11.3 11.3 0 0 0 2.451-5.348c.105-.622.15-1.19.15-1.877 0-.385-.009-.62-.034-.94a11.3 11.3 0 0 0-4.05-7.767A11.3 11.3 0 0 0 13.53.787a12 12 0 0 0-1.704-.1m-.254 2.01a9.2 9.2 0 0 0-2.967.63 9.4 9.4 0 0 0-2.012 1.089 9.7 9.7 0 0 0-1.752 1.627 9.3 9.3 0 0 0-2.005 4.286 9.5 9.5 0 0 0 .053 3.61 9.4 9.4 0 0 0 1.526 3.466 9.7 9.7 0 0 0 1.628 1.752 9.303 9.303 0 0 0 13.085-1.168c.774-.915 1.372-1.999 1.745-3.164a9.36 9.36 0 0 0 0-5.652A9.4 9.4 0 0 0 19.58 6.59a9.316 9.316 0 0 0-5.857-3.743 9.6 9.6 0 0 0-2.15-.149m.076 2.818A3.756 3.756 0 0 0 8.266 8.9c-.035.408-.014.605.088.8a1 1 0 0 0 .997.545.98.98 0 0 0 .702-.399c.135-.18.2-.384.2-.634 0-.23.072-.516.187-.746.095-.19.2-.33.369-.49a1.743 1.743 0 0 1 2.875.814c.05.184.057.247.057.465 0 .187-.002.218-.025.327-.102.48-.358.862-.756 1.13a2 2 0 0 1-.39.194 2.6 2.6 0 0 0-.388.18 2.4 2.4 0 0 0-1.14 1.616c-.039.203-.042.287-.038.926.003.593.004.617.024.689.092.33.343.595.667.702.172.057.438.057.61 0 .322-.107.573-.37.665-.7.021-.074.022-.094.028-.667.005-.575.006-.591.026-.641a.4.4 0 0 1 .166-.193c.019-.01.097-.043.173-.072a3.73 3.73 0 0 0 1.77-1.436 3.73 3.73 0 0 0 .603-1.714 5 5 0 0 0-.005-.739 3.75 3.75 0 0 0-3.15-3.311 4 4 0 0 0-.932-.029m.186 10.306a1.35 1.35 0 0 0-.797.398 1.342 1.342 0 1 0 2.132.278 1.34 1.34 0 0 0-1.335-.676"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h5 className="text-gray-900 font-medium">{faq.question}</h5>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 25 25"
                    className="w-5 h-5 text-gray-900"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.853 11.084a2 2 0 0 1 2.829-2.829l4.585 4.586 4.586-4.586a2 2 0 1 1 2.828 2.829l-6 6a2 2 0 0 1-2.828 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div id={`faq-${index}`} className="hidden px-6 pb-6">
                  <p className="text-gray-900">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Mobile App Section */}
      {/* <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-10 lg:gap-32">
          <div className="space-y-8 flex-1">
            <h2 className="text-3xl font-bold text-gray-900">
              <strong>Cocolis sur votre mobile</strong>
            </h2>
            <p className="text-gray-900 text-lg">
              Vous pouvez télécharger la <strong>première application mobile</strong> de cotransportage pour iPhone et Android !
            </p>
            <p className="text-gray-900 text-lg">
              Toutes les annonces sur vos trajets, les dernières informations et des fonctions exclusives pour les téléphones mobiles.
            </p>
            <p className="text-gray-900 text-lg">
              <strong>✓ Recherchez et consultez</strong> les nouvelles offres sur votre trajet
            </p>
            <p className="text-gray-900 text-lg">
              <strong>✓ Gagnez de l'argent</strong> sur la route
            </p>
            <p className="text-gray-900 text-lg">
              <strong>Téléchargez vite l'appli n°1 de cotransportage de colis !</strong>
            </p>
            <a
              href="https://www.cocolis.fr/mobile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Découvrir l'application
            </a>
          </div>
          <div className="flex-1 relative">
            <img
              src="https://images.prismic.io/cocolis/ZiqRoPPdc1huK0w3_splitsi_4_2.png?auto=format,compress&fit=max&w=3840"
              alt="application cocolis"
              className="rounded-lg w-full h-full object-contain max-h-96 lg:max-h-none"
            />
          </div>
        </div>
      </section> */}
    </div>

    <Footer />

    </main>
  );
}
