import { useEffect, useState } from "react";
import { db } from "../../../lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Avatar } from "../Avartar";

type SHIPPER = {
  id: string;
  logo: string;
  firstName: string;
  lastName: string;
  totalShipments: number;
  pendingShipments: number;
  deliveredShipments: number;
  deliveryRate: any;
};

const TableOne = () => {
  const [shippers, setShippers] = useState<SHIPPER[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippersData = async () => {
      try {
        // 1. Récupérer tous les utilisateurs avec le rôle "shipper"
        const usersRef = collection(db, "users");
        const shippersQuery = query(usersRef, where("role", "==", "expediteur"));
        const shippersSnapshot = await getDocs(shippersQuery);

        const shippersData: SHIPPER[] = [];

        // 2. Pour chaque expéditeur, récupérer ses envois
        for (const shipperDoc of shippersSnapshot.docs) {
          const shipperData = shipperDoc.data();
          
          // Récupérer tous les envois de cet expéditeur
          const shipmentsRef = collection(db, "shipments");
          const shipmentsQuery = query(
            shipmentsRef, 
            where("expediteurId", "==", shipperDoc.id)
          );
          const shipmentsSnapshot = await getDocs(shipmentsQuery);

          // Calculer les statistiques
          let totalShipments = 0;
          let pendingShipments = 0;
          let deliveredShipments = 0;

          shipmentsSnapshot.forEach((doc) => {
            const shipment = doc.data();
            totalShipments++;
            
            switch (shipment.status) {
              case "en attente":
                pendingShipments++;
                break;
              case "livré":
                deliveredShipments++;
                break;
            }
          });

          // Calculer le taux de livraison
          const deliveryRate = totalShipments > 0 
            ? ((deliveredShipments / totalShipments) * 100).toFixed(1)
            : 0;

          shippersData.push({
            id: shipperDoc.id,
            logo: shipperData.photoURL || "/images/shipper/default-avatar.svg",
            firstName: shipperData.firstName,
            lastName: shipperData.lastName,
            totalShipments,
            pendingShipments,
            deliveredShipments,
            deliveryRate: parseFloat(deliveryRate),
          });
        }

        setShippers(shippersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippersData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white p-8 text-center">
        Chargement des données...
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Liste des expéditeurs
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Expéditeur
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Colis expédiés
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Colis en attente
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Colis livrés
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Taux de livraison
            </h5>
          </div>
        </div>

        {shippers.map((shipper, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === shippers.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={shipper.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
              <Avatar
        size={10}
        src={null}
        name={`${shipper?.firstName} ${shipper?.lastName}`}
      />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {`${shipper.firstName} ${shipper.lastName}`}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{shipper.totalShipments}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{shipper.pendingShipments}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{shipper.deliveredShipments}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{shipper.deliveryRate}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;