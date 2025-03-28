"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {  useSearchParams } from 'next/navigation';
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "../../../../lib/firebaseConfig";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDoc} from "firebase/firestore";
import { AuthContext } from "../../../../context/AuthContext";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Avatar } from "@/components/Avartar";
import { Box } from "@/components/Box";
import { FaBox, FaCalendarCheck, FaCalendarAlt,FaMapMarkerAlt, FaMoneyBillWave, FaSortNumericUp, FaSpinner, FaWeightHanging, FaRulerCombined, FaTruckPickup, FaImage } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getMessaging, getToken} from "firebase/messaging";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";
import { FaCheckCircle } from 'react-icons/fa';
import Image from "next/image";
// Ajoutez aussi l'interface Message
interface Message {
  id: string;
  message: string;
  sender: string;
  receiver: string;
  timestamp: any;
  isRead: boolean;
  senderName: string;
  avatar?: string;
}
interface PageProps {
  params: {
    id: string;
    shipmentid:string // Explicitly type as string
  };
}


// Ajoutez cette interface
interface Shipment {
  id: string;
  expediteurId: string;
  pickupAddress: string;
  deliveryAddress: string;
  objectName: string;
  price: number;
  quantity: number;
  pickupDate: any;
  deliveryDate: any;
  weight: number;
  size: string;
  pickupType: string;
  status: 'En attente' | 'accepted' | 'completed';
  find:any
}


      // const shipmentsRef = collection(db, "shipments");
export default function ChatRoom({ params}) {
  // ... autres états
  const searchParams = useSearchParams();
  const isFromOffer = searchParams.get('offer') === 'true';
  const isTransporter = searchParams.get('isTransporteur') === 'true';
  const sh = searchParams.get('shs') ;
const { id} = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null);
const [isUploading, setIsUploading] = useState(false);
const [user ,setUser] = useState(null)
const [isvalid ,setValid] =useState(false)
const [currentShipment, setCurrentShipment] = useState<Shipment | null>(null);
  const [otherShipments, setOtherShipments] = useState<Shipment[]>([]);
console.log("ortheShipment" ,otherShipments)
console.log("currentShipment" , currentShipment)
console.log("chatPartner user" ,chatPartner)
const uid = auth?.currentUser?.uid;

console.log("id de url " ,id ,"shipmentid" ,sh)
  // Ajoutez cet useEffect pour charger les colis
  // useEffect(() => {
  //   if (!id) return;

  //   const fetchShipments = async () => {
  //     const shipmentsRef = collection(db, "shipments");
    
  //   let q;

  //   if (isTransporter) { 
  //     // Si l'utilisateur est le transporteur, récupérer tous les colis disponibles
  //     q = query(shipmentsRef, where("status", "in", ["En attente", "accepted"]));
  //   } else {
  //     // Sinon, récupérer seulement les colis de l'expéditeur connecté
  //     if (shipmentid) {
  //       q = query(shipmentsRef, where("shipmentId", "==", shipmentid));
  //     } else {
  //       q = query(shipmentsRef, where("expediteurId", "==", id));
  //     }
  //   }
  //     onSnapshot(q, (snapshot) => {
  //       const shipments = snapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       })) as Shipment[];

  //     const  shipmentss = shipments.filter(s => s.price !== 0);
  //       // // Séparer le colis actuel des autres colis
  //       // const current = shipments.find(s => s.status === 'En attente' || s.status === "accepted");
  //       // const others = shipments.filter(s => s.status === 'En attente' && s.shipmentId !== current?.id);
  //       const current = shipmentss[0]; // Assuming the first shipment is the current one
  //       const others = shipmentss.slice(1)
  //       setCurrentShipment(current || null);
  //       setOtherShipments(others);
  //     });
  //     // return () => unsubscribe();
  //   };

  //   fetchShipments();
  // }, [id ,isTransporter]);
  useEffect(() => {
    if (!id) return;
  
    const fetchShipments = async () => {
      const shipmentsRef = collection(db, "shipments");
      console.log("shipmentRef" ,shipmentsRef)
      let q;
  if (sh) {
    // Si on a un shipmentId, on récupère uniquement ce colis spécifique
    q = query(shipmentsRef, where("shimentId", "==", sh));
  } else if (isTransporter) {
    // Si c'est un transporteur, récupérer les colis disponibles
    q = query(shipmentsRef, where("status", "in", ["En attente", "accepted"]));
  } else {
    // Pour l'expéditeur, récupérer ses colis
    q = query(shipmentsRef, where("expediteurId", "==", id));
  }

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const shipments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Shipment[];

    const filteredShipments = shipments.filter(s => s.price !== 0);
    
    if (sh) {
      // Si on a un shipmentId, le colis correspondant devient le current
      const targetShipment = filteredShipments.find(s => s.id === sh);
      setCurrentShipment(targetShipment || null);
      setOtherShipments(filteredShipments.filter(s => s.id !== sh));
    } else {
      // Sinon, comportement par défaut
      const current = filteredShipments[0];
      const others = filteredShipments.slice(1);
      setCurrentShipment(current || null);
      setOtherShipments(others);
    }
  });

  return () => unsubscribe();
};

