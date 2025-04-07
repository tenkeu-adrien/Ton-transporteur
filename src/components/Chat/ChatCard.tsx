// import { useEffect, useState } from "react";
// import { db, auth } from "../../../lib/firebaseConfig";
// import { collection, query, where, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";
// import { Avatar } from "../Avartar";
// import { useRouter } from "next/navigation";
// import { FiBox, FiMessageSquare, FiPackage } from "react-icons/fi";
// interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   unreadCount: number;
//   lastName: string,
//   profile?: string;
//   role: string,
//   lastMessage?: string;
// }

// interface ChatCardProps {
//   message?: {
//     price: string;
//     date: string;
//     additionalInfo: string;
//   };
// }

// const ChatCard: React.FC<ChatCardProps> = ({ message }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   // const [users, setUsers] = useState<User[]>([]);
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const currentUserId = auth?.currentUser?.uid;
//   const [error, setError] = useState<string | null>(null);
//   const [shipments, setShipments] = useState([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   // Formater le message si présent
//   const router = useRouter()


//   useEffect(() => {
//     const fetchShipments = async () => {
//       try {
//         setLoading(true);
//         const shipmentsCollection = collection(db, 'shipments');
//         const q = query(shipmentsCollection, where("expediteurId", "==", auth?.currentUser.uid));
//         const shipmentsSnapshot = await getDocs(q);

//         const shipmentsData = shipmentsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));

//         setShipments(shipmentsData);
//         setError(null);
//       } catch (err) {
//         console.error("Erreur lors de la récupération des shipments:", err);
//         setError("Erreur lors du chargement des données");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchShipments();
//   }, [auth?.currentUser.uid]);
//   useEffect(() => {
//     const fetchUsers = async () => {
//       if (!currentUserId) return;
//       try {
//         // 1. Récupérer les informations de l'utilisateur connecté
//         const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
//         const currentUserData = currentUserDoc.data();
//         setCurrentUser(currentUserData);

//         const usersRef = collection(db, "users");
//         let usersQuery;

//         // 2. Construire la requête avec un seul where
//         if (currentUserData?.role == "expediteur") {
//           // Pour les expéditeurs, filtrer par rôle transporteur
//           usersQuery = query(
//             usersRef,
//             where("role", "==", "transporteur")
//           );
//         } else {
//           // Pour les autres, récupérer tous les utilisateurs
//           usersQuery = query(
//             usersRef,
//             where("email", "!=", "")
//           );
//         }
//         onSnapshot(usersQuery, async (snapshot) => {
//           // Filtrer côté client
//           const usersList = snapshot.doc
//             .filter(doc =>
//               doc.id !== currentUserId && // Exclure l'utilisateur courant
//               doc.data().email // Vérifier que l'email existe
//             )
//             .map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//               unreadCount: 0,
//             }));

//           // Vérifier les messages non lus

//           const updatedUsers = await Promise.all(
//             usersList.map(async (user) => {
//               const messagesRef = collection(db, "messages");
//               const unreadQuery = query(
//                 messagesRef,
//                 where("receiver", "==", currentUserId),
//                 where("sender", "==", user.id),
//                 where("isRead", "==", false)
//               );

//               const unreadMessages = await new Promise((resolve) => {
//                 onSnapshot(unreadQuery, (snapshot) => {
//                   resolve(snapshot.docs.length);
//                 });
//               });

//               return { ...user, unreadCount: unreadMessages };
//             })
//           );

//           setUsers(updatedUsers);
//         });
//       } catch (error) {
//         console.error("Erreur lors de la récupération des utilisateurs :", error);
//       }
//     };

//     fetchUsers();

//   }, [currentUserId]);


//   const handleChatClick = (expediteur: string) => {
//     router.push(`/chat/${expediteur}`);
//   };
  
//   return (
//     <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
//       <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
//         Chats
//       </h4>
//       <div>

//       {loading ? (
//     <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       <span className="ml-4">Chargement en cours...</span>
//     </div>
//   ) : error ? (
//     // Gestion des erreurs
//     <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
//   ) : shipments.length === 0 ? (
//     // Si aucun shipment trouvé
//     <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
//       Aucun shipment trouvé.
//     </div>
//   ) : (
//     // Si les données sont chargées et disponibles
  
