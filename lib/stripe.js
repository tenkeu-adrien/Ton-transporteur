// // import Stripe from 'stripe';
// // export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// <div className="flex flex-col h-screen p-4 bg-gray-100">
// <div className="flex-1 overflow-y-auto space-y-2 max-w-2xl mx-auto w-full">
//   {messages.map((msg, i) => {
//     const isLast = isLastMessageOfGroup(msg, i);
//     const isFirst = isFirstMessageOfGroup(msg, i);
//     const isSentByMe = msg.sender === uid;

//     return (
   
//           <div
//         key={msg.id}
//         className={clsx(
//           "flex items-end gap-2",
//           isSentByMe ? "justify-end" : "justify-start"
//         )}
//       >
//         {!isSentByMe && isLast && (
//           <div className="size-8">
//             <Avatar
//               size={8}
//               src={msg.avatar} // Remplacez par l'avatar de l'expéditeur
//               name={msg.senderName} // Remplacez par le nom de l'expéditeur
//               initialColor="auto"
//             />
//           </div>
//         )}

//         <Box
//           className={clsx(
//             isSentByMe
//               ? "bg-green-500 text-white"
//               : "bg-gray-200 text-gray-800",
//             isLast && !isFirst && (isSentByMe ? "rounded-tr-lg" : "rounded-tl-lg"),
//             isFirst && !isLast && (isSentByMe ? "rounded-br-lg" : "rounded-bl-lg"),
//             !isFirst && !isLast && (isSentByMe ? "rounded-r-lg" : "rounded-l-lg"),
//             "p-3 max-w-[70%]"
//           )}
//         >
//           <p>{msg.message}</p>
//           <p className="text-xs text-gray-500 mt-1">
//             {dayjs(msg.timestamp?.toDate()).fromNow()}
//           </p>
//         </Box>

//         {isSentByMe && isLast && (
//           <div className="size-8">
//             <Avatar
//               size={8}
//               src={user?.photoURL} // Avatar de l'utilisateur actuel
//               name={user?.displayName} // Nom de l'utilisateur actuel
//               initialColor="auto"
//             />
//           </div>
//         )}
//       </div>

    
//     );
//   })}
// </div>

// <div className="flex gap-2 p-4 bg-white max-w-2xl mx-auto w-full">
//   <input
//     type="text"
//     value={newMessage}
//     onChange={(e) => setNewMessage(e.target.value)}
//     placeholder="Type a message..."
//     className="flex-1 p-2 border border-gray-300 rounded-lg"
//   />
//   <button
//     onClick={sendMessage}
//     className="px-4 py-2 bg-green-500 text-white rounded-lg"
//   >
//     Envoyer
//   </button>
// </div>
// </div>

// // Étendre dayjs avec le plugin relativeTime
// dayjs.extend(relativeTime);

// const ChatPage = () => {
//   const { id } = useParams();
//   const [messages, setMessages] = useState<any[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const { user, userData, loading, error, logout } = useContext(AuthContext);
//   const uid = auth?.currentUser?.uid;

//   useEffect(() => {
//     if (!id) return;
// console.log("uuid" ,uid , 'id' , id)
//     const fetchMessages = async () => {
//       const messagesRef = collection(db, "messages");

//       // Requête pour les messages où l'utilisateur actuel est un participant
//       const q = query(messagesRef, where("users", "array-contains", uid));

//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const messages = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();

//           // Vérifier que `users` existe et est un tableau
//           if (data.users && Array.isArray(data.users) && data.users.includes(id)) {
//             messages.push({ id: doc.id, ...data });
//           }
//         });

//         // Trier les messages par timestamp (du plus ancien au plus récent)
//         messages.sort((a, b) => a.timestamp - b.timestamp);

//         // Mettre à jour l'état `messages`
//         setMessages(messages);
//       });

//       return unsubscribe;
//     };

//     fetchMessages();
//   }, [uid, id]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     await addDoc(collection(db, "messages"), {
//       message: newMessage,
//       sender: auth.currentUser?.uid,
//       receiver: id,
//       isRead:false ,
//       timestamp: serverTimestamp(),
//       users: [auth.currentUser?.uid, id],
//     });

//     setNewMessage("");
//   };

//   // Fonction pour déterminer si un message est le dernier du groupe
//   const isLastMessageOfGroup = (message, index) => {
//     return (
//       index === messages.length - 1 ||
//       messages[index + 1].sender !== message.sender
//     );
//   };

