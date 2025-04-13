"use client"
import Navbar from "@/components/Navbar";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Footer from "@/components/Footer";

const CGU: React.FC = () => {
  const { user, userData, loading, error  ,logout} = useContext(AuthContext);

  return (
    <>
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">
        Conditions Générales d’Utilisation (CGU)
      </h1>
      <p className="text-gray-700">
        Dernière mise à jours : <strong>12 Avvril 2025</strong>
      </p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800">1. Présentation du service</h2>
        <p className="text-gray-700">
          Ton_Transporteur est une plateforme permettant aux Expéditeurs d’envoyer des colis ou d’organiser un déménagement. 
          Le transport est assuré exclusivement par Ton_Transporteur.
        </p>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800">2. Accès et utilisation de la plateforme</h2>
        <p className="text-gray-700">
          L’inscription sur la plateforme est obligatoire pour accéder aux services. L’Expéditeur doit fournir des informations exactes.
        </p>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800">3. Responsabilités</h2>
        <p className="text-gray-700">
          - L’Expéditeur est responsable du bon emballage du colis et de sa conformité. <br />
          - Ton_Transporteur garantit le transport sécurisé du colis mais ne peut être tenu responsable des retards dus à des événements extérieurs.
        </p>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800">4. Assurances et garanties</h2>
        <p className="text-gray-700">
          Une assurance optionnelle peut être souscrite. L’indemnisation est plafonnée à la valeur déclarée du colis.
        </p>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800">5. Données personnelles</h2>
        <p className="text-gray-700">
          Les données sont traitées conformément à la politique de confidentialité de Ton_Transporteur.
        </p>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800">6. Droit applicable</h2>
        <p className="text-gray-700">
          En cas de litige, la recherche d’une solution amiable sera privilégiée.
        </p>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default CGU;
