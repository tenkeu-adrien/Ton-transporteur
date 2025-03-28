import { useEffect, useState } from "react";
import Link from "next/link";
import { db, auth } from "../../../lib/firebaseConfig";
import { collection,  query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Avatar } from "../Avartar";

interface User {
  id: string;
  email: string;
  firstName: string;
  unreadCount: number;
  lastName:string,
  profile?: string;
  role:string,
  lastMessage?: string;
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
  // const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const currentUserId = auth?.currentUser?.uid;
  // Formater le message si présent
  const formatMessage = (msg: ChatCardProps["message"]) => {
    if (!msg) return "";
    return `Salut, je vous propose une expédition pour votre colis. 📦
Prix : ${msg.price} XOF  
Date : ${msg.date}  
Infos supplémentaires : ${msg.additionalInfo}`;
  };
  console.log("auth de firebase" ,auth.currentUser.uid)
console.log("user" ,users)
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) return;
  
      try {
        // 1. Récupérer les informations de l'utilisateur connecté
        const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
        const currentUserData = currentUserDoc.data();
        setCurrentUser(currentUserData);
  
        const usersRef = collection(db, "users");
        let usersQuery;
  
        // 2. Construire la requête avec un seul where
        if (currentUserData?.role === "expediteur") {
          // Pour les expéditeurs, filtrer par rôle transporteur
          usersQuery = query(
            usersRef,
            where("role", "==", "transporteur")
          );
        } else {
          // Pour les autres, récupérer tous les utilisateurs
          usersQuery = query(
            usersRef,
            where("email", "!=", "")
          );
        }
        onSnapshot(usersQuery, async (snapshot) => {
          // Filtrer côté client
          const usersList = snapshot.docs
            .filter(doc => 
              doc.id !== currentUserId && // Exclure l'utilisateur courant
              doc.data().email // Vérifier que l'email existe
            )
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
              unreadCount: 0,
            }));
  
          // Vérifier les messages non lus
          const updatedUsers = await Promise.all(
            usersList.map(async (user) => {
              const messagesRef = collection(db, "messages");
              const unreadQuery = query(
                messagesRef,
                where("receiver", "==", currentUserId),
                where("sender", "==", user.id),
                where("isRead", "==", false)
              );
  
              const unreadMessages = await new Promise((resolve) => {
                onSnapshot(unreadQuery, (snapshot) => {
                  resolve(snapshot.docs.length);
                });
              });
  
              return { ...user, unreadCount: unreadMessages };
            })
          );
  
          setUsers(updatedUsers);
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };
  
    fetchUsers();
  }, [currentUserId]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Chats
      </h4>
      <div>
        {users.map((user, key) => (
          <>
          <Link
            href={{
              pathname: `/chat/${user.id}`,
              query: { message: message ? formatMessage(message) : ""  ,
                ...(user.role === "transporteur" && { isTransporteur: true })},
            }}
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
<Avatar
        size={10}
        // src={user?.profile}
        src={null}
        name={`${user?.firstName} ${user?.lastName}`}
      />

            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {user.firstName} {user.lastName}
                </h5>
                <p className="text-sm text-black dark:text-white">
                  {message ? formatMessage(message) : user.lastMessage}
                </p>
              </div>

              {user.unreadCount > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {user.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </Link>
          <hr />
          </>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
