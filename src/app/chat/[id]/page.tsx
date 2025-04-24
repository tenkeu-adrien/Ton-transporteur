"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { toast } from "react-toastify";
import {useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth,  app } from "../../../../lib/firebaseConfig";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc,  doc, getDoc, getDocs, limit, orderBy, writeBatch, arrayUnion} from "firebase/firestore";
import clsx from "clsx";

import { getMessaging, isSupported, onMessage } from "firebase/messaging";

import { Avatar } from "@/components/Avartar";
import { FaBox, FaCalendarCheck, FaCalendarAlt,FaMapMarkerAlt, FaMoneyBillWave, FaSortNumericUp, FaSpinner, FaWeightHanging, FaRulerCombined, FaTruckPickup, FaImage, FaTimes, FaCheck, FaHashtag, FaFile, FaPaperclip, FaDownload, FaCheckDouble, FaTimesCircle } from "react-icons/fa";
import {  documentId } from "firebase/firestore";

import Link from "next/link";
import { FaCheckCircle } from 'react-icons/fa';
import Image from "next/image";
import { updateShipmentStatus } from "../../../../lib/functions";
import { MdMessage } from "react-icons/md";
import { useRef, useCallback } from 'react';
import { FiPackage } from "react-icons/fi";
import { AuthContext } from "../../../../context/AuthContext";
import {debounce} from "lodash"
import { IoMdArrowBack } from "react-icons/io";
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
  users?:string[];
  pending?:Boolean;
  userInfo?:string
  readBy?: string[]; 
}
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


