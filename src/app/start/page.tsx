"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiFillDelete, AiTwotoneCamera } from 'react-icons/ai';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';
import { auth, db, storage } from '../../../lib/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import AddressAutocomplete from '@/components/AddressForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthContext } from '../../../context/AuthContext';
import imageCompression from 'browser-image-compression';

// import { sendNotificationToAdmin } from '../../../helpers';
const formSchema = z.object({
  objectName: z.string().min(1, "Le nom de l'objet est requis"),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, "La quantité doit être au moins 1")),
  weight: z.string().min(1, "Le poids est requis"),
  size: z.string().optional(),
  additionalInfo: z.string().optional(),
  knowsDimensions: z.boolean(),
  length: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
  width: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
  height: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
  images: z.array(z.any()).max(4, "Vous ne pouvez télécharger que 4 images maximum.").optional(),
  pickupAddress: z.string().min(1, "L'adresse d'enlèvement est requise"),
  pickupType: z.string().min(1, "Le type d'enlèvement est requis"),
  deliveryAddress: z.string().min(1, "L'adresse de livraison est requise"),
  pickupDate: z.preprocess(
    (val) => (typeof val === "string" || typeof val === "number" ? new Date(val) : val),
    z.date().refine((date) => !isNaN(date.getTime()), { message: "La date d'enlèvement est requise" })
  ),
  deliveryDate: z.preprocess(
    (val) => (typeof val === "string" || typeof val === "number" ? new Date(val) : val),
    z.date().refine((date) => !isNaN(date.getTime()), { message: "La date de dépôt est requise" })
  ),
  floor: z.string().optional(),
  access: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(10, "Le prix doit être d'au moins 200€")),
});

const compressImage = async (image) => {
  const options = {
    maxSizeMB: 1, // Taille maximale de l'image après compression
    maxWidthOrHeight: 1024, // Résolution maximale
    useWebWorker: true, // Utiliser un thread séparé pour la compression
  };
  return await imageCompression(image, options);
};


