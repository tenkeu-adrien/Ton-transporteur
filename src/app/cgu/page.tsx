"use client"
import Navbar from "@/components/Navbar";
import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Footer from "@/components/Footer";

const CGU: React.FC = () => {
const { user, userData, loading, error  ,logout} = useContext(AuthContext);

  return (
    <>
    <Navbar   user={user} logout={logout}  />
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">CONDITIONS GÉNÉRALES D&apos;UTILISATION (CGU)</h1>
      
      <h2 className="text-2xl font-bold mt-6">1. DÉFINITIONS</h2>
      <p className="mt-2">Les termes suivants ont la signification qui suit dans les CGU lorsqu&apos;ils sont rédigés avec une majuscule :</p>
      <ul className="list-disc ml-6 mt-2">
        <li><strong>{"Annonce"}</strong> : désigne la proposition publiée sur la Plateforme par un Client en vue de la réalisation d’un Transport.</li>
        <li><strong>{"Client"}</strong> : désigne toute personne utilisant la Plateforme pour expédier ou recevoir un Colis.</li>
        <li><strong>{"Application"}</strong> : désigne l’application mobile éditée par Ton_Transporteur, disponible sur iOS et Android.</li>
        <li><strong>{"Colis"}</strong> : désigne un bien déplacé ou transporté dans le cadre d’un Transport.</li>
        <li><strong>{"Ton_Transporteur"}</strong> : désigne la société exploitant la Plateforme numérique permettant la mise en relation entre Clients et le Transporteur.</li>
        <li><strong>{"Compte"}</strong> : désigne l’espace numérique dédié et individualisé d’un Utilisateur sur la Plateforme.</li>
        <li><strong>{"Transport"}</strong> : désigne le déplacement d’un Colis effectué par le Transporteur.</li>
        <li><strong>{"Transporteur"}</strong> : désigne Ton_Transporteur en tant que professionnel du transport de biens.</li>
        <li><strong>{"Utilisateur"}</strong> : désigne toute personne utilisant la Plateforme.</li>
        <li><strong>{"Plateforme"}</strong> : désigne le site web et l’application mobile Ton_Transporteur permettant aux Clients d’accéder au service de transport.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6">2. OBJET</h2>
      <p className="mt-2">Les CGU ont pour objet la définition des modalités d’accès et d’utilisation de la Plateforme, ainsi que de définir les droits et obligations des Utilisateurs en lien avec l’utilisation de la Plateforme.</p>
      <p className="mt-2">La Plateforme a pour objet la mise en relation de Clients avec le Transporteur afin de réaliser des Transports à titre professionnel et à titre onéreux.</p>
      <p className="mt-2">Les CGU ne régissent pas la relation contractuelle entre Ton_Transporteur et le Client. Ton_Transporteur agit en tant que Transporteur unique et assume la responsabilité du bon déroulement du Transport.</p>
      
      <h2 className="text-2xl font-bold mt-6">3. UTILISATION DE LA PLATEFORME</h2>
      <p className="mt-2">L’accès à la Plateforme est réservé aux personnes majeures disposant de la capacité juridique pour contracter.</p>
      <p className="mt-2">Le Client s’engage à fournir des informations exactes et complètes lors de son inscription et à les maintenir à jour.</p>
      
      <h2 className="text-2xl font-bold mt-6">4. RESPONSABILITÉS</h2>
      <p className="mt-2">Ton_Transporteur est responsable de l&apos;acheminement des Colis confiés par les Clients. Toutefois, la responsabilité ne saurait être engagée en cas de force majeure ou de faute du Client (ex. : informations erronées, non-respect des consignes d&apos;emballage).</p>
      
      <h2 className="text-2xl font-bold mt-6">5. ASSURANCES</h2>
      <p className="mt-2">Ton_Transporteur propose une couverture d&apos;assurance pour les Colis transportés. Le montant de l&apos;indemnisation en cas de perte ou de dommage est précisé dans les conditions générales d&apos;assurance.</p>
      
      <h2 className="text-2xl font-bold mt-6">6. MODIFICATIONS DES CGU</h2>
      <p className="mt-2">Ton_Transporteur se réserve le droit de modifier les CGU à tout moment. Les Utilisateurs seront informés de toute modification par notification sur la Plateforme.</p>
      
      <h2 className="text-2xl font-bold mt-6">7. DROIT APPLICABLE</h2>
      <p className="mt-2">Les présentes CGU sont régies par le droit applicable en vigueur dans le pays de domiciliation de Ton_Transporteur. En cas de litige, les tribunaux compétents seront ceux du lieu de domiciliation de Ton_Transporteur.</p>
    </div>
    <Footer />
    
    </>
   
  );
};

export default CGU;














