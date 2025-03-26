import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ShippedPackages from "@/components/ShippedPackages";

export const metadata: Metadata = {
  title: "Ton-transporteur de colis",
  description:
    "transporter vos colis partout partout en europe en payabt juste les frais des transporteur",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Gestion des Envois" />
      <div className="flex flex-col gap-10">
<ShippedPackages />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;

