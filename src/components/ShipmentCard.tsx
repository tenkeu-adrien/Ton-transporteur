"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaRegComments } from "react-icons/fa";

const ShipmentCard = ({ shipment, handleClick, handleCancelShipment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
  
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform transition-transform cursor-pointer">
        {/* Contenu de la carte */}
        <div className="flex">
          {/* Image du colis */}
          <div className="w-1/3 h-48 bg-gray-200 relative">
            <Image
              src={shipment.images[0] || "https://via.placeholder.com/400x200"}
              alt="Image du colis"
              className="w-full h-full object-cover"
              width={300}
              height={300}
            />
            <span
              className={`absolute top-2 right-2 px-3 py-1 text-white text-sm rounded ${getStatusColor(
                shipment.status
              )}`}
            >
              {shipment.status}
            </span>
          </div>
  
          {/* Informations du colis */}
          <div className="w-2/3 p-4">
            <Link className="text-xl font-semibold mb-2 block" href={`/colis/${shipment.id}`}>
              {shipment.objectName}
            </Link>
            <div className="space-y-2 text-gray-600">
              {/* ... (le reste des informations du colis) ... */}
            </div>
          </div>
        </div>
  
        {/* Boutons Discuter & Annuler */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Bouton Discuter */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClick(shipment.id);
              }}
              className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-lg shadow hover:bg-green-600 transition duration-300 relative"
            >
              <FaRegComments className="w-4 h-4" />
              <span>Discuter</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>
  
            {/* Bouton Annuler l'offre */}
            <button
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600 transition duration-300"
            >
              Annuler l&apos;offre
            </button>
          </div>
  
          {/* Modale d'annulation */}
          {isModalOpen && (
            <div 
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(false);
              }}
            >
              <div 
                className="bg-white p-5 rounded-lg shadow-lg w-80"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-3">Pourquoi annuler l'offre ?</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`cancelReason-${shipment.id}`}
                      value="client_annulation"
                      onChange={(e) => {  
                        e.preventDefault();
                        e.stopPropagation();
                        setCancelReason(e.target.value);
                      }}
                      className="form-radio"
                    />
                    <span>Le client a décidé d'annuler le transport</span>
                  </label>
  
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`cancelReason-${shipment.id}`}
                      value="transporteur_annulation"
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCancelReason(e.target.value);
                      }}
                      className="form-radio"
                    />
                    <span>Le transporteur a décidé d'annuler la livraison</span>
                  </label>
                </div>
  
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={(e) => {  
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalOpen(false);
                    }}
                    className="bg-gray-300 px-3 py-1 rounded-lg text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelShipment(shipment.id, cancelReason);
                      setIsModalOpen(false);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };