import { FaComment } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ChatButtonProps {
  recipientId: string;
  className?: string;
}

export const ChatButton = ({ recipientId, className = "" }: ChatButtonProps) => {
  const router = useRouter();

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="relative group">
        {/* Bouton de chat */}
        <button
          onClick={() => router.push(`/chat/${recipientId}`)}
          className="flex items-center gap-2 p-3 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-lg"
        >
          <FaComment size={24} />
        </button>

        {/* Tooltip (boîte de dialogue au survol) */}
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Discuter avec le transporteur
        </span>
      </div>
    </div>
  );
};

// Utilisation:
// <ChatButton recipientId="ID_UTILISATEUR" />