fetchShipments();
}, [id, isTransporter, sh]);
  const getUserData = async (uid) => {
    try {
      // Crée une référence au document de l'utilisateur dans la collection 'users'
      const userRef = doc(db, 'users', uid);
      
      // Récupère le document
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // Retourne les données si l'utilisateur existe
        const userData = userSnap.data();
        console.log('Données utilisateur:', userData);
        return userData;
      } else {
        console.log('Aucun utilisateur trouvé avec cet UID');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw error;
    }
  };

  useEffect(()=>{
    const fetchUser = async () => {
      if (!uid) return;
      
      const userData = await getUserData(uid);
      if (userData) {
        // Utilise les données ici
        setUser(userData)
      }
    };
  fetchUser()
  } ,[uid])
  
  // const { user} = useContext(AuthContext);

  const sendEmailNotification = async (shipmentId: string, type: string) => {
  
    try {
    
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: chatPartner.email, // Utilisation de l'email récupéré
          shipment: { objectName: currentShipment.objectName },
          type,
          chatId: id,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error("Erreur lors de l'envoi de l'email :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };
  


//   const sendPushNotification = async (shipmentId: string, type: string) => {
//     const shipment = currentShipment || otherShipments.find(s => s.id === shipmentId);
//     if (!shipment) return;

// const userRef = doc(db, "users", id);
// const userDoc = await getDoc(userRef);
//     // const userDoc = await getDoc(doc(db, "users", id));
//     const fcmToken = userDoc.data()?.fcmToken;

//     await fetch('/api/send-notification', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         userId: id,
//         title: type === "acceptance" ? "Offre acceptée" : "Nouveau message",
//         body: `Colis: ${shipment.objectName}`,
//         type: type,
//         fcmToken: fcmToken,
//         data: {
//           shipmentId: shipmentId,
//           chatId: id
//         }
//       })
//     });
//   };

  // Fonction pour accepter une offre
  const handleAcceptShipment = async (shipmentId: string) => {
    try {
      await updateDoc(doc(db, "shipments", shipmentId), {
        status: 'accepted',
        transporteurId: uid
      });
      toast.success("Offre acceptée avec succès!");
      sendEmailNotification(shipmentId, "acceptance");
      // sendPushNotification(shipmentId, "acceptance");
    } catch (error) {
      toast.error("Erreur lors de l'acceptation de l'offre");
    }
  };

  // useEffect(() => {
  //   if (!id) return;
  //   const fetchMessages = async () => {
  //     const messagesRef = collection(db, "messages");

  //     // Requête pour les messages où l'utilisateur actuel est un participant
  //     const q = query(messagesRef, where("users", "array-contains", uid));

  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       const messages = [];
  //       querySnapshot.forEach((doc) => {
  //         const data = doc.data();


  //         // Vérifier que `users` existe et est un tableau
  //         if (data.users && Array.isArray(data.users) && data.users.includes(id)) {
  //           messages.push({ id: doc.id, ...data });
  //         }
  //       });

  //       // Trier les messages par timestamp (du plus ancien au plus récent)
  //       messages.sort((a, b) => a.timestamp - b.timestamp);

  //       // Mettre à jour l'état `messages`
  //       setMessages(messages);
  //     });

  //     return unsubscribe;
  //   };

  //   fetchMessages();
  // }, [uid, id]);

  // useEffect(() => {
  //   if (!id) return;
    
  //   const fetchMessagesAndUsers = async () => {
  //     const messagesRef = collection(db, "messages");
  //     const usersRef = collection(db, "users");
  
  //     const q = query(messagesRef, where("users", "array-contains", uid));
  
  //     const unsubscribe = onSnapshot(q, async (querySnapshot) => {
  //       const messagesPromises = querySnapshot.docs.map(async (doc) => {
  //         const data = doc.data();
          
  //         if (!(data.users && Array.isArray(data.users) && data.users.includes(id))) {
  //           return null;
  //         }
  //  console.log("data de user receiver" ,data)
  //         // Récupérer les infos de l'utilisateur (receiver)
  //         let userData = null;
  //         try {
  //           // const userDoc = await getDoc(doc(usersRef, data.receiver));
  //           const userDoc = await getDoc(doc(db, "users", data.receiver));
  //           console.log("userDoc apres receiver" ,userDoc)
  //           if (userDoc.exists()) {
  //             userData = userDoc.data();
  //           }
  //         } catch (error) {
  //           console.error("Error fetching user data:", error);
  //         }
  
  //         return {
  //           id: doc.id,
  //           ...data,
  //           userInfo: userData
  //         };
  //       });
  
  //       // Attendre que toutes les promesses soient résolues
  //       const messages = (await Promise.all(messagesPromises)).filter(Boolean);
        
  //       // Trier les messages
  //       messages.sort((a, b) => a.timestamp - b.timestamp);
  //       setMessages(messages);
  //     });
  
  //     return unsubscribe;
  //   };
  
  //   fetchMessagesAndUsers();
  // }, [uid, id]);


  // useEffect(() => {
  //   if (!id || !currentShipment) return;
    
  //   const fetchMessagesAndUsers = async () => {
  //     const messagesRef = collection(db, "messages");
  //     const q = query(
  //       messagesRef,
  //       where("shipmentId", "==", shipmentid ?? currentShipment?.id),
  //       where("users", "array-contains", uid)
  //     );
  
  //     const unsubscribe = onSnapshot(q, async (querySnapshot) => {
  //       const messagesPromises = querySnapshot.docs.map(async (doc) => {
  //         const data = doc.data();
  //         let userData = null;
  //         try {
  //           // const userDoc = await getDoc(doc(db, "users", data?.sender));
  //           console.log("sender data" ,data);
            
  //           const userRef = doc(db, "users", data?.sender); // ✅ Crée une référence
  //   const userDoc = await getDoc(userRef); 
  //           if (userDoc.exists()) {
  //             userData = userDoc.data();
  //           }
  //         } catch (error) {
  //           console.error("Error fetching user data:", error);
  //         }
  
  //         return {
  //           id: doc.id,
  //           ...data,
  //           userInfo: userData
  //         };
  //       });
  
  //       const messages = (await Promise.all(messagesPromises)).filter(Boolean);
  //       messages.sort((a, b) => a.timestamp - b.timestamp);
  //       setMessages(messages);
  //     });
  
  //     return unsubscribe;
  //   };
  
  //   fetchMessagesAndUsers();
  // }, [uid]);

  useEffect(() => {
    if (!id || !currentShipment?.id) return;
    
    const fetchMessagesAndUsers = async () => {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("shipmentId", "==", currentShipment.id),
        where("users", "array-contains", uid)
      );
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const messagesPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          let userData = null;
          try {
            const userRef = doc(db, "users", data?.sender);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              userData = userDoc.data();
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
  
          return {
            id: doc.id,
            ...data,
            userInfo: userData,
            // timestamp: data.timestamp?.toDate() // Conversion du timestamp
          };
        });
  
        const messages = (await Promise.all(messagesPromises)).filter(Boolean);
        messages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messages);
      });
  
      return () => unsubscribe();
    };
  
    fetchMessagesAndUsers();
  }, [uid, id, currentShipment?.id]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!id) return;
      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          setChatPartner(userDoc.data());
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
      }
    };
  
    fetchUserInfo();
  }, [id]);
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const messaging = getMessaging();
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: 'VOTRE_VAPID_KEY' // Ajoutez votre clé VAPID
          });
          
          // Sauvegarder le token dans Firestore pour l'utilisateur
          if (token && auth.currentUser) {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              fcmToken: token
            });
          }
        }
      } catch (error) {
        console.error("Erreur d'initialisation des notifications:", error);
      }
    };
  
    initializeNotifications();
  }, []);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     // Envoyer le message