//   // Fonction pour déterminer si un message est le premier du groupe
//   const isFirstMessageOfGroup = (message, index) => {
//     return index === 0 || messages[index - 1].sender !== message.sender;
//   };

//   import { useContext, useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { db, auth } from "../../../../lib/firebaseConfig";
// import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
// import { AuthContext } from "../../../../context/AuthContext";
// import Link from "next/link";
// import clsx from "clsx";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import { Avatar } from "@/components/Avartar";
// import { Box } from "@/components/Box";
// import Navbar from "@/components/Navbar";


























// chat qui fonctionne 

{/* <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Avatar
              size={10}
              src={messages[0]?.avatar}
              name={messages[0]?.senderName}
            />
            <div>
              <h2 className="font-semibold">{messages[0]?.senderName}</h2>
              <p className="text-sm text-gray-500">
                {messages.some(m => !m.isRead) ? 'En ligne' : 'Hors ligne'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/shipments')}
            className="text-gray-600 hover:text-gray-800"
          >
            <IoMdArrowBack size={24} />
          </button>
        </div>
      </div>

      {isFromOffer && messages.length === 1 && (
        <div className="text-center p-4 text-gray-500">
          <p>Vous avez initié une conversation suite à une offre de transport</p>
        </div>
      )}

 <div className="flex flex-col h-screen p-4 bg-gray-100">
 <div className="flex-1 overflow-y-auto space-y-2 max-w-2xl mx-auto w-full">
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
               src={msg.avatar}  // Remplacez par l'avatar de l'expéditeur
               name={msg.senderName}   //Remplacez par le nom de l'expéditeur
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
           <p>{msg.message}</p>
           <p className="text-xs text-gray-500 mt-1">
             {dayjs(msg.timestamp?.toDate()).fromNow()}
           </p>
         </Box>

         {isSentByMe && isLast && (
           <div className="size-8">
             <Avatar
               size={8}
               src={user?.photoURL}    ///Avatar de l'utilisateur actuel
               name={user?.displayName}   // Nom de l'utilisateur actuel
               initialColor="auto"
             />
           </div>
         )}
       </div>

    
     );
   })}
 </div>

 <div className="flex gap-2 p-4 bg-white max-w-2xl mx-auto w-full">
   <input
     type="text"
     value={newMessage}
     onChange={(e) => setNewMessage(e.target.value)}
     placeholder="Type a message..."
     className="flex-1 p-2 border border-gray-300 rounded-lg"
   />
   <button
     onClick={sendMessage}
     className="px-4 py-2 bg-green-500 text-white rounded-lg"
   >
     Envoyer
   </button>
 </div>
 </div>

    </div> */}



    // {isCodeSent && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //       <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
    //         <div className="text-center">
    //           <h3 className="text-2xl font-bold text-gray-900 mb-4">
    //             Vérification du compte
    //           </h3>
    //           <p className="text-gray-600 mb-6">
    //             Veuillez entrer le code à 4 chiffres envoyé à votre adresse email
    //           </p>
              
    //           <div className="flex justify-center gap-4 mb-6">
    //             {[0, 1, 2, 3].map((index) => (
    //               <input
    //                 key={index}
    //                 ref={digitRefs[index]}
    //                 type="text"
    //                 maxLength={1}
    //                 value={verificationDigits[index]}
    //                 onChange={(e) => handleDigitChange(index, e.target.value)}
    //                 onKeyDown={(e) => handleKeyDown(index, e)}
    //                 className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
    //               />
    //             ))}
    //           </div>
    //           <div className="space-y-4">
    //             <button
    //               onClick={verifyCode}
    //               disabled={verificationDigits.some(digit => digit === '')}
    //               className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
    //             >
    //               Vérifier le code
    //             </button>
                
    //             <p className="text-sm text-gray-500">
    //               Vous n'avez pas reçu le code ? 
    //               <button 
    //                 onClick={() => {
    //                   const newCode = generateVerificationCode();
    //                   setGeneratedCode(newCode);
    //                   sendVerificationEmail(email, newCode);
    //                 }}
    //                 className="text-green-600 hover:text-green-700 ml-1 font-medium"
    //               >
    //                 Renvoyer
    //               </button>
    //             </p>
    //           </div>
      
    //           <div className="mt-4 text-sm text-gray-500">
    //             Le code expirera dans <span className="font-medium">05:00</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
      