"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaSpinner } from "react-icons/fa";
import * as z from "zod";

// 🛠️ Définition du schéma de validation avec Zod
const shipmentSchema = z.object({
  objectName: z.string().min(2, "Le nom de l'objet est trop court"),
  deliveryAddress: z.string().min(3, "L'adresse de livraison est requise"),
  pickupAddress: z.string().min(3, "L'adresse de départ est requise"),
  price: z.number().positive("Le prix doit être un nombre positif"),
  quantity: z.number().min(1, "La quantité doit être au moins 1"),
  width: z.number().positive("La largeur doit être un nombre positif"),
  height: z.number().positive("La hauteur doit être un nombre positif"),
  weight: z.string().nonempty("Veuillez sélectionner un poids"),

});

// 🛠️ Typage des props
interface EditModalProps {
  shipment: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const EditModal = ({ shipment, onClose, onSave }: EditModalProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof shipmentSchema>>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: { ...shipment },
  });

  const onSubmit = async (data: z.infer<typeof shipmentSchema>) => {
    await onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Modifier le colis</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom de l'objet */}
          <div>
            <label htmlFor="objectName" className="block text-sm font-medium mb-1">
              Nom de l'objet
            </label>
            <input
              type="text"
              id="objectName"
              {...register("objectName")}
              className="w-full p-2 border border-gray-300 rounded"
              aria-invalid={errors.objectName ? "true" : "false"}
            />
            {errors.objectName && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.objectName.message}
              </p>
            )}
          </div>

          {/* Adresse de livraison */}
          <div>
            <label htmlFor="deliveryAddress" className="block text-sm font-medium mb-1">
              Adresse de livraison
            </label>
            <input
              type="text"
              id="deliveryAddress"
              {...register("deliveryAddress")}
              className="w-full p-2 border border-gray-300 rounded"
              aria-invalid={errors.deliveryAddress ? "true" : "false"}
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.deliveryAddress.message}
              </p>
            )}
          </div>

          {/* Adresse de départ */}
          <div>
            <label htmlFor="pickupAddress" className="block text-sm font-medium mb-1">
              Adresse de départ
            </label>
            <input
              type="text"
              id="pickupAddress"
              {...register("pickupAddress")}
              className="w-full p-2 border border-gray-300 rounded"
              aria-invalid={errors.pickupAddress ? "true" : "false"}
            />
            {errors.pickupAddress && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.pickupAddress.message}
              </p>
            )}
          </div>

          {/* Prix */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Prix de l'expédition
            </label>
            <input
              type="number"
              id="price"
              {...register("price", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded"
              aria-invalid={errors.price ? "true" : "false"}
            />
            {errors.price && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Quantité */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              {...register("quantity", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded"
              aria-invalid={errors.quantity ? "true" : "false"}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Largeur */}
          <div>
            <label htmlFor="width" className="block text-sm font-medium mb-1">
              Largeur (cm)
            </label>
            <input
              type="number"
              id="width"
              {...register("width", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded"
              aria-invalid={errors.width ? "true" : "false"}
            />
            {errors.width && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.width.message}
              </p>
            )}
          </div>

          {/* Hauteur */}
          <div>
            <label htmlFor="height" className="block text-sm font-medium mb-1">
              Hauteur (cm)
            </label>
            <input
              type="number"
              id="height"
              {...register("height", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded"
              aria-invalid={errors.height ? "true" : "false"}
            />
            {errors.height && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.height.message}
              </p>
            )}
          </div>

          {/* Poids */}
          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-1">
              Poids
            </label>
            <select
              id="weight"
              {...register("weight")}
              className="w-full p-3 border border-gray-300 rounded-lg"
              aria-invalid={errors.weight ? "true" : "false"}
            >
              <option value="">Sélectionnez le poids</option>
              <option value="-7kg">-7kg</option>
              <option value="7kg-25kg">7kg à 25kg</option>
              <option value="25kg-90kg">25kg à 90kg</option>
              <option value="90kg-105kg">90kg à 105kg</option>
              <option value="+105kg">+105kg</option>
            </select>
            {errors.weight && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.weight.message}
              </p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:bg-green-300"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Soumission en cours...
                </>
              ) : (
                "Soumettre"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;