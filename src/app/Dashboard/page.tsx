import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProtectedRoute from "../../../lib/functions";
import NotificationSetup from "@/components/NotificationSetup";
export const metadata: Metadata = {
  title: "Ton Transporteur - Gestion de Livraison et Logistique",
  description: "Ton Transporteur est une application de gestion de livraison et de logistique conçue pour optimiser vos opérations de transport. Suivez vos envois en temps réel, gérez vos flottes et améliorez l'efficacité de vos livraisons.",
};

export default function Dashboard() {
  return (
    <>
    <ProtectedRoute> 
      <DefaultLayout>
          <NotificationSetup />
        <ECommerce />
      </DefaultLayout>
      </ProtectedRoute>
    </>
    
  );
}




