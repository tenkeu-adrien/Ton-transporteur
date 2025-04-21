// "use client"

// import { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap} from "react-leaflet";

// // Fonction pour recentrer la carte et ajuster le zoom
// const RecenterMap = ({ from, to }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (from && to) {
//       // Définir les limites de la carte pour inclure les deux points
//       const bounds = [
//         [from.lat, from.lon], // Point de départ
//         [to.lat, to.lon],    // Point d'arrivée
//       ];
//       map.fitBounds(bounds, { padding: [50, 50] }); // Ajuster la carte avec un padding
//     }
//   }, [from, to, map]);

//   return null;
// };

// // Fonction pour récupérer la distance et la durée du trajet avec Geoapify
// const fetchRouteInfo = async (from, to, setDistance, setDuration) => {
//   const apiKey = "5e00291885f84efeb6c5c57d1103c4fa";
//   const url = `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lon}|${to.lat},${to.lon}&mode=truck&apiKey=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.features && data.features.length > 0) {
//       const route = data.features[0].properties;
//       setDistance(route.distance / 1000); // Convertir en km
//       setDuration(route.time / 60); // Convertir en minutes
//     }
//   } catch (error) {
//     // console.error("Erreur lors de la récupération des données de route :", error);
//   }
// };

// const MapWithRoute = ({ from, to }) => {
//   const [distance, setDistance] = useState<number | null>(null);
//   const [duration, setDuration] = useState<number | null>(null);
// // console.log("from distance" ,distance ,'to' ,duration);

//   useEffect(() => {
//     if (from && to) {
//         // console.log("FROM ET TO EXISTE ",from ,to)
//       fetchRouteInfo(from, to, setDistance, setDuration);
//     }
//   }, [from, to]);

//   if (!from || !to || !from.lat || !from.lon || !to.lat || !to.lon) {
//     return <p>Veuillez sélectionner des adresses valides.</p>;
//   }

//   // Calculer le centre initial de la carte
//   const center = [(from.lat + to.lat) / 2, (from.lon + to.lon) / 2];

//   return (
//     <MapContainer 
//       style={{ height: "600px", width: "100%" }}
//       center={center} // Centre initial de la carte
//       scrollWheelZoom={true} // Permettre le zoom avec la molette
//     >
//       <RecenterMap from={from} to={to} /> {/* Ajuster dynamiquement le centre et le zoom */}
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//       <Marker position={[from.lat, from.lon]}>
//         <Popup>Départ : {from.address_line1}</Popup>
//       </Marker>

//       <Marker position={[to.lat, to.lon]}>
//         <Popup>Destination : {to.address_line1}</Popup>
//       </Marker>

//       <Polyline 
//         positions={[[from.lat, from.lon], [to.lat, to.lon]]} 
//         pathOptions={{ color: "blue", weight: 5, opacity: 0.7, dashArray: "10, 5" }} 
//       />

// {distance !== null && duration !== null && (
//         <Popup position={[(from.lat + to.lat) / 2, (from.lon + to.lon) / 2]}>
//           <div>
//             <p><strong>Distance :</strong> {distance.toFixed(2)} km</p>
//             <p><strong>Temps estimé :</strong> {duration.toFixed(1)} min en camion 🚛</p>
//           </div>
//         </Popup>
//       )}
//     </MapContainer>
//   );
// };

// export default MapWithRoute;




// "use client";

// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";

// // Charger les composants Leaflet dynamiquement
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );
// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );
// const Popup = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Popup),
//   { ssr: false }
// );
// const Polyline = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Polyline),
//   { ssr: false }
// );
// const useMap = dynamic(
//   () => import("react-leaflet").then((mod) => mod.useMap),
//   { ssr: false }
// );

// // Fonction pour recentrer la carte
// const RecenterMap = ({ from, to }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (from && to && map) {
//       const bounds = [
//         [from.lat, from.lon],
//         [to.lat, to.lon],
//       ];
//       map.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [from, to, map]);

//   return null;
// };

// const MapWithRoute = ({ from, to }) => {
//   const [distance, setDistance] = useState<number | null>(null);
//   const [duration, setDuration] = useState<number | null>(null);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//     if (from && to) {
//       fetchRouteInfo(from, to, setDistance, setDuration);
//     }
//   }, [from, to]);

//   if (!isClient || !from || !to || !from.lat || !from.lon || !to.lat || !to.lon) {
//     return <p>Chargement de la carte...</p>;
//   }

//   const center = [(from.lat + to.lat) / 2, (from.lon + to.lon) / 2];