const useReadMessages = (currentUserId: string) => {
  const [readQueue, setReadQueue] = useState<Set<string>>(new Set());

  const processReadQueue = useCallback(
    debounce(async () => {
      if (readQueue.size === 0) return;
      
      const batch = writeBatch(db);
      const docsToCheck = Array.from(readQueue);
      
      // Vérifier l'existence des documents
      const q = query(
        collection(db, "messages"),
        where(documentId(), "in", docsToCheck)
      );
      const querySnapshot = await getDocs(q);
      
      const existingDocs = querySnapshot.docs;
      const existingIds = existingDocs.map(doc => doc.id);
      const nonExistingIds = docsToCheck.filter(id => !existingIds.includes(id));

      if (nonExistingIds.length > 0) {
        console.warn("Documents non trouvés:", nonExistingIds);
        // Retirer les IDs non existants de la queue
        setReadQueue(prev => {
          const newSet = new Set(prev);
          nonExistingIds.forEach(id => newSet.delete(id));
          return newSet;
        });
      }

      existingDocs.forEach(doc => {
        batch.update(doc.ref, {
          isRead: true,
          readBy: arrayUnion(currentUserId),
          readAt: serverTimestamp()
        });
      });

      try {
        if (existingDocs.length > 0) {
          await batch.commit();
        }
        setReadQueue(prev => {
          const newSet = new Set(prev);
          existingDocs.forEach(doc => newSet.delete(doc.id));
          return newSet;
        });
      } catch (error) {
        console.error("Erreur lors du marquage des messages:", error);
        // Vous pourriez implémenter une logique de réessai ici
      }
    }, 1000),
    [readQueue, currentUserId]
  );

  useEffect(() => {
    if (readQueue.size > 0) {
      processReadQueue();
    }
    
    return () => {
      processReadQueue.flush();
    };
  }, [readQueue, processReadQueue]);

  return useCallback((messageId: string) => {
    setReadQueue(prev => new Set([...prev, messageId]));
  }, []);
};
const useMessageObserver = (onIntersect: (messageId: string) => void) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedMessages = useRef(new Set<string>());

  return useCallback((node: HTMLElement | null, messageId: string) => {
    if (!node || observedMessages.current.has(messageId)) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect(messageId);
            observedMessages.current.add(messageId);
            observerRef.current?.unobserve(node);
          }
        });
      },
      { threshold: 0.5 } // Le message doit être visible à 50% pour être marqué comme lu
    );

    observerRef.current.observe(node);
  }, [onIntersect]);
};
export default function ChatRoom({ params}) {
 
  const { id: shipmentId } = useParams(); // id est maintenant expediteurId
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [error ,setTypeFileError] = useState(null)
const [isUploading, setIsUploading] = useState(false);
 const router =useRouter()
 const [lastMessageReadStatus, setLastMessageReadStatus] = useState<{[key: string]: boolean}>({});






const [isModalOpen, setIsModalOpen] = useState(false);
const [cancelReason, setCancelReason] = useState("");
const [currentShipment, setCurrentShipment] = useState(null);
  const [otherShipments, setOtherShipments] = useState([]);
  const [transporteur, setTransporteur] = useState(null);
const {userData ,user} = useContext(AuthContext)
  const [isNewOfferModalOpen, setIsNewOfferModalOpen] = useState(false);
const [newOfferPrice, setNewOfferPrice] = useState('');

const [transporteurOfferModal, setTransporteurOfferModal] = useState(null);
const [newOfferModal, setNewOfferModal] = useState(null);
const [acceptedOffers, setAcceptedOffers] = useState({});
const [pendingAcceptance, setPendingAcceptance] = useState({});
  const messagesEndRef = useRef(null);
let tempId
  const markMessageRead = useReadMessages(user?.uid);
  const messageObserver = useMessageObserver((messageId) => {
    if (!user?.uid) return;
    markMessageRead(messageId);
  });


  

  const handleTransporteurOfferAcceptance = (msg) => {
    setTransporteurOfferModal({
      msgId: msg.id,
      shipment:msg?.offerDetails,
      transporteurName: `${transporteur?.firstName} ${transporteur?.lastName}`
    });
    setAcceptedOffers(prev => ({ ...prev, [msg.id]: true }));
  };
  
  const handleAcceptTransporteurOffer = async (msgId) => {
    try {
      await updateDoc(doc(db, "messages", msgId), {
        "offerDetails.status": "Accepter"
      });
      
      await updateDoc(doc(db, "shipments", currentShipment.id), {
        status: "Accepter",
        price: transporteurOfferModal?.shipment?.price
      });
  
      // Envoyer les notifications
      await Promise.all([
        sendEmailNotification(currentShipment.id, "acceptance"),
        sendPushNotification(currentShipment.id, "acceptance")
      ]);
      setTransporteurOfferModal(null);
      return null
    } catch (error) {
      console.error("Erreur:", error);
      setAcceptedOffers(prev => ({ ...prev, [msgId]: false }));
    }
  };
  
  const handleNewOfferAcceptance = (msg) => {
    setNewOfferModal({
      msgId: msg.id,
      price: msg.price
    });
    setPendingAcceptance(prev => ({ ...prev, [msg.id]: true }));
  };
  
  const handleAcceptNewOffer = async (msgId, newPrice) => {
    try {
      // Mettre à jour le message
      await updateDoc(doc(db, "messages", msgId), {
        accepted: true
      });
  
      // Mettre à jour le shipment avec le nouveau prix
      await updateDoc(doc(db, "shipments", currentShipment.id), {
        price: newPrice,
        status: "Accepter"
      });
  
      // Envoyer les notifications
      await Promise.all([
        sendEmailNotification(currentShipment.id, "new_offer"),
        sendPushNotification(currentShipment.id, "new_offer")
      ]);
  
      // Mettre à jour l'état local
      setPendingAcceptance(prev => ({ ...prev, [msgId]: false }));
  return null
    } catch (error) {
      console.error("Erreur:", error);
      setPendingAcceptance(prev => ({ ...prev, [msgId]: false }));
    }
  };










const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const fileArray = Array.from(files) as File[]; // Type assertion ici
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const validFiles = fileArray.filter(file => allowedTypes.includes(file.type));

  if (validFiles.length !== fileArray.length) {
    setTypeFileError('Types de fichiers autorisés: JPG, PNG, GIF, PDF, DOC/DOCX');
  } else {
    setTypeFileError(''); // Réinitialiser l'erreur si tout est valide
  }

  setPreviewFiles(prev => [...prev, ...validFiles.slice(0, 5)]);
};