//     <div className="space-y-4">
//   <div className="text-center">
//     <h1 className="text-3xl font-bold text-green-600 mb-2 flex items-center justify-center gap-2">
//       <FiPackage className="text-green-500" /> 
//       Vos Colis
//     </h1>
//     <p className="text-gray-500">Gérez vos envois et discussions</p>
//   </div>

//   {shipments.map((shipment) => (
//     <div
//       key={shipment.id}
//       className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-gray-50 cursor-pointer border border-gray-100"
//       onClick={() => handleChatClick(shipment.id)}
//     >
//       <div className="flex items-center gap-3">
//         <FiBox className="text-green-500 text-xl" />
//         <span className="font-medium capitalize text-gray-700">
//           {shipment.objectName}
//         </span>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-sm text-gray-500">
//           {/* {new Date(shipment.).toLocaleDateString()} */}
//           {shipment.createdAt.toDate
//                             ? shipment.createdAt.toDate().toLocaleString("fr-FR", {
//                                 day: "numeric",
//                                 month: "long",
//                                 year: "numeric",
//                               })
//                             : "Date invalide"}
//         </span>
//         <FiMessageSquare className="text-green-500 text-xl hover:text-green-600 transition-colors" />
//       </div>
//     </div>
//   ))}
// </div>
//   )}
//         {users.map((user, key) => (
//           <>
          
//             <div className="relative h-14 w-14 rounded-full">
// <Avatar
//         size={10}
//         // src={user?.profile}
//         src={null}
//         name={`${user?.firstName} ${user?.lastName}`}
//       />

//             </div>

//             <div className="flex flex-1 items-center justify-between">
//               <div>
//                 <h5 className="font-medium text-black dark:text-white">
//                   {user.firstName} {user.lastName}
//                 </h5>
                
//               </div>

//               {user.unreadCount > 0 && (
//                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
//                   <span className="text-sm font-medium text-white">
//                     {user.unreadCount}
//                   </span>
//                 </div>
//               )}
//             </div>
//           <hr />
//           </>
//         ))}


//       </div>
//     </div>
//   );
// };

// export default ChatCard;


