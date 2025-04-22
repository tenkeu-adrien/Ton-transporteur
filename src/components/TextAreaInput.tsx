import { useState, useRef, useEffect } from 'react';

interface SpellCheckError {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
}

export function SpellCheckTextarea({
  value,
  onChange,
  onKeyDown,
  placeholder,
  sendMessage,
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  sendMessage: () => void;
}) {
  const [errors, setErrors] = useState<SpellCheckError[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Fonction pour vérifier l'orthographe
  const checkSpelling = async () => {
    if (!value.trim()) {
      setErrors([]);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: value,
          language: 'fr',
        }),
      });
      const data = await response.json();
      setErrors(data.matches || []);
    } catch (error) {
      console.error('Erreur de vérification orthographique:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Vérifier l'orthographe après un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      checkSpelling();
    }, 1000); // Délai de 1 seconde après le dernier changement

    return () => clearTimeout(timer);
  }, [value]);

  // Appliquer une correction
  const applyCorrection = (error: SpellCheckError, correction: string) => {
    const start = error.offset;
    const end = start + error.length;
    const correctedText = 
      value.substring(0, start) + 
      correction + 
      value.substring(end);
    
    onChange(correctedText);
    setErrors(errors.filter(e => e !== error));
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
          onKeyDown(e);
        }}
        placeholder={placeholder}
        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm sm:text-base resize-none w-full"
        spellCheck={false} // Désactive la vérification native pour éviter les conflits
      />

      {/* Suggestions de corrections */}
      {errors.length > 0 && (
        <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 absolute z-10 w-full">
          {errors.map((error, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <p className="text-red-600 text-sm">
                {error.message}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {error.replacements.slice(0, 3).map((replacement, i) => (
                  <button
                    key={i}
                    onClick={() => applyCorrection(error, replacement.value)}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition"
                  >
                    {replacement.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Indicateur de vérification */}
      {isChecking && (
        <div className="absolute right-2 bottom-2 text-xs text-gray-500">
          Vérification...
        </div>
      )}
    </div>
  );
}