const uid = auth?.currentUser?.uid;

 const isUserExpediteur = uid === currentShipment?.expediteurId;
 const receiverId = isUserExpediteur ? transporteur?.id : currentShipment?.expediteurId;


  const removeFile = (index) => {
    const newFiles = [...previewFiles];
    newFiles.splice(index, 1);
    setPreviewFiles(newFiles);
  };

  const updateMessageReadStatus = useCallback((messageId: string) => {
    setLastMessageReadStatus(prev => ({
      ...prev,
      [messageId]: true
    }));
  }, []);


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
          shipment: { objectName: currentShipment.objectName ,id:currentShipment.id  ,price:currentShipment.price},
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
  


  const getNotificationTitle = (type) => {
    switch(type) {
      case "acceptance":
        return "Offre de transport acceptée";
        case "new_offer":
          return "Nouvelle offre de transport";
      case "Annuler":
        return "Offre annulée";
      default:
        return "Nouveau message";
    }
  };
  

  // Fonction pour faire défiler vers le dernier message
   const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 100);
  };

const sendPushNotification =  async (shipmentId: string, type: string ) => {
 let maxRetries = 3 ;  let retryDelay = 1000
    const shipment = currentShipment || otherShipments.find(s => s.id === shipmentId);
    // console.log("nous sommes dans les notifications")
    if (!shipment){
      // console.log("probleme avec le shipment")
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
          // console.log('Notification envoyée avec succès');
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
        // console.warn(`Tentative ${attempt} échouée. Nouvel essai dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

// Gestion améliorée des messages entrants
useEffect(() => {
  if (!currentShipment || !uid) return;

  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("shipmentId", "==", currentShipment.id),
    where("users", "array-contains", uid),
    orderBy("timestamp", "asc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const newMessages: Message[] = [];
    let partnerId = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Message;
      newMessages.push({ id: doc.id, ...data });

      // Trouver l'ID du partenaire
      const otherUser = data.users?.find(userId => userId !== uid);
      if (otherUser) partnerId = otherUser;
    });

    // Mettre à jour les messages en conservant les pending messages
    setMessages(prev => {
      const pendingMessages = prev.filter(msg => msg.pending);
      return [...pendingMessages, ...newMessages];
    });

    // Mettre à jour le statut de lecture pour les messages envoyés
    newMessages.forEach(msg => {
      if (msg.sender === uid && msg.isRead && !lastMessageReadStatus[msg.id]) {
        updateMessageReadStatus(msg.id);
      }
    });

    // Récupérer les infos du partenaire
    if (partnerId) {
      getDoc(doc(db, "users", partnerId)).then(partnerDoc => {
        if (partnerDoc.exists()) {
          setChatPartner({ id: partnerDoc.id, ...partnerDoc.data() });
        }
      });
    }

    scrollToBottom();
  });

  return unsubscribe;
}, [currentShipment?.id, uid]);


  useEffect(() => {
    const setupMessaging = async () => {
      try {
        const supported = await isSupported();
        if (!supported) {
          return null;
        }
        
       
  
        const messaging = getMessaging(app);
        
        onMessage(messaging, (payload) => {
          const { title, body, icon } = payload.notification || {};
          
          if (title && body) {
            new Notification(title, {
              body,
              icon: icon || '/images/logo/logo.png' // icône par défaut si non fournie
            });
          }
        });
      } catch (error) {
        return null
      }
    };
  
    setupMessaging();
  }, []);

  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Fonction pour formater la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]);
  };
  



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


 

