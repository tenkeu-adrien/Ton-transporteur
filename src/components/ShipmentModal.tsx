"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import PhoneLink from "./PhoneLink";

const ShipmentModal = ({ shipment, onClose }) => {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold">Détails du Colis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Carrousel d'images */}
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="my-4 rounded-lg overflow-hidden"
        >
          {shipment.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`Image ${index + 1}`} className="w-full h-64 object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Informations */}
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Départ :</span>
            <span className="font-bold text-gray-900">{shipment.pickupAddress}</span>
          </div>

          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Arrivée :</span>
            <span className="font-bold text-gray-900">{shipment.deliveryAddress}</span>
          </div>

          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Prix :</span>
            <span className="font-bold text-orange-600">{shipment.price} XOF</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Nom de l'objet</p>
              <p className="font-medium">{shipment.objectName}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Poids</p>
              <p className="font-medium">{shipment.weight}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Quantité</p>
              <p className="font-medium">{shipment.quantity}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Étage</p>
              <p className="font-medium">{shipment.floor}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
              <p className="text-sm text-gray-600">Type de prise en charge</p>
              <p className="font-medium">{shipment.pickupType}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
             <PhoneLink phoneNumber={shipment.phoneNumber} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium 
              ${shipment.status === "En attente" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}
            `}>
              {shipment.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Fermer</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShipmentModal;