//   return (
//     <MapContainer 
//       style={{ height: "400px", width: "100%" }}
//       center={center}
//       zoom={13}
//       scrollWheelZoom={true}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Marker position={[from.lat, from.lon]}>
//         <Popup>Départ : {from.address_line1}</Popup>
//       </Marker>
//       <Marker position={[to.lat, to.lon]}>
//         <Popup>Destination : {to.address_line1}</Popup>
//       </Marker>
//       <Polyline
//         positions={[[from.lat, from.lon], [to.lat, to.lon]]}
//         pathOptions={{ color: "blue", weight: 5, opacity: 0.7, dashArray: "10, 5" }}
//       />
//       {distance !== null && duration !== null && (
//         <Popup position={[(from.lat + to.lat) / 2, (from.lon + to.lon) / 2]}>
//           <div>
//             <p><strong>Distance :</strong> {distance.toFixed(2)} km</p>
//             <p><strong>Temps estimé :</strong> {duration.toFixed(1)} min en camion 🚛</p>
//           </div>
//         </Popup>
//       )}
//       <RecenterMap from={from} to={to} />
//     </MapContainer>
//   );
// };

// export default MapWithRoute;

// const fetchRouteInfo = async (from, to, setDistance, setDuration) => {
//   const apiKey = "5e00291885f84efeb6c5c57d1103c4fa";
//   const url = `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lon}|${to.lat},${to.lon}&mode=truck&apiKey=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.features && data.features.length > 0) {
//       const route = data.features[0].properties;
//       setDistance(route.distance / 1000); // Convertir en km
//       setDuration(route.time / 60); // Convertir en minutes
//     }
//   } catch (error) {
//     // console.error("Erreur lors de la récupération des données de route :", error);
//   }
// };

"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, Tooltip } from "react-leaflet";
import L from "leaflet";

// Configuration des icônes personnalisées
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Fonction pour recentrer la carte
const RecenterMap = ({ from, to }: { from: any, to: any }) => {
  const map = useMap();

  useEffect(() => {
    if (from && to) {
      const bounds = L.latLngBounds(
        [from.lat, from.lon],
        [to.lat, to.lon]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [from, to, map]);

  return null;
};

// Fonction pour obtenir une route réaliste avec OpenRouteService
const fetchRealisticRoute = async (from: any, to: any) => {
  try {
    // Utilisation d'un service alternatif si OpenRouteService n'est pas disponible
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    }
  } catch (error) {
    console.error("Error fetching realistic route:", error);
    // Retourner une ligne droite en cas d'erreur
    return [[from.lat, from.lon], [to.lat, to.lon]];
  }
};

const MapWithRoute = ({ from, to }: { from: any, to: any }) => {
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [isRouteLoaded, setIsRouteLoaded] = useState(false);

  useEffect(() => {
    if (from && to) {
      setIsRouteLoaded(false);
      fetchRealisticRoute(from, to).then(coords => {
        setRouteCoords(coords);
        setIsRouteLoaded(true);
      });
      
      fetchRouteInfo(from, to, setDistance, setDuration);
    }
  }, [from, to]);

  if (!from || !to || !from.lat || !from.lon || !to.lat || !to.lon) {
    return <p>Veuillez sélectionner des adresses valides.</p>;
  }

  const center = [(from.lat + to.lat) / 2, (from.lon + to.lon) / 2];

  return (
    <div style={{ position: 'relative', height: '600px', width: '100%' }}>
      <MapContainer 
        style={{ height: "100%", width: "100%" }}
        center={center}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[from.lat, from.lon]} icon={createCustomIcon('red')}>
          <Popup>
            <div>
              <strong>Départ:</strong> {from.address_line1}
            </div>
          </Popup>
        </Marker>

        <Marker position={[to.lat, to.lon]} icon={createCustomIcon('green')}>
          <Popup>
            <div>
              <strong>Destination:</strong> {to.address_line1}
            </div>
          </Popup>
        </Marker>

        {isRouteLoaded && routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            pathOptions={{ 
              color: "blue", 
              weight: 5, 
              opacity: 0.7,
              dashArray: routeCoords.length > 2 ? undefined : "10, 5"
            }}
            eventHandlers={{
              click: () => setShowInfo(true)
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
              Cliquez sur la ligne pour les détails
            </Tooltip>
          </Polyline>
        )}

        <RecenterMap from={from} to={to} />
      </MapContainer>

      {showInfo && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          maxWidth: '300px'
        }}>
          <button 
            onClick={() => setShowInfo(false)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
          <h3 style={{ marginTop: 0 }}>Informations sur le trajet</h3>
          {distance !== null && (
            <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
          )}
          {duration !== null && (
            <p><strong>Durée estimée:</strong> {duration.toFixed(1)} min</p>
          )}
          <p><strong>Point de départ:</strong> {from.address_line1}</p>
          <p><strong>Destination:</strong> {to.address_line1}</p>
        </div>
      )}
    </div>
  );
};

// Fonction simplifiée pour récupérer les infos de route
const fetchRouteInfo = async (from: any, to: any, setDistance: any, setDuration: any) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`
    );
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      setDistance(route.distance / 1000); // Convertir en km
      setDuration(route.duration / 60); // Convertir en minutes
    }
  } catch (error) {
    console.error("Error fetching route info:", error);
  }
};

export default MapWithRoute;