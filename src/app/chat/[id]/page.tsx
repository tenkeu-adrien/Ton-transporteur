"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import {  useSearchParams } from 'next/navigation';
import { toast } from "react-toastify";
import {useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth,  app } from "../../../../lib/firebaseConfig";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDoc, getDocs, limit, orderBy} from "firebase/firestore";
// import { AuthContext } from "../../../../context/AuthContext";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";

import { Avatar } from "@/components/Avartar";
import { FaBox, FaCalendarCheck, FaCalendarAlt,FaMapMarkerAlt, FaMoneyBillWave, FaSortNumericUp, FaSpinner, FaWeightHanging, FaRulerCombined, FaTruckPickup, FaImage, FaTimes, FaCheck, FaHashtag } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";
import { FaCheckCircle } from 'react-icons/fa';
import Image from "next/image";
import { updateShipmentStatus } from "../../../../lib/functions";
import { MdCancel, MdMessage } from "react-icons/md";
import { useRef, useCallback } from 'react';
import { FiPackage } from "react-icons/fi";
import { AuthContext } from "../../../../context/AuthContext";
// Ajoutez aussi l'interface Message
interface Message {
  id: string;
  message: string;
  sender: string;
  receiver: string;
  timestamp: any;
  isRead: boolean;
  expediteurId:string,
  shipmentId:string,
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
const useMessageObserver = (onIntersect) => {
  const observer = useRef(null);

  return useCallback(node => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        onIntersect();
      }
    });

    if (node) observer.current.observe(node);
  }, [onIntersect]);
};
      // const shipmentsRef = collection(db, "shipments");
export default function ChatRoom({ params}) {
  // ... autres états
  // const searchParams = useSearchParams();
  // const sh = searchParams.get('shs') ;
  // const shipmentId = searchParams.get('shipmentId'); // Ajout pour le cas d'initialisation par le transporteur
  const { id: shipmentId } = useParams(); // id est maintenant expediteurId
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null);
const [isUploading, setIsUploading] = useState(false);
 const router =useRouter()
// const [user ,setUser] = useState(null)
// const [isvalid ,setValid] =useState(false)
const [isModalOpen, setIsModalOpen] = useState(false);
const [cancelReason, setCancelReason] = useState("");
const [currentShipment, setCurrentShipment] = useState(null);
  const [otherShipments, setOtherShipments] = useState([]);
  const [transporteur, setTransporteur] = useState(null);
const {userData ,user} = useContext(AuthContext)
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);
  const messagesEndRef = useRef(null);
// const typingTimeoutRef = useRef(null);

// const [isTyping, setIsTyping] = useState(false);

// // console.log("messages" , messages)
// console.log("currentShipment" , currentShipment)
// console.log("otherShipment" ,otherShipments)
// console.log("user" ,user)
// console.log("chatPartner user" ,chatPartner)
const uid = auth?.currentUser?.uid;




  // const getUserData = async (uid) => {
  //   try {
  //     // Crée une référence au document de l'utilisateur dans la collection 'users'
  //     const userRef = doc(db, 'users', uid);
      
  //     // Récupère le document
  //     const userSnap = await getDoc(userRef);
      
  //     if (userSnap.exists()) {
  //       // Retourne les données si l'utilisateur existe
  //       const userData = userSnap.data();
  //       // console.log('Données utilisateur:', userData);
  //       return userData;
  //     } else {
  //       console.log('Aucun utilisateur trouvé avec cet UID');
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des données:', error);
  //     throw error;
  //   }
  // };

  // useEffect(()=>{
  //   const fetchUser = async () => {
  //     if (!uid) return;
      
  //     const userData = await getUserData(uid);
  //     if (userData) {
  //       // Utilise les données ici
  //       setUser(userData)
  //     }
  //   };
  // fetchUser()
  // } ,[uid])
  



  useEffect( () => {

    const fetchTransporteur = async () => {
      const q = query(
        collection(db, "users"),
        where("role", "==", "transporteur"), // Filtre par rôle
        limit(1) // Vous n'en avez qu'un
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setTransporteur({ id: doc.id, ...doc.data() });
        setChatPartner({ id: doc.id, ...doc.data() })
      }
    };
  
    fetchTransporteur();
  }, []);

    const sendEmailNotification = async (shipmentId: string, type: string) => 

    {
  
    try {
    
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: chatPartner?.email ?? transporteur?.email, // Utilisation de l'email récupéré
          shipment: { objectName: currentShipment.objectName ,id:currentShipment.id },
          type,
          chatId: shipmentId,
          user:{firstName:userData?.firstName  , lastName:userData?.lastName}
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        return {error:data.error}
      }else{
        return data
      }
    } catch (error) {
return {
  error:error
}
    }
  };
  

  const markMessageAsRead = async (messageId) => {
    if (!messageId) return;
    
    try {
      await updateDoc(doc(db, "messages", messageId), {
        isRead: true
      });
    } catch (error) {
      console.error("Erreur lors du marquage du message:", error);
    }
  };

  const getNotificationTitle = (type) => {
    switch(type) {
      case "acceptance":
        return "Offre de transport acceptée";
      case "Annuler":
        return "Offre annulée";
      default:
        return "Nouveau message";
    }
  };
  // Hook personnalisé pour observer les messages
  const messageObserver = useMessageObserver((messageId) => {
    markMessageAsRead(messageId);
  });

  // Fonction pour faire défiler vers le dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

