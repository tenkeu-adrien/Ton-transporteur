import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import TransporteurColis from "@/components/TransporteurColis";
export async function getServerSideProps(context) {
  const { id } = context.params; // Récupère l'ID depuis l'URL
    // console.log("id du shipment" ,id)
  // Récupérer les données du colis depuis Firebase
  const docRef = doc(db, "shipments", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      notFound: true, // Renvoie une page 404 si le colis n'existe pas
    };
  }

  const shipment = {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt.toDate().toISOString(), // Convertir en chaîne de caractères
  };

  return {
    props: {
      shipment, // Passer shipment en tant que prop
    },
  };
}

export default function ColisDetailsPage({ shipment }) {
  return <TransporteurColis shipment={shipment}  />;
}