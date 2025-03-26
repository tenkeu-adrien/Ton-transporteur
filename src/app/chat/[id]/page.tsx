"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "../../../../lib/firebaseConfig";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { AuthContext } from "../../../../context/AuthContext";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Avatar } from "@/components/Avartar";
import { Box } from "@/components/Box";
import { FaImage, FaSpinner } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getMessaging, getToken} from "firebase/messaging";
import { FaEllipsisV, FaTrash, FaEdit } from 'react-icons/fa';
import { Menu } from '@headlessui/react';
import { AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";

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

export default function ChatRoom({ params }) {
  // ... autres états
  const searchParams = useSearchParams();
  const isFromOffer = searchParams.get('offer') === 'true';
const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null);
const [isUploading, setIsUploading] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [messageToEdit, setMessageToEdit] = useState({ id: '', content: '' });
const [editedMessage, setEditedMessage] = useState('');


  const { user} = useContext(AuthContext);
  const uid = auth?.currentUser?.uid;



const router =useRouter()
  useEffect(() => {
    // Afficher un message de bienvenue si on vient d'une offre
    if (isFromOffer) {
      toast.success("Offre envoyée ! Vous pouvez maintenant discuter avec l'expéditeur.");
    }
  }, [isFromOffer]);

  useEffect(() => {
    if (!id) return;
console.log("uuid" ,uid , 'id' , id)
    const fetchMessages = async () => {
      const messagesRef = collection(db, "messages");

      // Requête pour les messages où l'utilisateur actuel est un participant
      const q = query(messagesRef, where("users", "array-contains", uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // Vérifier que `users` existe et est un tableau
          if (data.users && Array.isArray(data.users) && data.users.includes(id)) {
            messages.push({ id: doc.id, ...data });
          }
        });

        // Trier les messages par timestamp (du plus ancien au plus récent)
        messages.sort((a, b) => a.timestamp - b.timestamp);

        // Mettre à jour l'état `messages`
        setMessages(messages);
      });

      return unsubscribe;
    };

    fetchMessages();
  }, [uid, id]);

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


  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Envoyer le message
    const messageRef = await addDoc(collection(db, "messages"), {
      message: newMessage,
      sender: auth.currentUser?.uid,
      receiver: id,
      isRead: false,
      timestamp: serverTimestamp(),
      users: [auth.currentUser?.uid, id],
    });

    const userDoc = await getDoc(doc(db, "users", id));
const fcmToken = userDoc.data()?.fcmToken;
    console.log("donner de l'utilisateur",userDoc.data());
    

    console.log("fcmToken",fcmToken);

    await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: id,
        title: `Nouveau message de ${user?.firstName}`,
        body: newMessage,
        type: 'new_message',
        fcmToken: fcmToken,
        data: {
          messageId: messageRef.id,
          chatId: id
        }
      })
    });

    setNewMessage("");
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

    toast.success("Image envoyée avec succès!");
  } catch (error) {
    toast.error("Erreur lors de l'envoi de l'image");
  } finally {
    setIsUploading(false);
  }
};

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
          {chatPartner ? `${chatPartner.firstName} ${chatPartner.lastName}` : 'Chargement...'}
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
      {isFromOffer && messages.length === 1 && (
        <div className="text-center p-4 text-gray-500">
          <p>Vous avez initié une conversation suite à une offre de transport</p>
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
              name={msg.senderName}
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
      <img 
        src={msg.imageUrl} 
        alt="Image partagée"
        className="rounded-lg max-w-full cursor-pointer hover:opacity-90"
        onClick={() => window.open(msg.imageUrl, '_blank')}
      />
      
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
              await fetch('/api/send-notification', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: msg.sender,
                  title: "Offre acceptée !",
                  body: `${user?.firstName} a accepté votre offre de transport`,
                  type: 'offer_accepted',
                  data: {
                    messageId: msg.id,
                    chatId: id
                  }
                })
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
  </div>
    // ... code existant pour les offres ...
  ) : (
    <p>{msg.message}</p> // ... code existant pour les messages normaux ...
  )}
 <p className="text-xs text-gray-500 mt-1">
            {dayjs(msg.timestamp?.toDate()).fromNow()}
          </p>
        </Box>

{/* 
        {isSentByMe && (
  <Menu as="div" className="relative">
    <Menu.Button className="p-1 hover:bg-gray-100 rounded">
      <FaEllipsisV className="text-gray-500" />
    </Menu.Button>
    <Menu.Items className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
    <Menu.Item>
  {({ active }) => (
    <button
      className={`${
        active ? 'bg-gray-100' : ''
      } flex w-full items-center px-4 py-2 text-sm`}
      onClick={() => {
        setMessageToEdit({ id: msg.id, content: msg.message });
        setEditedMessage(msg.message);
        setIsEditModalOpen(true);
      }}
    >
      <FaEdit className="mr-2" /> Modifier
    </button>
  )}
</Menu.Item>
<Menu.Item>
  {({ active }) => (
    <button
      className={`${
        active ? 'bg-gray-100' : ''
      } flex w-full items-center px-4 py-2 text-sm text-red-600`}
      onClick={() => {
        setMessageToEdit({ id: msg.id, content: msg.message });
        setIsDeleteModalOpen(true);
      }}
    >
      <FaTrash className="mr-2" /> Supprimer
    </button>
  )}
</Menu.Item>
    </Menu.Items>
  </Menu>
)} */}


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
 </div>
</div>


{isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-semibold mb-4">Modifier le message</h3>
      <textarea
        className="w-full p-2 border rounded-lg mb-4 min-h-[100px]"
        value={editedMessage}
        onChange={(e) => setEditedMessage(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          onClick={() => {
            setIsEditModalOpen(false);
            setEditedMessage('');
          }}
        >
          Annuler
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={async () => {
            if (editedMessage.trim()) {
              await updateDoc(doc(db, "messages", messageToEdit.id), {
                message: editedMessage
              });
              setIsEditModalOpen(false);
              setEditedMessage('');
            }
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
)}


{/* Modale de suppression */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-semibold mb-4">Supprimer le message</h3>
      <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce message ?</p>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          Annuler
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={async () => {
            await deleteDoc(doc(db, "messages", messageToEdit.id));
            setIsDeleteModalOpen(false);
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
)}

      </DefaultLayout>

    </>
  );
};