const sendPushNotification =  async (shipmentId: string, type: string ) => {
 let maxRetries = 3 ;  let retryDelay = 1000
    const shipment = currentShipment || otherShipments.find(s => s.id === shipmentId);
    // console.log("nous sommes dans les notifications")
    if (!shipment){
      console.log("probleme avec le shipment")
      return null
    } 
    
    const payload = {
      userId: chatPartner?.id ?? transporteur?.id,
      title: getNotificationTitle(type),
      body: `Colis: ${shipment?.objectName}`,
      type: type,
      data: {
        shipmentId: shipmentId,
        chatId: shipmentId
      }
    };

let attempt =0 ;
let lastError;
    while (attempt < maxRetries) {
      try {
        attempt++;
        
        const response = await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        if (response.ok) {
          console.log('Notification envoyée avec succès');
          return true;
        }
  
        // Si erreur HTTP (4xx/5xx)
        const errorData = await response.json().catch(() => ({}));
        lastError = new Error(errorData.message || `HTTP Error ${response.status}`);
        
        // Si erreur client (4xx), on ne réessaie pas
        if (response.status >= 400 && response.status < 500) {
          break;
        }
  
      } catch (error) {
        lastError = error;
      }
  
      // Délai exponentiel entre les tentatives
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt - 1);
        console.warn(`Tentative ${attempt} échouée. Nouvel essai dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // useEffect(() => {
  //   const setupMessaging = async () => {
  //     try {
  //       // Vérifie si le navigateur supporte Firebase Messaging
  //       const supported = await isSupported();
  //       if (!supported) {
  //         console.warn('Ce navigateur ne supporte pas Firebase Messaging');
  //         return;
  //       }
  //       const messaging = getMessaging(app);
        
  //       onMessage(messaging, (payload) => {
  //         console.log('Message reçu:', payload);
  //         // Afficher une notification ou mettre à jour l'état
  //       });
  //     } catch (error) {
  //       console.error('Erreur de configuration Firebase Messaging:', error);
  //     }
  //   };

  //   setupMessaging();
  // }, []);


  useEffect(() => {
    const setupMessaging = async () => {
      try {
        // Vérifie si le navigateur supporte Firebase Messaging
        const supported = await isSupported();
        if (!supported) {
          console.log("navigateur pas supporter")
          console.warn('Ce navigateur ne supporte pas Firebase Messaging');
          return;
        }
        
        // Demander la permission pour les notifications
        // const permission = await Notification.requestPermission();
        // if (permission !== 'granted') {
        //   console.warn('Permission pour les notifications refusée');
        //   return;
        // }
  
        const messaging = getMessaging(app);
        
        onMessage(messaging, (payload) => {
          console.log('Message reçu:', payload);
          
          // Extraire les données de la notification
          const { title, body, icon } = payload.notification || {};
          
          // Afficher la notification système
          if (title && body) {
            new Notification(title, {
              body,
              icon: icon || '/images/logo/logo.png' // icône par défaut si non fournie
            });
          }
        });
      } catch (error) {
        console.error('Erreur de configuration Firebase Messaging:', error);
      }
    };
  
    setupMessaging();
  }, []);




  // Fonction pour accepter une offre
  // const handleAcceptShipment = async (shipmentId: string) => {
  //   try {
  //     let newStatus="Accepter"
  //     await updateShipmentStatus(shipmentId,newStatus ,user.uid)
  //    await   sendEmailNotification(shipmentId, "acceptance");
  //     await sendPushNotification(shipmentId, "acceptance");
  //   } catch (error) {
  //     throw error
  //   }
  // };
  const handleAcceptShipment = async (shipmentId: string) => {
    try {
      const newStatus = "Accepter";
      
      // D'abord mettre à jour le statut de l'expédition
      let userr ={id:user?.uid ,...userData}
      await updateShipmentStatus(shipmentId, newStatus, userr);
      
      // Ensuite effectuer les autres opérations
      await Promise.all([
        sendEmailNotification(shipmentId, "acceptance"),
        sendPushNotification(shipmentId, "acceptance")
      ]);
      
    } catch (error) {
      throw error;
    }
  };


 


// const handleTyping = () => {
//   setIsTyping(true);
//   if (typingTimeoutRef.current) {
//     clearTimeout(typingTimeoutRef.current);
//   }
//   typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
// };

  useEffect(() => {
    
    if (!currentShipment || !uid) return;
  
    const fetchMessagesAndPartner = async () => {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("shipmentId", "==", currentShipment.id),
        where("users", "array-contains", uid),
        // orderBy("timestamp", "asc") // Ajouter l'ordre explicite
      );
  
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const messages = [];
        let partnerId = null;
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
  
          // Vérification que le message concerne bien l'envoi actuel
          if (data.users && Array.isArray(data.users)) {
            messages.push({ id: doc.id, ...data });
  
            // Trouver l'ID du partenaire (celui qui n'est pas l'utilisateur actuel)
            const otherUser = data.users.find((userId) => userId !== uid);
            if (otherUser) partnerId = otherUser;
          }
        });
  
        // Trier les messages par timestamp
        messages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messages);
   scrollToBottom();
        // Récupérer les infos du partenaire si trouvé
        if (partnerId) {
          const partnerDoc = await getDoc(doc(db, "users", partnerId));
          if (partnerDoc.exists()) {
            setChatPartner({ id: partnerDoc.id, ...partnerDoc.data() });
          }
        } else {
          setChatPartner(null); // Réinitialiser si aucun partenaire trouvé
        }
      });
  
      return unsubscribe;
    };
  
    fetchMessagesAndPartner();
  }, [uid, currentShipment?.id]); // Déclencheur : uid ou ID de l'envoi change
  

const sendMessage = async () => {

  if (!newMessage.trim() || !currentShipment?.id || !transporteur?.id) return;

  // Déterminer dynamiquement sender/receiver
  const isUserExpediteur = uid === currentShipment.expediteurId;
  const receiverId = isUserExpediteur ? transporteur.id : currentShipment.expediteurId;

  // Message temporaire
  const tempMessage = {
    id: Date.now().toString(),
    message: newMessage,
    sender: uid,
    receiver: receiverId,
    shipmentId: currentShipment.id,
    expediteurId: currentShipment.expediteurId,
    transporteurId: transporteur.id,
    timestamp: serverTimestamp(),
    isRead: false,
    users: [uid, receiverId],
    userInfo: userData ,
    pending:true 
  };

  // Optimistic update
  setMessages(prev => [...prev, tempMessage]);
  setNewMessage("");

  try {
    // 1. Envoi principal du message (critique)
    const docRef = await addDoc(collection(db, "messages"), tempMessage);

    // 2. Notifications secondaires (non critiques - exécutées en parallèle)
    if (receiverId !== uid) {
      // Email (gestion d'erreur indépendante)
      if (chatPartner?.email) {
        sendEmailNotification(currentShipment.id, "Nouveau message")
          .then(email => console.log("Email envoyé:", email))
          .catch(emailError => console.error("Erreur email:", emailError));
      }

      setNewMessage("");
      scrollToBottom();
      // Push notification (gestion d'erreur indépendante)
      sendPushNotification(currentShipment.id, "Nouveau message")
        .then(result => console.log("Notification push:", result)
      )
        .catch(pushError => console.error("Erreur push:", pushError));
    }

  } catch (error) {
    console.error("Erreur d'envoi du message:", error);
    // Rollback de l'optimistic update
    setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    // toast.error("Échec de l'envoi du message");
  }
};


  const handleShipmentChange = (shipment: Shipment) => {
    setCurrentShipment(shipment);
    const others = otherShipments.filter(s => s.id !== shipment.id);
    setOtherShipments([...others, currentShipment]); // Ajoute l'ancien colis actuel à la liste
  };
 // 1. Charger le shipment et l'expéditeur associé
//  useEffect(() => {
//   if (!shipmentId) return;

//   const fetchShipmentAndExpeditor = async () => {
//     try {
//       const shipmentRef = doc(db, "shipments", shipmentId);
//       const unsubscribe = onSnapshot(shipmentRef, async (shipmentDoc) => {
//         if (!shipmentDoc.exists()) return;

//         const shipmentData = { id: shipmentDoc.id, ...shipmentDoc.data() };
//         setCurrentShipment(shipmentData);

//         // Récupération des autres shipments de l'expéditeur
//         const shipmentsRef = collection(db, "shipments");
//         const shipmentQuery = query(shipmentsRef, where("expediteurId", "==", shipmentData.expediteurId));

//         const querySnapshot = await getDocs(shipmentQuery);
//         const filteredShipments = querySnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .filter((shipment) => shipment.id !== shipmentId); // Exclure le currentShipment

//         setOtherShipments(filteredShipments);
//       });

//       return () => unsubscribe();
//     } catch (error) {
//       console.error("Erreur lors de la récupération des données:", error);
//     }
//   };

//   fetchShipmentAndExpeditor();
// }, [shipmentId]);         

// useEffect(() => {
//   if (!shipmentId) return;

//   const fetchShipmentAndExpeditor = async () => {
//     try {
//       const shipmentRef = doc(db, "shipments", shipmentId);
//       const unsubscribe = onSnapshot(shipmentRef, async (shipmentDoc) => {
//         if (!shipmentDoc.exists()) return;

//         const shipmentData = { id: shipmentDoc.id, ...shipmentDoc.data() };
//         setCurrentShipment(shipmentData);

//         // Récupération des autres shipments de l'expéditeur
//         const shipmentsRef = collection(db, "shipments");
//         if(userData.role === "transporteur"){
//           const shipmentQuery = query(
//             shipmentsRef, 
//             where("expediteurId", "==", shipmentData.expediteurId),
//             where("status", "!=", "Annuler") // Nouveau filtre pour exclure les annulés
//           );
//         }
        

//         const querySnapshot = await getDocs(shipmentQuery);
//         const filteredShipments = querySnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .filter((shipment) => shipment.id !== shipmentId); // Exclure le currentShipment
//         setOtherShipments(filteredShipments);
//       });

//       return () => unsubscribe();
//     } catch (error) {
//       console.error("Erreur lors de la récupération des données:", error);
//     }
//   };

//   fetchShipmentAndExpeditor();
// }, [shipmentId]);

// useEffect(() => {
//   if (!shipmentId) return;

//   let unsubscribeShipment = () => {};
//   let unsubscribeOtherShipments = () => {};

//   const fetchShipmentAndExpeditor = async () => {
//     try {
//       // Écoute en temps réel du document shipment principal
//       const shipmentRef = doc(db, "shipments", shipmentId);
//       unsubscribeShipment = onSnapshot(shipmentRef, (shipmentDoc) => {
//         if (!shipmentDoc.exists()) {
//           // setCurrentShipment(null);
//           // setOtherShipments([]);
//           return null;
//         }

//         const shipmentData = { id: shipmentDoc.id, ...shipmentDoc.data() };
        
//         // Filtre le shipment annulé avant de mettre à jour l'état
//         if (shipmentData.status !== "Annuler") {
//           setCurrentShipment(shipmentData);
//           return;
//         }

       

//         // Écoute en temps réel des autres shipments du même expéditeur
//         const shipmentsRef = collection(db, "shipments");
//         const shipmentQuery = query(
//           shipmentsRef, 
//           where("expediteurId", "==", shipmentData.expediteurId),
//           where("status", "!=", "Annuler")
//         );

//         unsubscribeOtherShipments = onSnapshot(shipmentQuery, (querySnapshot) => {
//           const filteredShipments = querySnapshot.docs
//             .map((doc) => ({ id: doc.id, ...doc.data() }))
//             .filter((shipment) => shipment.id !== shipmentId);

//           setOtherShipments(filteredShipments);
//         });
//       });
//     } catch (error) {
//       console.error("Erreur lors de la récupération des données:", error);
//     }
//   };

//   fetchShipmentAndExpeditor();

//   // Cleanup function pour désabonner les écouteurs
//   return () => {
//     unsubscribeShipment();
//     unsubscribeOtherShipments();
//   };
// }, [shipmentId]);


useEffect(() => {
  if (!shipmentId) return;

  let unsubscribeShipment = () => {};
  let unsubscribeOtherShipments = () => {};

  const fetchShipmentAndExpeditor = async () => {
    try {
      // Écoute en temps réel du document shipment principal
      const shipmentRef = doc(db, "shipments", shipmentId);
      unsubscribeShipment = onSnapshot(shipmentRef, (shipmentDoc) => {
        if (!shipmentDoc.exists()) {
          setCurrentShipment(null);
          setOtherShipments([]);
          return;
        }

        const shipmentData = { id: shipmentDoc.id, ...shipmentDoc.data() };
        
        // Filtre le shipment annulé avant de mettre à jour l'état
        if (shipmentData.status === "Annuler") {
          toast.info("L'Offre a été annulée")
          router.back()
        }

        setCurrentShipment(shipmentData);

        // Construction de la query en fonction du rôle
        const shipmentsRef = collection(db, "shipments");
        let shipmentQuery;

        if (userData?.role === "expediteur") {
          // Requête spécifique pour les transporteurs
          shipmentQuery = query(
            shipmentsRef, 
            where("expediteurId", "==", shipmentData.expediteurId),
            where("status", "!=", "Annuler")
          );
        } else {
          // Requête par défaut pour les autres rôles
          shipmentQuery = query(
            shipmentsRef,
            where("status", "!=", "Annuler") 
            // where("price" ,"!=" ,"0")
            
          );
        }

        // Écoute en temps réel des autres shipments
        unsubscribeOtherShipments = onSnapshot(shipmentQuery, (querySnapshot) => {
          const filteredShipments = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((shipment) => shipment.id !== shipmentId);

          setOtherShipments(filteredShipments);
        }, (error) => {
          console.error("Erreur d'écoute des autres shipments:", error);
        });
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  fetchShipmentAndExpeditor();

  // Cleanup function pour désabonner les écouteurs
  return () => {
    unsubscribeShipment();
    unsubscribeOtherShipments();
  };
}, [shipmentId, userData?.role]); // Ajout de userData.role comme dépendance
const handleCancelShipment =  async () => {
  if (!cancelReason) return alert("Veuillez sélectionner une raison.");

  const isUserExpediteur = uid === currentShipment.expediteurId;
  const receiverId = isUserExpediteur ? transporteur.id : currentShipment.expediteurId;
 let newStatus="Annuler"
 let shipmentId =currentShipment?.id
 let userr = {id:user?.uid ,...userData}
  await updateShipmentStatus(shipmentId ,newStatus,cancelReason ,userr)

  if (receiverId !== uid) {
    // Email (gestion d'erreur indépendante)
    if (chatPartner?.email) {
      sendEmailNotification(currentShipment.id, "Annuler")
        .then(email => console.log("Email envoyé:", email))
        .catch(emailError => console.error("Erreur email:", emailError));
    }

    // Push notification (gestion d'erreur indépendante)
    sendPushNotification(currentShipment.id, "Annuler")
      .then(result => console.log("Notification push:", result))
      .catch(pushError => console.error("Erreur push:", pushError));
  }
  setIsModalOpen(false);
  toast.info("Offre Annuler")
  if(userData.role=="expediteur"){
    router.push("/mes-colis")
  }else{
    router.push("/shipments")
  }
  
};


  // Fonction pour déterminer si un message est le dernier du groupe
  const isLastMessageOfGroup = (message, index) => {
    return (
      index === messages.length - 1 ||
      messages[index + 1].sender !== message.sender
    );
  };
  const handleOfferAcceptance = async (msg) => {
    let shipmentId = currentShipment?.id;
    let newStatus = "Accepter";
  
    try {
      await updateDoc(doc(db, "messages", msg.id), { isRead: true });
      await updateShipmentStatus(shipmentId, newStatus, user);
  
      await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: transporteur?.email,
          shipment: { objectName: currentShipment.objectName },
          type: "acceptance",
          chatId: shipmentId,
          user: { firstName: chatPartner?.firstName ?? transporteur?.firstName, lastName: chatPartner?.lastName?? transporteur?.lastName },
        }),
      });
      setIsOfferAccepted(true);
      toast.success("Offre validée avec succès!");
      await sendPushNotification(shipmentId ,'acceptance')
      // Mettre à jour l'état local pour afficher immédiatement l'offre acceptée
     
    } catch (error) {
      toast.error("Erreur lors de la validation de l'offre");
    }
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

   
  } catch (error) {
    // toast.error("Erreur lors de l'envoi de l'image");
  } finally {
    setIsUploading(false);
  }
};
//  console.log("user role" ,user?.role)
  // console.log("messages" ,messages)
  return (
    <>

<DefaultLayout>




<div className="flex flex-col h-screen bg-gray-100">
  {/* Header */}
  <div className="bg-white shadow-sm p-4">
    <div className="flex items-center justify-between mx-auto px-2 sm:max-w-4xl sm:px-0">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Avatar
          size={8}
          src={uid !== transporteur?.id ? transporteur?.photoURL : chatPartner?.photoURL}
          name={uid !== transporteur?.id 
            ? `${transporteur?.firstName} ${transporteur?.lastName}` 
            : `${chatPartner?.firstName} ${chatPartner?.lastName}`}
        />
        <div className="max-w-[180px] sm:max-w-none">
          <h2 className="font-semibold text-sm sm:text-base truncate">
            {uid !== transporteur?.id 
              ? transporteur 
                ? `${transporteur.firstName} ${transporteur.lastName} / ${transporteur.phoneNumber}` 
                : 'Chargement...'
              : chatPartner 
                ? `${chatPartner.firstName} ${chatPartner.lastName} / ${chatPartner.phoneNumber}` 
                : 'Chargement...'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {messages.some(m => !m.isRead) ? 'En ligne' : 'Hors ligne'}
          </p>
        </div>
      </div>
      <div>
        <Link href={uid == transporteur?.id ? "/shipments" : "/mes-colis"}> 
          <AiOutlineArrowLeft className="text-xl sm:text-2xl"/>
        </Link>
      </div>
    </div>
  </div>
  
  {/* Shipment Info */}
  {currentShipment && (
    <div className="bg-white p-2 m-2 rounded-lg shadow flex flex-col space-y-2">
      <h3 className="text-sm font-semibold mb-2 flex items-center">
        <FaBox className="mr-1" /> Colis à expédier
      </h3>
      {currentShipment.status == 'Accepter' && (
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
          <FaHashtag className="mr-1" />
          <span className="font-medium">Référence:</span> {currentShipment?.reference ?? '11569'}
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
      <div className="w-full">
        {/* Barre verte d'acceptation (si colis accepté) */}
        {currentShipment.status === "Accepter" && (
          <div className="flex items-center bg-green-100 text-green-800 p-2 mb-3 rounded-t-lg">
            <FaCheckCircle className="mr-2 text-green-500" />
            <span className="text-sm font-medium">Cette offre a été acceptée</span>
          </div>
        )}

        {/* {currentShipment.status === "Annuler" && (
          <div className="flex items-center bg-red-100 text-red-800 p-2 mb-3 rounded-t-lg">
            <MdCancel className="mr-2 text-red-500"/>   
            <span className="text-sm font-medium">Cette offre a été Annuler</span>
          </div>
        )} */}

        {/* Conteneur des boutons - Modifié pour mobile */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
          {/* Bouton Accepter l'offre (uniquement transporteur) */}
          {currentShipment.status === "En attente" && userData?.role === "transporteur" && (
            <button
              onClick={() => handleAcceptShipment(currentShipment.id)}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors"
            >
              <FaCheck className="w-4 h-4" />
              <span>Accepter l'offre</span>
            </button>
          )}

          {/* Bouton Annuler l'offre (visible selon conditions) */}
          {(currentShipment.status === "En attente" || 
            (currentShipment.status === "Accepter")) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors ${
                currentShipment.status === "Accepter" 
                  ? "bg-red-500 text-white" 
                  : "bg-red-500 text-white"
              }`}
            >
              <FaTimes className="w-4 h-4" />
              <span>Annuler l'offre</span>
            </button>
          )}
        </div>
      </div>

      {/* Modale d'annulation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 sm:w-80">
            <h3 className="text-lg font-semibold mb-3">Pourquoi annuler l'offre ?</h3>
            <div className="space-y-2">
              {userData?.role === "transporteur" ? (
                <>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cancelReason"
                      value="transporteur_annulation"
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="form-radio"
                    />
                    <span className="text-sm sm:text-base">J'ai décidé d'annuler la livraison</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cancelReason"
                      value="client_annulation"
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="form-radio"
                    />
                    <span className="text-sm sm:text-base">Le client a décidé d'annuler le transport</span>
                  </label>
                </>
              ) : (
                <>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cancelReason"
                      value="client_annulation"
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="form-radio"
                    />
                    <span className="text-sm sm:text-base">J'ai décidé d'annuler ma demande</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cancelReason"
                      value="transporteur_annulation"
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCancelReason(e.target.value)}}
                      className="form-radio"
                    />
                    <span className="text-sm sm:text-base">Le transporteur a décidé d'annuler la livraison</span>
                  </label>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 px-3 py-1 rounded-lg text-sm"
              >
                Annuler
              </button>
              <button
                onClick={(e)=>{
                  e.preventDefault();
                  e.stopPropagation();
                  handleCancelShipment()}}
                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )}

  {!currentShipment && <div className="bg-white p-1 m-1 rounded-sm  text-center">
        <FiPackage className="text-green-500 text-sm mx-auto" />
        <p className="text-gray-500 mt-2">Aucun autre colis actif trouvé</p>
      </div>}

  {/* Chat Area */}
  <div className="flex flex-col h-full p-2 sm:p-4 bg-gray-100">
    <div className="flex-1 overflow-y-auto space-y-3 w-full mx-auto px-2 sm:max-w-2xl sm:px-0">
      {messages
        .filter((msg) => msg.shipmentId === currentShipment?.id )
        .map((msg, i) => {
          const isLast = isLastMessageOfGroup(msg, i);
          const isFirst = isFirstMessageOfGroup(msg, i);
          const isSentByMe = msg.sender === uid;
          const shouldMarkAsRead = !isSentByMe && !msg.isRead;
          
          return (
            <div
              key={msg.id}
              ref={shouldMarkAsRead ? (node) => messageObserver(node) : null}
              className={clsx(
                "flex items-end gap-2",
                isSentByMe ? "justify-end" : "justify-start",
                msg.pending && "opacity-100"
              )}
            >
              {!isSentByMe && isLast && (
                <div className="size-8">
                  <Avatar
                    size={8}
                    src={msg.avatar}
                    name={`${chatPartner?.firstName} ${chatPartner?.lastName}`}
                  />
                </div>
              )}
              
              <div
                className={clsx(
                  isSentByMe
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800",
                  isLast && !isFirst && (isSentByMe ? "rounded-tr-lg" : "rounded-tl-lg"),
                  isFirst && !isLast && (isSentByMe ? "rounded-br-lg" : "rounded-bl-lg"),
                  !isFirst && !isLast && (isSentByMe ? "rounded-r-lg" : "rounded-l-lg"),
                  "p-3 max-w-[80%] sm:max-w-[70%] text-sm sm:text-base"
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
                    <div className="font-semibold text-sm sm:text-lg">📦 Nouvelle offre de transport</div>
                    {(currentShipment.status === "Accepter" && isOfferAccepted) && (
                      <div className="flex items-center bg-green-100 text-green-800 p-2 mb-3 rounded-t-lg">
                        <FaCheckCircle className="mr-2 text-green-500" />
                        <span className="text-sm font-medium">Cette Offre a été acceptée</span>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="flex items-center text-xs sm:text-sm">
                        <FaBox className="mr-1" /> Object : {currentShipment.objectName}
                      </p>
                      <p className="text-xs sm:text-sm">💰 Prix proposé: {msg.offerDetails.price}€</p>
                      <p className="text-xs sm:text-sm">📅 Date de début: {msg.offerDetails.startDate}</p>
                      {msg.offerDetails.endDate && (
                        <p className="text-xs sm:text-sm">📅 Date de fin: {msg.offerDetails.endDate}</p>
                      )}
                      <p className="mt-2 text-xs sm:text-sm">📝 Informations supplémentaires:</p>
                      <p className="text-xs sm:text-sm">{msg.offerDetails.additionalInfo}</p>
                    </div>
                    {!isSentByMe && !msg.isRead && (
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`validate-${msg.id}`}
                          onChange={() => {handleOfferAcceptance(msg)}}
                          className="form-checkbox h-4 w-4 text-green-600"
                        />
                        <label htmlFor={`validate-${msg.id}`} className="text-xs sm:text-sm">
                          Valider cette offre
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base">{msg.message}</p>
                )}
              </div>

              {isSentByMe && isLast && (
                <div className="size-8">
                  <Avatar
                    size={8}
                    src={userData?.photoURL}
                    name={`${userData?.firstName} ${userData?.lastName}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      
      <div ref={messagesEndRef} />
    </div>
{messages.length  <=0 && <div className=" p-4 m-4 rounded-lg shadow text-center ">
     <MdMessage className="text-green-600 text-4xl mx-auto" />
        <p className="text-gray-500 mt-2">Aucun  message pour le moment</p>
      </div>}

    {/* Message Input */}
    <div className="flex gap-2 p-2 sm:p-4 bg-white w-full mx-auto">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Écrivez votre message..."
        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm sm:text-base"
      />
      <label className="cursor-pointer px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
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
        className="px-3 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-300 text-sm sm:text-base"
      >
        Envoyer
      </button>
    </div>

    {/* Liste des autres colis */}

    {/* {otherShipments.length > 0 ? (
      <div className="bg-white p-3 m-2 sm:m-4 rounded-lg shadow">
        <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Autres colis à expédier</h3>
        <div className="space-y-3">
          {otherShipments.map((shipment) => (
            <div 
              key={shipment.id} 
              className={`border p-2 sm:p-3 rounded-lg hover:bg-gray-50 cursor-pointer 
                ${shipment.id == currentShipment?.id ? 'border-blue-500 bg-blue-100' : ''}`}
              onClick={() => handleShipmentChange(shipment)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-bolder text-green-600 hover:underline capitalize text-sm sm:text-base">
                    {shipment.objectName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {shipment.pickupAddress} → {shipment.deliveryAddress}
                  </p>
                  <p className="text-xs sm:text-sm">Prix: {shipment.price}€</p>
                </div>
                {shipment?.status === 'En attente' && user?.role === "transporteur" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptShipment(shipment.id);
                    }}
                    className="mt-2 sm:mt-0 bg-green-500 text-white py-1 px-2 sm:px-3 rounded hover:bg-green-600 text-xs sm:text-sm"
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
      <div className="bg-white p-4 m-4 rounded-lg shadow text-center">
        <FiPackage className="text-green-600 text-4xl mx-auto" />
        <p className="text-gray-500 mt-2">Aucun autre colis actif trouvé</p>
      </div>
    )} */}


{otherShipments.length > 0 ? (
  <div className="bg-white p-3 m-2 sm:m-4 rounded-lg shadow">
    <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Autres colis à expédier</h3>
    <div className="space-y-3 max-h-[210px] overflow-y-auto"> {/* Ajout de max-h et overflow-y */}
      {otherShipments
      .filter(shipment => shipment.price !== 0) 
      .map((shipment) => (
        
        <div 
          key={shipment.id} 
          className={`border p-2 sm:p-3 rounded-lg hover:bg-gray-50 cursor-pointer 
            ${shipment.id == currentShipment?.id ? 'border-blue-500 bg-blue-100' : ''}`}
          onClick={() => handleShipmentChange(shipment)}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p className="font-bolder text-green-600 hover:underline capitalize text-sm sm:text-base">
                {shipment.objectName}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {shipment.pickupAddress} → {shipment.deliveryAddress}
              </p>
              <p className="text-xs sm:text-sm">Prix: {shipment.price}€</p>
            </div>
            {shipment?.status === 'En attente' && userData?.role === "transporteur" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptShipment(shipment.id);
                }}
                className="mt-2 sm:mt-0 bg-green-500 text-white py-1 px-2 sm:px-3 rounded hover:bg-green-600 text-xs sm:text-sm"
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
  <div className="bg-white p-2 m-2 rounded-lg shadow text-center">
    <FiPackage className="text-green-600 text-sm mx-auto" />
    <p className="text-gray-500 mt-2">Aucun autre colis actif trouvé</p>
  </div>
)}

  </div>
</div>






      </DefaultLayout>

    </>
  );
};





