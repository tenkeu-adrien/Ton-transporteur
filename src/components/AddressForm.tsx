// import { useState } from 'react';
// import axios from 'axios';

// const API_KEY = '5e00291885f84efeb6c5c57d1103c4fa'; // Remplacez par votre clé API Geoapify

// const AddressAutocomplete = ({ onSelectAddress }) => {
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState([]);

//   // Fonction pour récupérer les suggestions d'adresses
//   const fetchAddressSuggestions = async (searchQuery) => {
//     try {
//       const response = await axios.get(
//         `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&apiKey=${API_KEY}`
//       );
//       setSuggestions(response.data.features);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des suggestions :', error);
//     }
//   };

//   // Gérer la saisie de l'utilisateur
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setQuery(value);
//     if (value.length > 2) {
//       fetchAddressSuggestions(value);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   // Gérer la sélection d'une adresse
//   const handleSelectAddress = (address) => {
//     setQuery(address.properties.formatted);
//     setSuggestions([]);
//     onSelectAddress(address); // Passer l'adresse sélectionnée au parent
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={handleInputChange}
//         placeholder="Entrez une adresse"
//       />
//       <ul>
//         {suggestions.map((suggestion, index) => (
//           <li key={index} onClick={() => handleSelectAddress(suggestion)} style={{ cursor: 'pointer' }}>
//             {suggestion.properties.formatted}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AddressAutocomplete;








import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_KEY = '5e00291885f84efeb6c5c57d1103c4fa'; // Remplacez par votre clé API Geoapify

const AddressAutocomplete = ({ onSelectAddress }: { onSelectAddress: (address: any) => void }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false); // Pour savoir si le champ est focus
  const containerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur

  // Fonction pour récupérer les suggestions d'adresses
  const fetchAddressSuggestions = async (searchQuery: string) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&apiKey=${API_KEY}&lang=fr`
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions :', error);
    }
  };

  // Gérer la saisie de l'utilisateur
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      fetchAddressSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  // Gérer la sélection d'une adresse
  const handleSelectAddress = (address: any) => {
    setQuery(address.properties.formatted);
    setSuggestions([]);
    onSelectAddress(address); // Passer l'adresse sélectionnée au parent
  };

  // Masquer les suggestions lorsque l'utilisateur clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]); // Masquer les suggestions
        setIsFocused(false); // Retirer le focus
      }
    };

    // Ajouter l'écouteur d'événement
    document.addEventListener('mousedown', handleClickOutside);

    // Nettoyer l'écouteur d'événement
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)} // Activer le focus
        placeholder="Ex:1231 Buenos Aires, Argentine"
        className="w-full  text-base border border-green-300  focus:outline-none focus:ring-green-500 focus:border-green-500  p-3  rounded-lg focus:ring-2"
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white z-50 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectAddress(suggestion)}
              className="p-2.5 cursor-pointer hover:bg-gray-100 transition-colors border-b last:border-b-0"
              onMouseEnter={(e) => {
                const target = e.target as HTMLLIElement;
                target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLLIElement;
                target.style.backgroundColor = '#fff';
              }}
            >
              {suggestion.properties.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;