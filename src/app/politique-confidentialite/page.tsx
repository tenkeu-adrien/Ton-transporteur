"use client"
import Navbar from "@/components/Navbar";
import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Footer from "@/components/Footer";

const PrivacyPolicy: React.FC = () => {
const { user, userData, loading, error  ,logout} = useContext(AuthContext);

  return (
    <>
    <Navbar   user={user} logout={logout} />
    
    
    <div className=" mx-auto pl-[400px]  bg-white  p-[90px]">
      <h1 className="text-3xl font-bold text-black mb-4">
        Politique de Confidentialité
      </h1>
      <p className="text-gray-700">
        Dernière mise à jour : <strong>[Date]</strong>
      </p>

      <section className="mt-6 p-10">
        <h2 className="text-xl font-semibold text-gray-800">1. Collecte des données</h2>
        <p className="text-gray-700">
          Nous collectons des informations personnelles lors de votre inscription et de l’utilisation de nos services.
        </p>
      </section>

      <section className="mt-4 p-10">
        <h2 className="text-xl font-semibold text-gray-800">2. Utilisation des données</h2>
        <p className="text-gray-700">
          Les données sont utilisées uniquement pour la gestion des services de Ton_Transporteur, l’amélioration de l’expérience utilisateur et le respect des obligations légales.
        </p>
      </section>

      <section className="mt-4 p-10">
        <h2 className="text-xl font-semibold text-gray-800">3. Partage des données</h2>
        <p className="text-gray-700">
          Nous ne partageons vos données qu’avec des partenaires de confiance et uniquement dans le cadre du service.
        </p>
      </section>

      <section className="mt-4 p-10">
        <h2 className="text-xl font-semibold text-gray-800">4. Sécurité des données</h2>
        <p className="text-gray-700">
          Nous mettons en place des mesures de sécurité pour protéger vos informations personnelles.
        </p>
      </section>

      <section className="mt-4 p-10">
        <h2 className="text-xl font-semibold text-gray-800">5. Vos droits</h2>
        <p className="text-gray-700">
          Conformément aux lois en vigueur, vous pouvez demander la suppression ou la modification de vos données personnelles.
        </p>
      </section>

      <section className="mt-4 p-10">
        <h2 className="text-xl font-semibold text-gray-800">6. Contact</h2>
        <p className="text-gray-700">
          Pour toute question concernant la confidentialité, veuillez nous contacter via notre support.
        </p>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default PrivacyPolicy;