//     const messageRef = await addDoc(collection(db, "messages"), {
//       message: newMessage,
//       sender: auth.currentUser?.uid,
//       receiver: id,
//       shipmentId:currentShipment.id,
//       isRead: false,
//       timestamp: serverTimestamp(),
//       users: [auth.currentUser?.uid, id],
//     });

//     const userDoc = await getDoc(doc(db, "users", id));
// const fcmToken = userDoc.data()?.fcmToken;
    
//     sendEmailNotification(currentShipment?.expediteurId, "Nouveau message");

//     // await fetch('/api/send-notification', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify({
//     //     userId: id,
//     //     title: `Nouveau message de ${user?.firstName}`,
//     //     body: newMessage,
//     //     type: 'new_message',
//     //     fcmToken: fcmToken,
//     //     data: {
//     //       messageId: messageRef.id,
//     //       chatId: id
//     //     }
//     //   })
//     // });

//     setNewMessage("");
//   };


const sendMessage = async () => {
  if (!newMessage.trim() || !currentShipment?.id) return;

  try {
    await addDoc(collection(db, "messages"), {
      message: newMessage,
      sender: auth.currentUser?.uid,
      receiver: id,
      shipmentId: currentShipment.id,
      isRead: false,
      timestamp: serverTimestamp(),
      users: [auth.currentUser?.uid, id],
    });

    setNewMessage("");
    
    // Envoi de la notification email
    if (chatPartner?.email) {
      await sendEmailNotification(currentShipment.id, "Nouveau message");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    toast.error("Erreur lors de l'envoi du message");
  }
};
  const handleShipmentChange = (shipment: Shipment) => {
    setCurrentShipment(shipment);
    const others = otherShipments.filter(s => s.id !== shipment.id);
    setOtherShipments([...others, currentShipment]); // Ajoute l'ancien colis actuel à la liste
  };

  // Fonction pour déterminer si un message est le dernier du groupe
  const isLastMessageOfGroup = (message, index) => {
    return (
      index === messages.length - 1 ||
      messages[index + 1].sender !== message.sender
    );
  };

  // Fonction pour déterminer si un message est le premier du groupe
  const isFirstMessageOfGroup = (message, index) => {
    return index === 0 || messages[index - 1].sender !== message.sender;
  };
// Ajoutez cette fonction pour gérer l'upload d'images
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setIsUploading(true);
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `chat-images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, "messages"), {
      sender: auth.currentUser?.uid,
      receiver: id,
      isRead: false,
      timestamp: serverTimestamp(),
      users: [auth.currentUser?.uid, id],
      type: "image",
      imageUrl: imageUrl
    });
  } catch (error) {
    toast.error("Erreur lors de l'envoi de l'image");
  } finally {
    setIsUploading(false);
  }
};
 console.log("user role" ,user?.role)
  console.log("messages" ,messages)
  return (
    <>

<DefaultLayout>


<div className="flex flex-col h-screen bg-gray-100">

<div className="bg-white shadow-sm p-4">
  <div className="flex items-center justify-between max-w-4xl mx-auto">
    <div className="flex items-center space-x-4">
      <Avatar
        size={10}
        src={chatPartner?.photoURL}
        name={`${chatPartner?.firstName} ${chatPartner?.lastName}`}
      />
      <div>
        <h2 className="font-semibold">
          {chatPartner ? `${chatPartner.firstName} ${chatPartner.lastName} / ${chatPartner.phoneNumber}` : 'Chargement...'}
        </h2>
        <p className="text-sm text-gray-500">
          {messages.some(m => !m.isRead) ? 'En ligne' : 'Hors ligne'}
        </p>
      </div>
    </div>
    <div>
     <Link href="/Dashboard"> <AiOutlineArrowLeft  className="text-2xl"/></Link>
      </div>
</div>
</div>
      


{/* 
{currentShipment && user?.role=="transporteur" && (
          <div className="bg-white p-4 m-4 rounded-lg shadow flex flex-col space-y-3">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaBox className="mr-2" /> Colis à expédier
            </h3>
            <div className="flex flex-wrap gap-4">
              <p className="flex items-center">
                <FaBox className="mr-2" /> Objet: {currentShipment.objectName}
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" /> Adresse de retrait: {currentShipment.pickupAddress}
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" /> Adresse de livraison: {currentShipment.deliveryAddress}
              </p>
              <p>Prix: {currentShipment.price}€</p>
              <p>Quantité: {currentShipment.quantity}</p>
              <p>Date de retrait:  {currentShipment.pickupDate && currentShipment.pickupDate .toDate
                            ? currentShipment.pickupDate.toDate().toLocaleString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Date invalide"}</p>
              <p>Date de livraison:  {currentShipment.pickupDate && currentShipment.pickupDate .toDate
                            ? currentShipment.pickupDate.toDate().toLocaleString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Date invalide"}</p>
              <p>Poids: {currentShipment.weight} kg</p>
              <p>Taille: {currentShipment.size}</p>
              <p>Type d'enlèvement: {currentShipment.pickupType}</p>
            </div>
            {currentShipment.status === 'En attente' && (
              <button
                onClick={() => handleAcceptShipment(currentShipment.id)}
                className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Accepter l'offre de transport
              </button>
            )}
          </div>
        )} */}


{currentShipment && (
  <div className="bg-white p-2 m-2 rounded-lg shadow flex flex-col space-y-2">
    <h3 className="text-sm font-semibold mb-2 flex items-center">
      <FaBox className="mr-1" /> Colis à expédier
    </h3>
    {currentShipment.status === 'accepted' && (
      <div className="flex items-center text-green-500 text-xs">
        <FaCheckCircle className="mr-1" />
        <span>Offre acceptée</span>
      </div>
    )}

    {/* Bloc 1: Informations de base */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b pb-1">
      <p className="flex items-center text-xs">
        <FaBox className="mr-1" /> Objet : {currentShipment.objectName}
      </p>
      <p className="flex items-center text-xs">
        <FaMoneyBillWave className="mr-1" /> Prix : {currentShipment.price}€
      </p>
      <p className="flex items-center text-xs">
        <FaSortNumericUp className="mr-1" /> Quantité : {currentShipment.quantity}
      </p>
    </div>

    {/* Bloc 2: Adresses */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b pb-2">
      <p className="flex items-center text-xs">
        <FaMapMarkerAlt className="mr-1" /> Retrait : {currentShipment.pickupAddress}
      </p>
      <p className="flex items-center text-xs">
        <FaMapMarkerAlt className="mr-1" /> Livraison : {currentShipment.deliveryAddress}
      </p>
    </div>

    {/* Bloc 3: Dates */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b pb-2">
      <p className="flex items-center text-xs">
        <FaCalendarAlt className="mr-1" /> Date retrait :{" "}
        {currentShipment.pickupDate && currentShipment.pickupDate.toDate
          ? currentShipment.pickupDate.toDate().toLocaleString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Date invalide"}
      </p>
      <p className="flex items-center text-xs">
        <FaCalendarCheck className="mr-1" /> Date livraison :{" "}
        {currentShipment.pickupDate && currentShipment.pickupDate.toDate
          ? currentShipment.pickupDate.toDate().toLocaleString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Date invalide"}
      </p>
    </div>

    {/* Bloc 4: Caractéristiques physiques */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <p className="flex items-center text-xs">
        <FaWeightHanging className="mr-1" /> Poids : {currentShipment.weight} kg
      </p>
      <p className="flex items-center text-xs">
        <FaRulerCombined className="mr-1" /> Taille : {currentShipment.size}
      </p>
      <p className="flex items-center text-xs">
        <FaTruckPickup className="mr-1" /> Type retrait : {currentShipment.pickupType}
      </p>
    </div>

    {/* Bouton d'action */}
    {currentShipment.status === "En attente" && user?.role === "transporteur" && (
      <button
        onClick={() => handleAcceptShipment(currentShipment.id)}
        className="w-full mt-2 bg-green-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-green-600"
      >
        Accepter l&apos;offre de transport
      </button>
    )}
  </div>
)}

 <div className="flex flex-col h-screen p-4 bg-gray-100">
 <div className="flex-1 overflow-y-autoo space-y-2 max-w-2xl mx-auto w-full">
   {messages.map((msg, i) => {
     const isLast = isLastMessageOfGroup(msg, i);
     const isFirst = isFirstMessageOfGroup(msg, i);
     const isSentByMe = msg.sender === uid;
// // Étendre dayjs avec le plugin relativeTime
dayjs.extend(relativeTime);
return (
      <div
        key={msg.id}
        className={clsx(
          "flex items-end gap-2",
          isSentByMe ? "justify-end" : "justify-start"
        )}
      >
        {!isSentByMe && isLast && (
          <div className="size-8">
            <Avatar
              size={8}
              src={msg.avatar}
              name={`${chatPartner?.firstName} ${chatPartner?.lastName}`}
              initialColor="auto"
            />
          </div>
        )}

        <Box
          className={clsx(
            isSentByMe
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800",
            isLast && !isFirst && (isSentByMe ? "rounded-tr-lg" : "rounded-tl-lg"),
            isFirst && !isLast && (isSentByMe ? "rounded-br-lg" : "rounded-bl-lg"),
            !isFirst && !isLast && (isSentByMe ? "rounded-r-lg" : "rounded-l-lg"),
            "p-3 max-w-[70%]"
          )}
        >
          
        
          {msg.type === "image" ? (
    <div className="relative">
     <Link href={msg.imageUrl} passHref legacyBehavior>
  <a target="_blank" rel="noopener noreferrer">
    <Image
      src={msg.imageUrl}
      width={100}
      height={100}
      alt="Image partagée"
      className="rounded-lg max-w-full cursor-pointer hover:opacity-90"
    />
  </a>
</Link>
      
    </div>
  ) : msg.offerDetails ? (
    <div className="space-y-2">
    <div className="font-semibold text-lg">📦 Nouvelle offre de transport</div>
    <div className="space-y-1">
      <p>💰 Prix proposé: {msg.offerDetails.price}€</p>
      <p>📅 Date de début: {msg.offerDetails.startDate}</p>
      {msg.offerDetails.endDate && (
        <p>📅 Date de fin: {msg.offerDetails.endDate}</p>
      )}
      <p className="mt-2">📝 Informations supplémentaires:</p>
      <p className="text-sm">{msg.offerDetails.additionalInfo}</p>
    </div>
    {!isSentByMe && !msg.isRead && (
<div className="mt-3 flex items-center gap-2">
        <input
          type="checkbox"
          id={`validate-${msg.id}`}
          onChange={async () => {
            try {
              await updateDoc(doc(db, "messages", msg.id), {
                isRead: true
              });
              await fetch("/api/send-mail", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: chatPartner.email, // Utilisation de l'email récupéré
                  shipment: { objectName: currentShipment.objectName },
                  type:"acceptance",
                  chatId: id,
                }),
              });
              toast.success("Offre validée avec succès!");
            } catch (error) {
              toast.error("Erreur lors de la validation de l'offre");
            }
          }}
          className="form-checkbox h-4 w-4 text-green-600"
        />
        <label htmlFor={`validate-${msg.id}`} className="text-sm">
          Valider cette offre
        </label>
      </div>
    )}
     {/* {currentShipment.status === 'accepted' && (
        <div className="flex items-center text-green-500">
          <FaCheckCircle className="mr-1" />
          <span>Offre acceptée</span>
        </div>
      )} */}
  </div>
    // ... code existant pour les offres ...
  ) : (
    <p>{msg.message}</p> // ... code existant pour les messages normaux ...
  )}
 <p className="text-xs text-gray-500 mt-1">
            {dayjs(msg.timestamp?.toDate()).fromNow()}
          </p>
        </Box>





        {isSentByMe && isLast && (
          <div className="size-8">
            <Avatar
              size={8}
              src={user?.photoURL}
              name={user?.firstName}
              initialColor="auto"
            />
          </div>
        )}
      </div>
    );
  })}

<div className="flex gap-2 p-4 bg-white max-w-2xl mx-auto w-full">
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Écrivez votre message..."
    className="flex-1 p-2 border border-gray-300 rounded-lg"
  />
  <label className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
    {isUploading ? (
      <FaSpinner className="animate-spin" />
    ) : (
      <FaImage />
    )}
  </label>
  <button
    onClick={sendMessage}
    disabled={isUploading}
    className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-300"
  >
    Envoyer
  </button>
</div>

 </div>

 {/* Liste des autres colis */}
 {otherShipments.length > 0 ? (
  <div className="bg-white p-4 m-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Autres colis à expédier</h3>
    <div className="space-y-4">
      {otherShipments.map((shipment) => (
        // <div 
        //   key={shipment.id} 
        //   className="border p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
        //   onClick={() => handleShipmentChange(shipment)}
        // >
          <div 
  key={shipment.id} 
  className={`border p-3 rounded-lg hover:bg-gray-50 cursor-pointer 
    ${shipment.id == currentShipment?.id ? 'border-blue-500 bg-blue-100' : ''}`}
  onClick={() => handleShipmentChange(shipment)}
>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-green-600 hover:underline">
                {shipment.objectName}
              </p>
              <p className="text-sm text-gray-500">
                {shipment.pickupAddress} → {shipment.deliveryAddress}
              </p>
              <p>Prix: {shipment.price}€</p>
            </div>
            {shipment?.status === 'En attente' && user?.role === "transporteur" && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Empêche le déclenchement du onClick du parent
                  handleAcceptShipment(shipment.id);
                }}
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
              >
                Accepter
              </button>
            )}
          </div>
        </div>
      ))}
       </div>
  </div>
) : (
  <div className="bg-white p-4 m-4 rounded-lg shadow">
    <p className="text-center text-gray-500">Aucun autre colis à expédier.</p>
  </div>
)}
 </div>
</div>



      </DefaultLayout>

    </>
  );
};





