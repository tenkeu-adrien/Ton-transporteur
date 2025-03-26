// "use client"
// import { useState, useEffect, useRef } from 'react';
// import { db, auth }  from '../../lib/firebaseConfig';
// import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
// import { useAuthState } from 'react-firebase-hooks/auth';

// export default function Chat({ otherUserId }) {
//   const [user] = useAuthState(auth);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (user && otherUserId) {
//       const messagesRef = collection(db, 'messages');
//       const q = query(
//         messagesRef,
//         where('users', 'array-contains', user.uid),
//         where('users', 'array-contains', otherUserId),
//         orderBy('timestamp')
//       );

//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const messagesData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setMessages(messagesData);
//       });

//       return () => unsubscribe();
//     }
//   }, [user, otherUserId]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       await addDoc(collection(db, 'messages'), {
//         message: input,
//         users: [user.uid, otherUserId],
//         sender: user.uid,
//         // timestamp: serverTimestamp(),
//       });
//       setInput('');
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };
//     console.log("user connecter dans le chat" , user)
//   return (
//     <div className="chat-container">
//       <div className="messages" ref={messagesEndRef}>
//         {messages.map((msg) => (
//           <div key={msg.id} className={`message ${msg.sender === user.uid ? 'sent' : 'received'}`}>
//             <p>{msg.text}</p>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={sendMessage}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message"
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }


"use client";
import { useState, useEffect, useRef } from "react";
import { db, auth } from "../../lib/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Avatar } from "./Avartar";
import { Box } from "./Box";

// Étendre dayjs avec le plugin relativeTime
dayjs.extend(relativeTime);

export default function Chat({ otherUserId }) {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user && otherUserId) {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("users", "array-contains", user.uid),
        where("users", "array-contains", otherUserId),
        orderBy("timestamp")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [user, otherUserId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      await addDoc(collection(db, "messages"), {
        text: input,
        users: [user.uid, otherUserId],
        sender: user.uid,
        timestamp: serverTimestamp(),
      });
      setInput("");
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => {
          const isLast = isLastMessageOfGroup(msg, i);
          const isFirst = isFirstMessageOfGroup(msg, i);
          const isSentByMe = msg.sender === user.uid;

          return (
            <div
              key={msg.id}
              className={clsx(
                "flex items-end gap-2.5",
                isSentByMe
                  ? "justify-end ltr:ml-4 ltr:sm:ml-10 rtl:mr-4 rtl:sm:mr-10"
                  : "justify-start ltr:mr-4 ltr:sm:mr-10 rtl:ml-4 rtl:sm:ml-10",
                isLast ? "mb-4" : "mb-1.5"
              )}
            >
              {!isSentByMe && isLast && (
                <div className="size-10 max-sm:hidden">
                  <Avatar
                    size={10}
                    src={msg.avatar} // Remplacez par l'avatar de l'expéditeur
                    name={msg.senderName} // Remplacez par le nom de l'expéditeur
                    initialColor="auto"
                  />
                </div>
              )}

              <Box
                className={clsx(
                  isSentByMe
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-800",
                  isLast && !isFirst && (isSentByMe ? "ltr:rounded-tr rtl:rounded-tl" : "ltr:rounded-tl rtl:rounded-tr"),
                  isFirst && !isLast && (isSentByMe ? "ltr:rounded-br rtl:rounded-bl" : "ltr:rounded-bl rtl:rounded-br"),
                  !isFirst && !isLast && (isSentByMe ? "ltr:rounded-r rtl:rounded-l" : "ltr:rounded-l rtl:rounded-r")
                )}
              >
                <p>{msg.text}</p>
                <p className="-mb-2 mt-1 text-end text-tiny+ text-white/90 ltr:ml-auto rtl:mr-auto">
                  {dayjs(msg.timestamp?.toDate()).fromNow()}
                </p>
              </Box>

              {isSentByMe && isLast && (
                <div className="size-10 max-sm:hidden">
                  <Avatar
                    size={10}
                    src={user.photoURL} // Avatar de l'utilisateur actuel
                    name={user.displayName} // Nom de l'utilisateur actuel
                    initialColor="auto"
                  />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 p-4 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg"
        >
          envoyer
        </button>
      </form>
    </div>
  );
}