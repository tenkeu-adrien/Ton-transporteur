import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_KEY = '5e00291885f84efeb6c5c57d1103c4fa';

const AddressAutocomplete = ({ onSelectAddress }: { onSelectAddress: (address: any) => void }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchAddressSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        {
          params: {
            text: searchQuery,
            apiKey: API_KEY,
            lang: 'fr',
            limit: 13, // Augmenté à 5 pour avoir plus de résultats
            type: 'amenity',
            filter: 'countrycode:de,fr,es,it,be,nl,lu,ch,at,pt,pl,uk,ie,dk,se,fi,no'
          }
        }
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions :', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Débounce de 300ms pour éviter trop de requêtes
    timeoutRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);
  };

  const handleSelectAddress = (address: any) => {
    const formattedAddress = address.properties.address_line1 + 
      (address.properties.address_line2 ? ', ' + address.properties.address_line2 : '');
    setQuery(formattedAddress);
    setSuggestions([]);
    onSelectAddress(address);
  };

  const handleBlur = () => {
    // Petit délai pour permettre le clic sur une suggestion
    setTimeout(() => {
      setIsFocused(false);
      setSuggestions([]);
    }, 200);
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder="Ex: 12 Rue de la Paix, Paris, France"
        className="w-full text-base border border-green-300 focus:outline-none focus:ring-green-500 focus:border-green-500 p-3 rounded-lg focus:ring-2"
      />
      {isLoading && (
        <div className="absolute top-full left-0 right-0 border border-gray-300 rounded-md bg-white z-50 shadow-lg p-2">
          Chargement...
        </div>
      )}
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 max-h-60 overflow-y-auto border border-gray-300 rounded-md bg-white z-50 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectAddress(suggestion)}
              className="p-2.5 cursor-pointer hover:bg-gray-100 transition-colors border-b last:border-b-0"
            >
              <div className="font-medium">
                {suggestion.properties.address_line1}
                {suggestion.properties.address_line2 && `, ${suggestion.properties.address_line2}`}
              </div>
              <div className="text-sm text-gray-600">
                {suggestion.properties.postcode} {suggestion.properties.city}, {suggestion.properties.country}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AddressAutocomplete;