import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebaseConfig";
import { collection, query, where, onSnapshot, doc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { Avatar } from "../Avartar";
import { useRouter } from "next/navigation";
import { FiBox, FiMessageSquare, FiPackage, FiTruck } from "react-icons/fi";
import { FaBoxOpen, FaCalendarAlt, FaCheck, FaEnvelope, FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import { MdDirectionsBike, MdDoneAll } from "react-icons/md";

interface User {
  id: string;
  email: string;
  firstName: string;
  unreadCount: number;
  lastName: string;
  profile?: string;
  role: string;
  lastMessage?: string;
}

interface Shipment {
  id: string;
  objectName: string;
  createdAt: any;
  pickupAddress:any,
  status: string;
  messageCount?: number;
}

interface ChatCardProps {
  message?: {
    price: string;
    date: string;
    additionalInfo: string;
  };
}

const ChatCard: React.FC<ChatCardProps> = ({ message }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const currentUserId = auth?.currentUser?.uid;
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [notification, setNotification] = useState(null);
  const handleEnlevement = async (id) => {
    // action Firebase pour marquer comme enlevé
      await updateDoc(doc(db, "shipments", id), { enlevement: true })
    console.log("Enlèvement effectué pour :", id);
  };

  const handleDechargement = async (id) => {
    // action Firebase pour marquer comme déchargé
     await updateDoc(doc(db, "shipments", id), { dechargement: true })
    console.log("Déchargement effectué pour :", id);
  };


  const confirmAction = async () => {
    try {
      // Préparer les updates avec les dates et le statut
      const updates = {
        [currentAction === 'enlevement' ? 'enlevementEffectue' : 'dechargementEffectue']: true,
        status: currentAction === 'enlevement' ? 'En cours de livraison' : 'Livré',
        [currentAction === 'enlevement' ? 'dateEnlevement' : 'dateDechargement']: new Date().toISOString()
      };
      var mail =currentShipment.senderInfo.email
      var user = currentShipment?.senderInfo
      // Appeler la fonction appropriée selon l'action
      if (currentAction === 'enlevement') {
        // email, shipment, action, transporterInfo
        
        await handleEnlevement(currentShipment.id); 
        const response =   await fetch('/api/send-notif', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: "enlevement",
            email:mail ,
            shipment: { objectName: currentShipment.objectName ,id:currentShipment.id },
            transporterInfo:user
          })
        });
        if (!response.ok) {
          const errorData = await response.text(); // Lire d'abord comme texte
          console.error('Server responded with:', errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }


        
        // Passage des updates supplémentaires
      } else {

        await handleDechargement(currentShipment.id); 
        setActionConfirmed(true);
        const response =   await fetch('/api/send-notif', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: "dechargement",
            email:mail ,
            shipment: { objectName: currentShipment.objectName ,id:currentShipment.id },
            transporterInfo:user
          })
        });
        if (!response.ok) {
          const errorData = await response.text(); // Lire d'abord comme texte
          console.error('Server responded with:', errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Passage des updates supplémentaires
      }
  
  
      
      // Envoyer une notification par email
      // await sendStatusEmail(currentShipment, currentAction);
      
      // Afficher une notification locale
      setNotification({
        type: 'success',
        message: currentAction === 'enlevement' 
          ? 'Enlèvement confirmé avec succès' 
          : 'Déchargement confirmé avec succès'
      });
      
      // Fermer automatiquement après 3 secondes
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Erreur lors de la confirmation'
      });
      console.error("Erreur:", error);
    }
  };

 
  const checkDueDates = (shipment) => {
    const today = new Date();
    const pickupDate = new Date(shipment.dateDepart);
    const deliveryDate = new Date(shipment.dateLivraison);

    if (!shipment.enlevementEffectue && today >= pickupDate) {
      return (
        <div className="mt-2 flex items-center text-yellow-600 text-sm">
          <FaCalendarAlt className="mr-1" />
          <span>Date d'enlèvement atteinte</span>
        </div>
      );
    }

    if (!shipment.dechargementEffectue && today >= deliveryDate) {
      return (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <FaCalendarAlt className="mr-1" />
          <span>Date de livraison atteinte</span>
        </div>
      );
    }

    return null;
  };
  const [shipmentss, setShipmentss] = useState([]);

  console.log("shipments " ,shipmentss)
  useEffect(() => {
    const q = query(
      collection(db, "shipments"),
      where("status", "==", "Accepter")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShipmentss(results);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (action, shipment) => {
    setCurrentAction(action);
    setCurrentShipment(shipment);
    setShowModal(true);
    setActionConfirmed(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setNotification(null);
  };



  useEffect(() => {
    const fetchShipments = async () => {
      if (!currentUserId) return;
      
      try {
        setLoading(true);
        const shipmentsCollection = collection(db, 'shipments');
        const q = query(
          shipmentsCollection, 
          where("expediteurId", "==", currentUserId),
          where("status", "!=", "Annuler")
        );
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const shipmentsData = await Promise.all(snapshot.docs.map(async (doc) => {
            const shipment = {
              id: doc.id,
              ...doc.data(),
            } as Shipment;

            // Compter les messages pour ce shipment
            const messagesQuery = query(
              collection(db, "messages"),
              where("shipmentId", "==", doc.id)
            );
            
            const messagesSnapshot = await getDocs(messagesQuery);
            return {
              ...shipment,
              messageCount: messagesSnapshot.size
            };
          }));

          setShipments(shipmentsData);
          setError(null);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Erreur lors de la récupération des shipments:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [currentUserId]);
  useEffect(() => {
    const fetchShipmentsWithSenders = async () => {
      try {
        // Requête pour les shipments acceptés
        const q = query(
          collection(db, "shipments"),
          where("status", "==", "Accepter")
        );
  
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const shipmentsWithSenders = await Promise.all(
            snapshot.docs.map(async (shipmentDoc) => {
              const shipmentData = shipmentDoc.data();
              
              // Récupérer les infos de l'expéditeur
              let senderInfo = {};
              if (shipmentData.expediteurId) {
                try {
                  const senderRef = doc(db, "users", shipmentData.expediteurId);
                  const senderDoc = await getDoc(senderRef);
                  
                  if (senderDoc.exists()) {
                    senderInfo = senderDoc.data();
                  }
                } catch (error) {
                  console.error("Erreur lors de la récupération de l'expéditeur:", error);
                }
              }
  
              return {
                id: shipmentDoc.id,
                ...shipmentData,
                senderInfo
              };
            })
          );
  
          setShipmentss(shipmentsWithSenders);
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error("Erreur lors de la récupération des shipments:", error);
      }finally{
        setLoading(false)
      }
    };
  
    fetchShipmentsWithSenders();
  }, []);
  const [showEnlevement, setShowEnlevement] = useState(false);
  const [showDechargement, setShowDechargement] = useState(false);
  
  // Appliquer le filtre
  const filteredShipments = shipmentss.filter((shipment) => {
    const matchEnlevement = showEnlevement ? shipment.enlevement === true : true;
    const matchDechargement = showDechargement ? shipment.dechargement === true : true;
    return matchEnlevement && matchDechargement;
  });
  


  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) return;
      
      try {
        // Récupérer les informations de l'utilisateur connecté
        const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
        const currentUserData = currentUserDoc.data();
        setCurrentUser(currentUserData);

        const usersRef = collection(db, "users");
        let usersQuery;

        if (currentUserData?.role === "expediteur") {
          // Pour les expéditeurs, filtrer par rôle transporteur
          usersQuery = query(usersRef, where("role", "==", "transporteur"));
        } else {
          // Pour les transporteurs, filtrer par rôle expéditeur
          usersQuery = query(usersRef, where("role", "==", "expediteur"));
        }

        const unsubscribe = onSnapshot(usersQuery, async (snapshot) => {
          const usersList = await Promise.all(
            snapshot.docs
              .filter(doc => doc.id !== currentUserId)
              .map(async (doc) => {
                const user = {
                  id: doc.id,
                  ...doc.data(),
                  unreadCount: 0,
                } as User;

                // Compter les messages non lus
                const unreadQuery = query(
                  collection(db, "messages"),
                  where("receiver", "==", currentUserId),
                  where("sender", "==", doc.id),
                  where("isRead", "==", false)
                );

                const unreadSnapshot = await getDocs(unreadQuery);
                user.unreadCount = unreadSnapshot.size;

                return user;
              })
          );

          setUsers(usersList);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, [currentUserId]);




  const handleChatClick = (shipmentId: string) => {
    router.push(`/chat/${shipmentId}`);
  };

 

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4 space-x-4   mt-12">
      {/* Filtres booléens */}
<div className="flex gap-4 items-center mb-6 ml-4">
  <label className="flex items-center space-x-2 text-sm">
    <input
      type="checkbox"
      checked={showEnlevement}
      onChange={() => setShowEnlevement(!showEnlevement)}
      className="rounded border-gray-300 focus:ring-green-500"
    />
    <span className="text-xl">Afficher les enlèvements</span>
  </label>

  <label className="flex items-center space-x-2 text-sm">
    <input
      type="checkbox"
      checked={showDechargement}
      onChange={() => setShowDechargement(!showDechargement)}
      className="rounded border-gray-300 focus:ring-green-500"
    />
    <span className="text-xl">Afficher les déchargements</span>
  </label>
</div>

  <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
    {currentUser?.role === "expediteur" ? "Mes Colis" : "Mes Transports"}
  </h4>
  
  {loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      <span className="ml-4 text-gray-600">Chargement en cours...</span>
    </div>
  ) : error ? (
    <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
  ) : (
    <div className="space-y-6">
      {/* Section Shipments pour les expéditeurs - 3 par ligne sur grand écran */}
      {currentUser?.role === "expediteur" && (
        <div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-600 mb-2 flex items-center justify-center gap-2">
              <FiPackage className="text-green-500" /> 
              Vos Colis Actifs
            </h1>
            <p className="text-gray-500">Gérez vos envois et discussions</p>
          </div>

          
          {shipments.length === 0 ?(
  <div className="p-6 bg-gray-100 text-gray-700 rounded-lg text-center flex flex-col items-center space-y-3">
    <FiPackage className="text-green-600 text-4xl" />
    <p>Aucun colis actif trouvé.</p>
  </div>



          // {shipments.length === 0 ? (
          //   <div className="p-4 bg-gray-100 text-gray-700 rounded-lg text-center">
          //     Aucun colis actif trouvé.
          //   </div>

          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-green-300 h-full"
                  onClick={() => handleChatClick(shipment.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <FiBox className="text-green-600 text-lg" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-800 capitalize line-clamp-1">
                        {shipment.objectName}
                      </span>
                      <p className="text-xs text-gray-500">
                        {shipment.createdAt?.toDate
                          ? shipment.createdAt.toDate().toLocaleString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Date inconnue"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {shipment.pickupAddress && (
                        <span className="line-clamp-1">
                          <FaMapMarkerAlt className="inline mr-1 text-red-400" />
                          {shipment.pickupAddress.split(',')[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {shipment.messageCount > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {shipment.messageCount}
                        </span>
                      )}
                      <FiMessageSquare className="text-green-500 text-lg hover:text-green-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section Transporteurs - 2 par ligne sur grand écran */}
      {currentUser?.role === "transporteur" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredShipments.map((shipment) => (
            <div 
              key={shipment.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-green-200 transition-all duration-300 h-full"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start">
                  <div className="bg-green-50 p-3 rounded-lg mr-4">
                    <FaBoxOpen className="text-green-600 text-2xl" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="mr-2 line-clamp-1">{shipment.objectName || "Colis sans nom"}</span>
                      {shipment.status =="Accepter" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs mr-2 font-medium bg-green-100 text-green-800 ml-2">
                          <MdDoneAll className="mr-1" /> Accepter
                            {shipment.enlevement && <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800 ml-2">
                          <MdDoneAll className="mr-1" /> Enlèvement effectué

                        </span> }
                        {shipment.dechargement && <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800 ml-2">
                          <MdDoneAll className="mr-1" /> Déchargement effectué

                        </span> }
                          
                        </span>
                      // ) : shipment.enlevementEffectue ? (
                      //   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                      //     <MdDirectionsBike className="mr-1" /> En cours
                      //   </span>
                      // ) : (
                      //   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                      //     En attente
                      //   </span>
                      )}
                    </h3>
                    
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <div className="flex items-start">
                        <FaCalendarAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Date de départ</p>
                          <p className="font-medium text-sm">
                          {shipment.pickupDate && shipment.pickupDate.toDate
                                ? shipment.pickupDate.toDate().toLocaleString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "Date invalide"}
                            
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaCalendarAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Date de livraison</p>
                          <p className="font-medium text-sm">
                          {shipment.deliveryDate && shipment.deliveryDate.toDate
                                ? shipment.deliveryDate.toDate().toLocaleString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "Date invalide"}
                            </p>
                          
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Adresse de départ</p>
                          <p className="font-medium text-sm line-clamp-1">
                            {shipment.pickupAddress}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Adresse de livraison</p>
                          <p className="font-medium text-sm line-clamp-1">
                            {shipment.deliveryAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notification des dates atteintes */}
                    {checkDueDates(shipment)}
                  </div>
                </div>
                
                <div className="mt-auto pt-4">
                  {/* {(!shipment.enlevement || !shipment.dechargement) && ( */}
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      {/* {shipment.enlevement && ( */}
                        <button
                          onClick={() => openModal('enlevement', shipment)}
                          className={`inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                            focus:ring-green-500 flex-1 ${shipment.enlevement ? 'opacity-50 cursor-not-allowed' : ''} `}
                          disabled={shipment.enlevement}
                       >
                          <FaTruck className="mr-2" />
                          <span className="text-xs sm:text-sm">Enlèvement effectué</span>
                        </button>
                      {/* )} */}
                      
                      <button
                        onClick={() => openModal('dechargement', shipment)}
                        className={`inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex-1 ${
                          !shipment.enlevement || shipment.dechargement ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={!shipment.enlevement || shipment.dechargement}
                      >
                        <FaCheck className="mr-2" />
                        <span className="text-xs sm:text-sm">Déchargement effectué</span>
                      </button>
                    </div>
                  {/* )} */}
                </div>
              </div>
            </div>
          ))}

          
        </div>
      )}

{filteredShipments.length === 0 && (
  <div className="p-6 bg-gray-100 text-gray-700 rounded-lgflex justify-center items-center h-64text-center flex flex-col items-center space-y-3">
    <FiPackage className="text-green-600 text-4xl" />
    <p>Aucun colis actif trouvé.</p>
  </div>
)}
    </div>
  )}
      





{showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {!actionConfirmed ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {currentAction === 'enlevement' 
                    ? "Confirmer l'enlèvement du colis ?" 
                    : "Confirmer le déchargement du colis ?"}
                </h3>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaEnvelope className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Un email sera envoyé au client pour notification
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmAction}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Confirmer
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <FaCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">
                  {currentAction === 'enlevement' 
                    ? "Enlèvement confirmé !" 
                    : "Déchargement confirmé !"}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    {currentAction === 'enlevement'
                      ? "Le client a été notifié par email."
                      : "La livraison est maintenant complète."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatCard;