const trackLastSentMessage = useCallback((messageId: string) => {
  setLastMessageReadStatus(prev => ({
    ...prev,
    [messageId]: false // Initialement non lu
  }));
}, []);


const sendMessage = async () => {
  if ((!newMessage.trim() && previewFiles.length === 0) || !currentShipment?.id || !transporteur?.id) return;

  setIsUploading(true);

  try {
    // 1. Préparer le message optimiste avec un ID temporaire
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      message: newMessage.trim() || (previewFiles.length > 0 ? `${previewFiles.length} fichier(s) joint(s)` : ''),
      sender: uid,
      receiver: receiverId,
      shipmentId: currentShipment.id,
      expediteurId: currentShipment.expediteurId,
      // transporteurId: transporteur.id,
      timestamp: serverTimestamp(),
      isRead: false,
      users: [uid, receiverId],
      userInfo: userData,
      pending: true,
      ...(previewFiles.length > 0 && { attachments: [] }) // Placeholder pour les pièces jointes
    };

    // 2. Mise à jour optimiste immédiate
    // setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");
    setPreviewFiles([]);
    scrollToBottom('auto'); // Défilement immédiat sans animation

    // 3. Traitement des fichiers si existants
    let uploadedFiles = [];
    if (previewFiles.length > 0) {
      const formData = new FormData();
      previewFiles.forEach(file => formData.append('files', file));

      const response = await fetch('/api/upload-files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Échec du téléversement des fichiers');
      uploadedFiles = await response.json();
    }

    // 4. Préparer le message final pour Firebase
    const finalMessage = {
      ...optimisticMessage,
      attachments: uploadedFiles,
      pending: false
    };

    // 5. Envoi à Firebase
    const docRef = await addDoc(collection(db, "messages"), finalMessage);

    // 6. Mise à jour avec l'ID réel et suivi du message
    setMessages(prev => prev.map(msg => 
      msg.id === tempId ? { ...msg, id: docRef.id, pending: false } : msg
    ));
    
    // Suivre ce message pour le statut de lecture
    trackLastSentMessage(docRef.id);

    // 7. Notifications
    if (receiverId !== uid) {
      await Promise.all([
        sendEmailNotification(currentShipment.id, "Nouveau message").catch(console.error),
        sendPushNotification(currentShipment.id, "Nouveau message").catch(console.error)
      ]);
    }

  } catch (error) {
    // console.error("Erreur d'envoi:", error);
    // Rollback de l'optimistic update
    setMessages(prev => prev.filter(msg => msg.id !== tempId));
  } finally {
    setIsUploading(false);
  }
};


  const handleShipmentChange = (shipment: Shipment) => {
    setCurrentShipment(shipment);
    const others = otherShipments.filter(s => s.id !== shipment.id);
    setOtherShipments([...others, currentShipment]); // Ajoute l'ancien colis actuel à la liste
  };


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
        // if (shipmentData.status === "Annuler") {
        //   // toast.info("L'Offre a été annulée")
        //   router.back()
        // }

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
        .then(email => console.log(""))
        .catch(emailError => console.log(""));
    }

    // Push notification (gestion d'erreur indépendante)
    sendPushNotification(currentShipment.id, "Annuler")
      .then(result => console.log(""))
      .catch(pushError => console.error(""));
  }
  setIsModalOpen(false);
  toast.info("Offre Annuler")
  if(userData?.role==="expediteur"){
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
 
  // Fonction pour déterminer si un message est le premier du groupe
  const isFirstMessageOfGroup = (message, index) => {
    return index === 0 || messages[index - 1].sender !== message.sender;
  };
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
            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <Link href="#" onClick={() => router.back()}>
                  <span className="flex items-center space-x-2">
                    <IoMdArrowBack className="text-3xl text-green-500" />
                    <span className="text-green-500">Retour</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Info */}
        {currentShipment && (
          <div className="bg-white p-2 m-2 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <FaBox className="mr-1" /> Colis à expédier
            </h3>
            {currentShipment.status === 'Accepter' && (
              <div className="flex items-center text-green-500 text-xs">
                <FaCheckCircle className="mr-1" />
                <span>Offre de transport acceptée</span>
              </div>
            )}

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b pb-2">
              <p className="flex items-center text-xs">
                <FaMapMarkerAlt className="mr-1" /> Retrait : {currentShipment.pickupAddress}
              </p>
              <p className="flex items-center text-xs">
                <FaMapMarkerAlt className="mr-1" /> Livraison : {currentShipment.deliveryAddress}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b pb-2">
              <p className="flex items-center text-xs">
                <FaCalendarAlt className="mr-1" /> Date retrait :{" "}
                {currentShipment.pickupDate?.toDate?.()?.toLocaleString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }) ?? "Date invalide"}
              </p>
              <p className="flex items-center text-xs">
                <FaCalendarCheck className="mr-1" /> Date livraison :{" "}
                {currentShipment.deliveryDate?.toDate?.()?.toLocaleString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }) ?? "Date invalide"}
              </p>
            </div>

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

            <div className="w-full">
              {currentShipment.status === "Accepter" && (
                <div className="flex items-center bg-green-100 text-green-800 p-2 mb-3 rounded-t-lg">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  <span className="text-sm font-medium">Cette offre a été acceptée</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 mt-4">
                {currentShipment.status === "Annuler" && (
                  <div className="flex items-center bg-red-100 text-red-800 p-2 mb-3 rounded-t-lg md:w-2/4">
                    <FaTimesCircle className="mr-2 text-red-500" />
                    <span className="text-sm font-medium">Cette offre a été annulée</span>
                  </div>
                )}
                
                {currentShipment.status === "Annuler" && (
                  <div className="mt-4 md:mt-0 md:w-2/4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label htmlFor="status-select" className="text-sm font-medium text-gray-700 sm:mb-0">
                        Changer le statut du colis :
                      </label>
                      
                      <select
                        id="status-select"
                        className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 min-w-0"
                        defaultValue="Annuler"
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const shipmentRef = doc(db, "shipments", currentShipment.id);
                          await updateDoc(shipmentRef, { status: newStatus });

                          if (newStatus === "Accepter") {
                            await Promise.all([
                              sendEmailNotification(currentShipment.id, "acceptance"),
                              sendPushNotification(currentShipment.id, "acceptance"),
                            ]);
                          }
                        }}
                      >
                        <option value="Annuler">Annuler</option>
                        <option value="En attente">En attente</option>
                        <option value="Accepter">Accepter</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                {currentShipment.status === "En attente" && userData?.role === "transporteur" && (
                  <button
                    onClick={() => handleAcceptShipment(currentShipment.id)}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    <FaCheck className="w-4 h-4" />
                    <span>Accepter l'offre</span>
                  </button>
                )}

                {(currentShipment.status === "En attente" || currentShipment.status === "Accepter") && (
                  <>
                    {userData?.role === "expediteur" && (
                      <button
                        onClick={() => setIsNewOfferModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm hover:bg-green-600 bg-green-500 text-white transition-colors"
                      >
                        💬 Faire une nouvelle offre
                      </button>
                    )}
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
                  </>
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
                              setCancelReason(e.target.value);
                            }}
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCancelShipment();
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isNewOfferModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 sm:w-96">
                  <h3 className="text-lg font-semibold mb-3">Proposer un nouveau prix en (€)</h3>
                  <input
                    type="number"
                    placeholder="Entrer un nouveau prix (€)"
                    value={newOfferPrice}
                    onChange={(e) => setNewOfferPrice(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setIsNewOfferModalOpen(false);
                        setNewOfferPrice("");
                      }}
                      className="bg-gray-300 px-3 py-1 rounded-lg text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={async () => {
                        await addDoc(collection(db, "messages"), {
                          shipmentId: currentShipment.id,
                          sender: uid,
                          users: [uid, receiverId],
                          type: "new_offer",
                          timestamp: serverTimestamp(),
                          price: newOfferPrice,
                          createdAt: serverTimestamp(),
                        });
                        setIsNewOfferModalOpen(false);
                        setNewOfferPrice(null);
                        await Promise.all([
                          sendEmailNotification(currentShipment.id, "new_offer"),
                          sendPushNotification(currentShipment.id, "new_offer"),
                        ]);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                    >
                      Envoyer l'offre
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!currentShipment && (
          <div className="bg-white p-1 m-1 rounded-sm text-center">
            <FiPackage className="text-green-500 text-sm mx-auto" />
            <p className="text-gray-500 mt-2">Aucun autre colis actif trouvé</p>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex flex-col flex-1 p-2 sm:p-4 bg-gray-100 ">
          {/* Messages */}
          <div className="flex-1  space-y-3 w-full mx-auto px-2 sm:max-w-2xl sm:px-0">
            {messages
              .filter((msg) => msg.shipmentId === currentShipment?.id)
              .map((msg, i) => {
                const isLast = isLastMessageOfGroup(msg, i);
                const isFirst = isFirstMessageOfGroup(msg, i);
                const isSentByMe = msg.sender === uid;
                const shouldMarkAsRead = !isSentByMe && !msg.isRead;
                const isRead = isSentByMe && (msg.isRead || lastMessageReadStatus[msg.id]);
                const uniqueKey = `${msg.id}-${i}`;

                return (
                  <div
                    key={uniqueKey}
                    ref={shouldMarkAsRead ? (node) => messageObserver(node, msg.id) : null}
                    className={clsx(
                      "flex items-end gap-2",
                      isSentByMe ? "justify-end" : "justify-start",
                      msg.pending && "opacity-100"
                    )}
                  >
                    {/* Avatar de l'expéditeur (si ce n'est pas moi et dernier message du groupe) */}
                    {!isSentByMe && isLast && (
                      <div className="size-8">
                        <Avatar
                          size={8}
                          src={msg.avatar}
                          name={`${chatPartner?.firstName} ${chatPartner?.lastName}`}
                        />
                      </div>
                    )}

                    {/* Contenu du message */}
                    <div
                      className={clsx(
                        "relative",
                        isSentByMe ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800",
                        isLast && !isFirst && (isSentByMe ? "rounded-tr-lg" : "rounded-tl-lg"),
                        isFirst && !isLast && (isSentByMe ? "rounded-br-lg" : "rounded-bl-lg"),
                        !isFirst && !isLast && (isSentByMe ? "rounded-r-lg" : "rounded-l-lg"),
                        "p-3 max-w-[80%] sm:max-w-[70%] text-sm sm:text-base"
                      )}
                    >
                      {/* Message avec pièces jointes */}
                      {msg.attachments && msg.attachments.length > 0 ? (
                        <div className="space-y-2">
                          {msg.attachments.map((attachment, index) => (
                            <div key={index} className="group relative">
                              {attachment.type === "image" ? (
                                <div className="relative group">
                                  <Link href={attachment.url} passHref legacyBehavior>
                                    <a target="_blank" rel="noopener noreferrer">
                                      <Image
                                        src={attachment.url}
                                        width={150}
                                        height={150}
                                        alt="Image partagée"
                                        className="rounded-lg max-w-full cursor-pointer hover:opacity-90"
                                      />
                                    </a>
                                  </Link>
                                  {!isSentByMe && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          downloadFile(attachment.url, attachment.name || `image_${msg.id}_${index}.jpg`);
                                        }}
                                        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                      >
                                        <FaDownload />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center p-2 bg-white bg-opacity-20 rounded-lg">
                                  <FaFile className="text-xl mr-2" />
                                  <div>
                                    <p className="text-sm font-medium truncate max-w-[180px]">
                                      {attachment.name || "Fichier joint"}
                                    </p>
                                    <p className="text-xs text-gray-300">
                                      {formatFileSize(attachment.size)} - {attachment.mimeType}
                                    </p>
                                  </div>
                                  {!isSentByMe && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          downloadFile(attachment.url, attachment.name || `file_${msg.id}_${index}`);
                                        }}
                                        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                      >
                                        <FaDownload />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          {msg.message && msg.message !== `${msg.attachments.length} fichier(s) joint(s)` && (
                            <p className="text-sm sm:text-base mt-2">{msg.message}</p>
                          )}
                        </div>
                      ) : msg.offerDetails ? (
                        <div className="space-y-2">
                          <div className="font-semibold text-sm sm:text-lg">📦 Nouvelle offre de transport</div>
                          {currentShipment?.status === "Accepter" && (
                            <div className="flex items-center bg-green-100 text-green-800 p-2 mb-3 rounded-t-lg">
                              <FaCheckCircle className="mr-2 text-green-500" />
                              <span className="text-sm font-medium">Cette Offre a été acceptée</span>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="flex items-center text-xs sm:text-sm">
                              <FaBox className="mr-1" /> Object : {currentShipment?.objectName}
                            </p>
                            <p className="text-xs sm:text-sm">💰 Prix proposé: {msg.offerDetails.price}€</p>
                            <p className="text-xs sm:text-sm">📅 Date de début: {msg.offerDetails.startDate}</p>
                            {msg.offerDetails.endDate && (
                              <p className="text-xs sm:text-sm">📅 Date de fin: {msg.offerDetails.endDate}</p>
                            )}
                            <p className="mt-2 text-xs sm:text-sm">📝 Informations supplémentaires:</p>
                            <p className="text-xs sm:text-sm">{msg.offerDetails.additionalInfo}</p>
                          </div>
                          {!isSentByMe && (
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`validate-${msg.id}`}
                                checked={acceptedOffers[msg.id] || false}
                                onChange={() => handleTransporteurOfferAcceptance(msg)}
                                className="form-checkbox h-4 w-4 text-green-600"
                              />
                              <label className="text-xs sm:text-sm">
                                {acceptedOffers[msg.id] ? "Offre acceptée" : "Valider cette offre"}
                              </label>
                            </div>
                          )}
                        </div>
                      ) : msg.type === "new_offer" ? (
                        <div className="space-y-2">
                          <div className="font-semibold text-sm sm:text-lg">📦 Nouvelle offre de transport proposée :</div>
                          {currentShipment?.status === "Accepter" && (
                            <div className="flex items-center bg-green-100 text-green-800 p-2 mb-3 rounded-t-lg">
                              <FaCheckCircle className="mr-2 text-green-500" />
                              <span className="text-sm font-medium">Cette Offre a été acceptée</span>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="flex items-center text-xs sm:text-sm">
                              <FaBox className="mr-1" /> Object : {currentShipment?.objectName}
                            </p>
                            <p className="text-xs sm:text-sm">💰 Prix proposé: {msg.price}€</p>
                            <p className="text-xs sm:text-sm">📅 Date de début: {currentShipment?.pickupDate?.toDate?.()?.toLocaleString("fr-FR", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) ?? "Date invalide"}</p>
                            {currentShipment?.deliveryDate && (
                              <p className="text-xs sm:text-sm">📅 Date de fin: {currentShipment?.deliveryDate?.toDate?.()?.toLocaleString("fr-FR", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }) ?? "Date invalide"}</p>
                            )}
                          </div>
                          {(!isSentByMe || (!msg.accepted && userData?.role !== "expediteur")) && (
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`validate-${msg.id}`}
                                disabled={msg.accepted}
                                checked={pendingAcceptance[msg.id] || false}
                                onChange={() => handleNewOfferAcceptance(msg)}
                                className="form-checkbox h-4 w-4 text-green-600"
                              />
                              <label className="text-xs sm:text-sm">
                                {pendingAcceptance[msg.id] ? "En cours..." : "Accepter cette offre"}
                              </label>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-end">
                          <p className="text-sm sm:text-base">{msg.message}</p>
                          {isSentByMe && (
                            <div className={clsx(
                              "ml-2",
                              isRead ? "text-green-500" : "text-gray-400"
                            )}>
                              <FaCheckDouble className="text-xs" />
                            </div>
                          )}
                        </div>
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

          {messages.length <= 0 && (
            <div className="p-4 m-4 rounded-lg shadow text-center">
              <MdMessage className="text-green-600 text-4xl mx-auto" />
              <p className="text-gray-500 mt-2">Aucun message pour le moment</p>
            </div>
          )}

          {/* Message Input */}
          <div className="flex flex-col gap-2 p-2 sm:p-4 bg-white w-full mx-auto">
            {/* Aperçu des fichiers joints */}
            {previewFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {previewFiles.map((file, index) => (
                  <div key={index} className="relative border rounded-lg p-2 max-w-[200px]">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="max-h-20 max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center p-2">
                        <FaFile className="text-3xl text-gray-500" />
                        <span className="text-xs truncate w-full text-center mt-1">{file.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                    <span className="text-xs block mt-1">
                      {Math.round(file.size / 1024)} KB
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">

      
              <textarea
                value={newMessage}
                rows={2}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                // spellCheck={true}
                placeholder="Écrivez votre message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm sm:text-base resize-none"
              />

              <div className="flex flex-col gap-2">
                <div className="">
                  <label className="cursor-pointer p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                    />
                    {isUploading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaPaperclip />
                    )}
                  </label>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isUploading || (newMessage.trim() === '' && previewFiles.length === 0)}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base h-full"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des autres colis */}
        {otherShipments.length > 0 ? (
          <div className="bg-white p-3 m-2 sm:m-4 rounded-lg shadow">
            <h3 className="text-md sm:text-lg font-semibold mb-3 sm:mb-4">Autres colis à expédier</h3>
            <div className="space-y-3">
              {otherShipments
                .filter(shipment => shipment.price !== 0)
                .map((shipment) => (
                  <div 
                    key={shipment.id} 
                    className={`border p-2 sm:p-3 rounded-lg hover:bg-gray-50 cursor-pointer 
                      ${shipment.id === currentShipment?.id ? 'border-blue-500 bg-blue-100' : ''}`}
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

      {transporteurOfferModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 sm:w-80">
            <h3 className="text-lg font-semibold mb-3">Confirmer l'acceptation</h3>
            <p>Voulez-vous accepter cette offre de <span className="capitalize font-bold">{transporteurOfferModal.transporteurName} ?</span></p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setAcceptedOffers(prev => ({ ...prev, [transporteurOfferModal.msgId]: false }));
                  setTransporteurOfferModal(null);
                }}
                className="bg-gray-300 px-3 py-1 rounded-lg text-sm"
              >
                Non
              </button>
              <button
                onClick={async () => {
                  await handleAcceptTransporteurOffer(transporteurOfferModal.msgId);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
              >
                Oui, accepter
              </button>
            </div>
          </div>
        </div>
      )}

      {newOfferModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 sm:w-80">
            <h3 className="text-lg font-semibold mb-3">Accepter la nouvelle offre</h3>
            <p>Acceptez-vous le nouveau prix de {newOfferModal.price}€ ?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setPendingAcceptance(prev => ({ ...prev, [newOfferModal.msgId]: false }));
                  setNewOfferModal(null);
                }}
                className="bg-gray-300 px-3 py-1 rounded-lg text-sm"
              >
                Refuser
              </button>
              <button
                onClick={async () => {
                  await handleAcceptNewOffer(newOfferModal.msgId, newOfferModal.price);
                  setNewOfferModal(null);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}





      </DefaultLayout>

    </>
  );
};