export default function ExpeditionSystem() {
  const { register,  control ,handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowsDimensions: false,
      images: [],
    },
  }); 
   const router =useRouter()
  const user = auth.currentUser

 useEffect(()=>{
  if (!user) {
    toast.info("vous n'avez pas connecter fait le ou creer un compte")
    router.replace('/auth/signin')
}
 } ,[])
  const [step, setStep] = useState(1);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {userData, loading, error  ,logout} = useContext(AuthContext);

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['objectName', 'quantity', 'weight', 'size'],
      2: ['pickupAddress', 'pickupType' ,'pickupDate' ,'departure'],
      3: ['deliveryDate', 'pickupType' ,'deliveryAddress' ,'destination'],
      4: ['price'],
    };

    const isValid = await trigger(fieldsToValidate[step]);
    if (isValid && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentImages = watch('images') || [];
    const updatedImages = [...currentImages, ...files];
    setValue('images', updatedImages);
  };

  const handleDeleteImage = (index) => {
    const currentImages = watch('images') || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setValue('images', updatedImages);
  };

  const onSubmitData = async (data) => {
  
console.log("data de l'envoie" ,data)
  setIsSubmitting(true);
    toast.success("Traitement en cours...");
    try {
      // Compresser les images
      const compressedImages = await Promise.all(
        data.images.map(async (image) => compressImage(image))
      );
  
      // Télécharger les images en parallèle
      const imageUrls = await Promise.all(
        compressedImages.map(async (image) => {
          const storageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );
  
      // Préparer les données pour Firestore
      const expeditionData = {
        ...data,
        expediteurId: user?.uid,
        status: "En attente",
        images: imageUrls,
        createdAt: new Date(),
        departure: {
          address: departure.address_line1,
          coordinates: { lat: departure.lat, lon: departure.lon },
        },
        destination: {
          address: destination.address_line1,
          coordinates: { lat: destination.lat, lon: destination.lon },
        },
      };
  
      // Enregistrer dans Firestore
      const docRef = await addDoc(collection(db, "shipments"), expeditionData);
      expeditionData.id = docRef.id;
  
      // Rediriger l'utilisateur
      toast.success("Colis ajouté avec succès");
      setIsSubmitting(false)
      router.push("/mes-colis");
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };
  const [departure, setDeparture] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);

  // const onSubmitData = async (data) => {
  //   setIsSubmitting(true); // Activer l'état de chargement
  //   try {
  //     // Télécharger les images et récupérer les URLs
  //     const imageUrls = await Promise.all(
  //       data.images.map(async (image) => {
  //         const storageRef = ref(storage, `images/${image.name}`);
  //         await uploadBytes(storageRef, image);
  //         return getDownloadURL(storageRef);
  //       })
  //     );
  
  //     // Ajouter l'ID de l'expéditeur et les données géographiques
  //     const expeditionData = {
  //       ...data,
  //       expediteurId: user?.uid, // ID de l'expéditeur connecté
  //       status: "En attente",
  //       images: imageUrls,
  //       createdAt: new Date(),
  //       departure: {
  //         address: departure.address_line1, // Adresse de départ
  //         coordinates: {
  //           lat: departure.lat,
  //           lon: departure.lon,
  //         },
  //       },
  //       destination: {
  //         address: destination.address_line1, // Adresse de livraison
  //         coordinates: {
  //           lat: destination.lat,
  //           lon: destination.lon,
  //         },
  //       },
  //     };
  
  //     console.log("data ", expeditionData);
  
  //     // Enregistrer l'expédition dans Firestore
  //     const docRef = await addDoc(collection(db, "shipments"), expeditionData);
  //     console.log("Document written with ID: ", docRef.id);
  
  //     // Ajouter l'ID de l'expédition dans les données
  //     expeditionData.id = docRef.id;
  
  //     toast.success("Colis ajouté avec succès");
  //     router.push("/mes-colis")
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //     toast.error("Une erreur s'est produite lors de la soumission");
  //   } finally {
  //     setIsSubmitting(false); // Désactiver l'état de chargement
  //   }
  // };


  // const onSubmitData = async (data) => {
  //   setIsSubmitting(true);
  //   toast.success("Traitement en cours...");
  
  //   try {
  //     // Compresser les images
  //     const compressedImages = await Promise.all(
  //       data.images.map(async (image) => compressImage(image))
  //     );
  
  //     // Télécharger les images en parallèle
  //     const imageUrls = await Promise.all(
  //       compressedImages.map(async (image) => {
  //         const storageRef = ref(storage, `images/${image.name}`);
  //         await uploadBytes(storageRef, image);
  //         return getDownloadURL(storageRef);
  //       })
  //     );
  
  //     // Préparer les données pour Firestore
  //     const expeditionData = {
  //       ...data,
  //       expediteurId: user?.uid,
  //       status: "En attente",
  //       images: imageUrls,
  //       createdAt: new Date(),
  //       departure: {
  //         address: departure.address_line1,
  //         coordinates: { lat: departure.lat, lon: departure.lon },
  //       },
  //       destination: {
  //         address: destination.address_line1,
  //         coordinates: { lat: destination.lat, lon: destination.lon },
  //       },
  //     };
  
  //     // Enregistrer dans Firestore
  //     const docRef = await addDoc(collection(db, "shipments"), expeditionData);
  //     expeditionData.id = docRef.id;
  
  //     // Rediriger l'utilisateur
  //     toast.success("Colis ajouté avec succès");
  //     router.push("/mes-colis");
  //   } catch (error) {
  //     console.error("Error: ", error);
  //     toast.error("Une erreur s'est produite");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };





  return (
    <>
      {/* <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/Accueil" className="text-2xl font-bold text-green-600">MoveColis</a>
          <div className="space-x-4">
            <a href="#" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Déconnexion</a>
          </div>
        </div>
      </nav> */}

      <Navbar   user={user} logout={logout}  />
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6 pt-20">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Système d&apos;Expédition</h1>
          <form onSubmit={handleSubmit(onSubmitData)}>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-green-700">
                <span>Étape {step} sur 4</span>
                <span>{Math.round((step / 4) * 100)}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(step / 4) * 100}%` }}></div>
              </div>
            </div>

            <div className="mb-6 space-y-6 control">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">1. Décrivez votre colis</h2>
                  <label htmlFor="">Nom de l'object</label>
                  <input
                    type="text"
                    {...register('objectName')}
                    placeholder="Nom de l'objet"
                    className="w-full p-3 border border-green-300 rounded-lg mb-4"
                  />
                  {errors.objectName && <p className="text-red-500">{errors.objectName.message}</p>}
                <label htmlFor="quantity">Quantité</label>
                  <input
                    type="number"
                    {...register('quantity', { valueAsNumber: true })}
                    placeholder="Quantité"
                    className="w-full p-3 border border-green-300 rounded-lg mb-4"
                  />
                  {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
                <label htmlFor="poids">poids de l'object</label>
                  <select {...register('weight')} className="w-full p-3 border border-green-300 rounded-lg mb-4">
                    <option value="">Sélectionnez le poids</option>
                    <option value="-7kg">-7kg</option>
                    <option value="7kg-25kg">7kg à 25kg</option>
                    <option value="25kg-90kg">25kg à 90kg</option>
                    <option value="90kg-105kg">90kg à 105kg</option>
                    <option value="+105kg">+105kg</option>
                  </select>
                  {errors.weight && <p className="text-red-500">{errors.weight.message}</p>}
<label htmlFor="">Taille de l'object</label>
                  <select
                    {...register('size')}
                    className="w-full p-3 border border-green-300 rounded-lg mb-4"
                  >
                    <option value="">Sélectionnez la taille</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                  {errors.size && <p className="text-red-500">{errors.size.message}</p>}
                  <label htmlFor="">Autre informations sur l'object</label>
                  <textarea
                    {...register('additionalInfo')}
                    placeholder="Ex: le canapé est en cuir"
                    className="w-full p-3 border border-green-300 rounded-lg mb-4"
                    rows={3}
                  />

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      {...register('knowsDimensions')}
                      className="mr-2"
                    />
                    <label className="text-green-700">Je connais les dimensions de l&apos;objet</label>
                  </div>

                  {watch('knowsDimensions') && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <input
                        type="number"
                        {...register('length', { valueAsNumber: true })}
                        placeholder="Longueur (cm)"
                        className="w-full p-3 border border-green-300 rounded-lg"
                      />
                      <input
                        type="number"
                        {...register('width', { valueAsNumber: true })}
                        placeholder="Largeur (cm)"
                        className="w-full p-3 border border-green-300 rounded-lg"
                      />
                      <input
                        type="number"
                        {...register('height', { valueAsNumber: true })}
                        placeholder="Hauteur (cm)"
                        className="w-full p-3 border border-green-300 rounded-lg"
                      />
                    </div>
                  )}

                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 h-40 flex items-center justify-center cursor-pointer"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg, image/gif"
                      className="hidden"
                      id="image-upload"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center">
                      <AiTwotoneCamera className="text-[65px] mb-2" />
                      <label htmlFor="image-upload" className="text-green-700 cursor-pointer">
                        Ajouter les photos
                      </label>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">Jusqu&apos;à 4 photos, formats PNG, JPG, GIF, taille max 6 MB</p>
                  {errors.images && <p className="text-red-500">{errors.images.message}</p>}
                  {watch('images')?.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {watch('images').map((image, index) => (
                        <div key={index} className="relative w-full h-24 rounded-lg">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Objet ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            width={80}
                            height={80}
                          />
                          <button
                            onClick={() => handleDeleteImage(index)}
                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                          >
                            <AiFillDelete className="text-lg" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">2.Enlèvement</h2>
                  <label htmlFor="">Date  </label>
                  <Controller
        name="pickupDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            placeholderText="Date d'enlèvement"
            className="w-full p-3 border border-green-300 rounded-lg mb-4"
            dateFormat="dd/MM/yyyy"
          />
        )}
      />

{errors.pickupDate && <p className="text-red-500">{errors.pickupDate.message}</p>}
                 
    <div className="mb-4"
    >
       <label htmlFor="">Address</label>
      <AddressAutocomplete
  onSelectAddress={(address) => {
    setValue('pickupAddress', address.properties.formatted); // Mettre à jour l'adresse de départ
    setDeparture({
      lat: address.properties.lat,
      lon: address.properties.lon,
      address_line1: address.properties.formatted,
    });
  }}
/>
{errors.pickupAddress && <p className="text-red-500">{errors.pickupAddress.message}</p>}

</div>

<h5 className="text-xl font-semibold text-green-800 mb-4">Sélectionnez le type d'enlèvement</h5>

                  <select
                    {...register('pickupType')}
                    className="w-full p-3 border border-green-300 rounded-lg mb-4"
                  >
                    <option value="">Sélectionnez le type d&apos;enlèvement</option>
                    <option value="Manutention 1 personne (23€)">Manutention 1 personne (23€)</option>
                    <option value="Manutention 2 personnes (59€)">Manutention 2 personnes (59€)</option>
                    <option value="Au pied du véhicule">Au pied du véhicule</option>
                  </select>
                  {errors.pickupType && <p className="text-red-500">{errors.pickupType.message}</p>}

                  {(watch('pickupType') === 'Manutention 1 personne (23€)' || watch('pickupType') === 'Manutention 2 personnes (59€)') && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <select
                        {...register('floor')}
                        className="w-full p-3 border border-green-300 rounded-lg"
                      >
                        <option value="">Sélectionnez l&apos;étage</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Étage {i + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        {...register('access')}
                        className="w-full p-3 border border-green-300 rounded-lg"
                      >
                        <option value="">Sélectionnez l&apos;accès</option>
                        <option value="Avec ascenseur">Avec ascenseur</option>
                        <option value="Sans ascenseur">Sans ascenseur</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">3. Livraison</h2>
                  <div className="mb-4">
                  <label htmlFor="">Date:  </label>
                  <Controller
        name="deliveryDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            placeholderText="Date de livraison"
            className="w-full p-3 border border-green-300 rounded-lg mb-4"
            dateFormat="dd/MM/yyyy"
          />
        )}
      />
                
                  <AddressAutocomplete
  onSelectAddress={(address) => {
    setValue('deliveryAddress', address.properties.formatted); // Mettre à jour l'adresse de livraison
    setDestination({
      lat: address.properties.lat,
      lon: address.properties.lon,
      address_line1: address.properties.formatted,
    });
  }}
/>
                  {errors.deliveryAddress && <p className="text-red-500">{errors.deliveryAddress.message}</p>}
                  </div>


                  <h5 className="text-xl font-semibold text-green-800 mb-4">Sélectionnez le type de livraison</h5>
                  <select
                    {...register('pickupType')}
                    className="w-full p-3 border border-green-300 rounded-lg mb-4"
                  >
                    <option value="Au pied du véhicule">Au pied du véhicule</option>
                    <option value="Manutention 1 personne (23€)">Manutention 1 personne (23€)</option>
                    <option value="Manutention 2 personnes (59€)">Manutention 2 personnes (59€)</option>
                  </select>
                  {errors.pickupType && <p className="text-red-500">{errors.pickupType.message}</p>}

                  {(watch('pickupType') === 'Manutention 1 personne (23€)' || watch('pickupType') === 'Manutention 2 personnes (59€)') && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <select
                        {...register('floor')}
                        className="w-full p-3 border border-green-300 rounded-lg"
                      >
                        <option value="">Sélectionnez l&apos;étage</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Étage {i + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        {...register('access')}
                        className="w-full p-3 border border-green-300 rounded-lg"
                      >
                        <option value="">Sélectionnez l&apos;accès</option>
                        <option value="Avec ascenseur">Avec ascenseur</option>
                        <option value="Sans ascenseur">Sans ascenseur</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Proposition de prix</h2>
                  <input
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="Proposez un prix"
                    className={`w-full p-3 border rounded-lg mb-4 ${watch('price') < 10 ? 'border-red-500' : 'border-green-300'}`}
                  />
                  {errors.price && <p className="text-red-500">{errors.price.message}</p>}

                  {watch('price') < 10 && (
                    <p className="text-red-500 mb-4">Attention : Il pourrait être difficile de trouver un transporteur à ce prix.</p>
                  )}
                  {watch('price') >= 10 && watch('price') <= 100 && (
                    <p className="text-green-500 mb-4">Ce prix est attractif et encouragera les transporteurs.</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between">
  <button
    type="button"
    onClick={prevStep}
    disabled={step === 1 || isSubmitting}
    className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:bg-green-300"
  >
    Précédent
  </button>
  {step < 4 ? (
    <button
      type="button"
      onClick={nextStep}
      disabled={isSubmitting}
      className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-green-300"
    >
      Suivant
    </button>
  ) : (
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
  )}
</div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}