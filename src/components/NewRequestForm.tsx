import React from "react";

const NewRequestForm = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Description du colis</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ex: Colis fragile"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Point de départ</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ex: Paris"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Point d&apos;arrivée</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ex: Lyon"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prix proposé</label>
          <input
            type="number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ex: 50€"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Publier l&apos;annonce
        </button>
      </form>
    </div>
  );
};

export default NewRequestForm;