import { FaBicycle, FaCouch, FaPalette, FaBoxOpen, FaLaptop, FaWineBottle, FaGuitar, FaSuitcase } from "react-icons/fa";

 export const PopularPackages = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 rounded-2xl">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold  mb-12  ">Colis les plus envoyés</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {/* Vélos */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaBicycle className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">Vélos</p>
          </div>

          {/* Canapés */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaCouch className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">Canapés</p>
          </div>

          {/* Objets d'art */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaPalette className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">Objets d'art</p>
          </div>

          {/* Colis standards */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaBoxOpen className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">Colis standards</p>
          </div>

          {/* Électronique */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaLaptop className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">Électronique</p>
          </div>

          {/* Vins */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaWineBottle className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">Vins</p>
          </div>

          {/* Instruments */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaGuitar className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">Instruments</p>
          </div>

          {/* Bagages */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaSuitcase className="h-10 w-10 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">Bagages</p>
          </div>
        </div>
      </div>
    </div>
  );
};