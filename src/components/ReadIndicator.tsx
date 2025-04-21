import { FaCheck, FaCheckDouble } from "react-icons/fa";

// Composant pour l'indicateur de lecture
export const ReadIndicator = ({ message, currentUserId }) => {
    const isRead = message.readBy?.includes(currentUserId);
    
    return (
      <div className="flex items-center gap-1">
        {isRead ? (
          <FaCheckDouble className="text-blue-500" />
        ) : (
          <FaCheck className="text-gray-400" />
        )}
      </div>
    );
  };
  
  // Dans votre rendu de message
//   <div className="message-container">
//     {/* ... contenu du message ... */}
//     {isSentByMe && <ReadIndicator message={msg} currentUserId={user?.uid} />}
//   </div>