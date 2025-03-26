"use client"
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUser } from '../../../../lib/functions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../../context/AuthContext';
import Select from "react-select";
import "country-flag-icons/3x2/flags.css"; 
import { FaSpinner } from 'react-icons/fa';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import {auth} from '../../../../lib/firebaseConfig'
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebaseConfig';

const schema = z.object({
  profile: z.string().min(1, "Veuillez sélectionner un profil"),
  role: z.string().min(1, "Veuillez sélectionner un rôle"),
  lastName: z.string().min(1, "Le nom est obligatoire"),
  firstName: z.string().min(1, "Le prénom est obligatoire"),
  email: z.string().min(1, "L'email est obligatoire").email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "La confirmation du mot de passe est obligatoire"),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est obligatoire"),
  terms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions d'utilisation",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});


export default function Register() {
   const [countries, setCountries] = useState([]);
const {setUser}  = useContext(AuthContext)
const [selectedCountry, setSelectedCountry] = useState(null);
const [timeLeft, setTimeLeft] = useState(90); // 5 minutes en secondes 300
const [timerActive, setTimerActive] = useState(true);
   const {
    register,
    handleSubmit,
    setValue, watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Intégrer Zod avec React Hook Form
  });
  const router =useRouter()

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
  
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const { user,logout} = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [verificationDigits, setVerificationDigits] = useState(['', '', '', '']);
  const [email ,setEmail] =useState("null")
const digitRefs = [
  useRef(null),
  useRef(null),
  useRef(null),
  useRef(null)
];

  useEffect(() => {
    if (selectedCountry) {
      setValue("phoneNumber", `${selectedCountry.phoneCode} `);
    }
  }, [selectedCountry, setValue]); // Met à jour quand le pays change
  


  // const onSubmit = async (data) => {

  //   setIsSubmitting(true);
  //   try {
  //     const response = await fetch("/api/register", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Erreur HTTP : ${response.status}   ${response.body}`);
  //   }
  //     const result = await response.json();
  
  //     toast.success("Compte créé avec succès ! Vérifiez votre email.");
  //     router.push("/Dashboard");
  //   } catch (error) {
  //     console.error("Erreur :", error);
  //     toast.error(`Erreur lors de l'inscription : ${error.message}`);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  
    // Fonction pour générer un code à 4 chiffres
    const generateVerificationCode = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };
  

    // Ajoutez cette fonction pour gérer la saisie des chiffres
const handleDigitChange = (index, value) => {
  if (!/^\d*$/.test(value)) return; // Accepte uniquement les chiffres

  const newDigits = [...verificationDigits];
  newDigits[index] = value;
  setVerificationDigits(newDigits);

  // Passer automatiquement à la case suivante
  if (value !== '' && index < 3) {
    digitRefs[index + 1].current.focus();
  }

  // Vérifier si tous les chiffres sont entrés
  if (index === 3 && value !== '') {
    const code = newDigits.join('');
    setVerificationCode(code);
  }
};

// Gérer la touche Backspace
const handleKeyDown = (index, e) => {
  if (e.key === 'Backspace' && verificationDigits[index] === '' && index > 0) {
    digitRefs[index - 1].current.focus();
  }
};
    // Fonction pour envoyer l'email de vérification
    const sendVerificationEmail = async (email, code) => {
      try {
        // Configuration de l'email
        const emailData = {
          to: email,
          subject: "Vérification de votre compte",
          code: code
        };
  
        const response = await fetch("/api/send-verification-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        });
  
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi de l'email");
        }
  
        setIsCodeSent(true);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de l'envoi de l'email de vérification");
      }
    };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // Générer le code de vérification
      const code = generateVerificationCode();
      setGeneratedCode(code);

      // Enregistrer les données utilisateur dans Firestore avec le code de vérification
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profile: data.profile,
        role: data.role,
        verificationCode: code,
        isVerified: false,
        createdAt: serverTimestamp(),
      });

      // Envoyer l'email de vérification
      await sendVerificationEmail(data.email, code);
      
      toast.success("Compte créé ! Veuillez vérifier votre email pour le code de vérification.");
setEmail(data.email)
      
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(`Erreur lors de l'inscription: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Fonction pour vérifier le code
  const verifyCode = async () => {
    if (verificationCode === generatedCode) {
      try {
        // Mettre à jour le statut de vérification dans Firestore
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          isVerified: true
        }, { merge: true });

        toast.success("Compte vérifié avec succès !");
        router.push("/Dashboard");
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        toast.error("Erreur lors de la vérification du compte");
      }
    } else {
      toast.error("Code de vérification incorrect");
    }
  };




useEffect(() => {
  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags");
      const data = await response.json();
      const formattedCountries = data.map((country) => ({
        label: country.name.common,
        value: country.cca2,
        phoneCode: country.idd.root + (country.idd.suffixes?.[0] || ""),
        flag: country.flags.png,
      }));
      setCountries(formattedCountries);
      if (formattedCountries.length > 0) setSelectedCountry(formattedCountries[0]);
    } catch (error) {
      console.error("Erreur lors du chargement des pays :", error);
    }
  };

  fetchCountries();
}, []);

const handleCountryChange = (selectedOption) => {
  setSelectedCountry(selectedOption);

  
};

// Styles personnalisés pour react-select
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
};

// Formatteur pour afficher le drapeau et le nom dans le select
const formatOptionLabel = ({ label, flag }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <img src={flag} alt={label} style={{ width: "20px", marginRight: "10px" }} />
    <span>{label}</span>
  </div>
);

  return (

<>
<Navbar  user={user} logout={logout}  />


    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">

      
        {/* Augmentation de la largeur */}
        <h1 className="text-2xl font-bold mb-2 text-center">Formulaire d'Inscription</h1>
      
        <div className="text-center"> 
              <Link className=" inline-block text-3xl text-green-400" href="/Accueil" >
               Ton-Transporteur
              </Link>
            </div>
        <div className='flex justify-center relative bg-none'>
      {/* <Image
                      src="/images/signupp.png" // Remplacez par le chemin de votre image
                      alt="image qui illustre le login"
                      // layout="fill"
                      // objectFit="cover"
                      width={200}
                      height={200}
                      className="rounded-lg shadow-lg"
                    />  */}
      </div> 
      <div className='mt-3  mb-3'>
      <p className='mb-2 mt-3'>Saisissez vos informations personnelles pour créer votre compte.</p>
        <p className=''>Déjà un compte ?

<Link href="/auth/signin" >  <span className='ml-2  hover:text-green-600  text-green-400'>Connectez-vous</span></Link></p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
     
      {/* Nom et Prénom sur une ligne */}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom :</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="John"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom :</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Doe"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email :</label>
        <input
          type="email"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="example@gmail.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Mot de Passe et Confirmation du Mot de Passe sur une ligne */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de Passe :</label>
          <input
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="******"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirmation du Mot de Passe :</label>
          <input
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="******"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Numéro de Téléphone */}
      <div>
      <label className="block text-sm font-medium text-gray-700">Numéro de Téléphone :</label>
      <div className="flex flex-row gap-2">
        <Select
          options={countries}
          value={selectedCountry}
          onChange={handleCountryChange}
          formatOptionLabel={formatOptionLabel}
          styles={customStyles}
          className="mt-1 block w-[200px]"
        />
        {/* {selectedCountry && (
          <div className="flex items-center gap-2">
            <img src={selectedCountry.flag} alt={`Drapeau de ${selectedCountry.label}`} className="w-6 h-4" />
          </div>
        )} */}
      <input
  type="tel"
  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
  placeholder="+XX 123456789"
  {...register("phoneNumber")}
  onChange={(e) => setValue("phoneNumber", e.target.value)} // Met à jour la valeur avec React Hook Form
  value={watch("phoneNumber") || (selectedCountry ? `${selectedCountry.phoneCode} ` : "")}
/>

      </div>
      {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
    </div>
      
      
 {/* Choix du profil et rôle sur une ligne */}
 <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Profil de l&aposutilisateur :</label>
                <div className="mt-1 flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="particulier"
                      {...register("profile")}
                      className="form-radio h-4 w-4 text-green-600"
                    />
                    <span className="ml-2">Particulier</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="professionnel"
                      {...register("profile")}
                      className="form-radio h-4 w-4 text-green-600"
                    />
                    <span className="ml-2">Professionnel</span>
                  </label>
                </div>
                {errors.profile && (
                  <p className="mt-1 text-sm text-red-600">{errors.profile.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rôle :</label>
                <div className="mt-1 flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="expediteur"
                      {...register("role")}
                      className="form-radio h-4 w-4 text-green-600"
                    />
                    <span className="ml-2">Expéditeur</span>
                  </label>
                </div>
                {errors.role && (
                  <p className="mt- text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>



      {/* Checkbox pour les conditions d'utilisation */}
      <div className="flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-green-600 border-gray-300 rounded"
          {...register("terms")}
        />
        <label className="ml-2 text-sm text-gray-700">
          J'accepte les conditions d'utilisation <a href="/politique-confidentialite" className='text-green-600'>politique d'utilisattion</a>
        </label>

      </div>
      {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>}

      {/* Bouton de Soumission */}
      <div>
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
              "Soumission "
            )}
          </button>
        </div>
        
    </form>
    
      </div>
      <div id="recaptcha-container" className="hidden"></div>
    </div>

    <Footer />





{isCodeSent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Vérification du compte
        </h3>
        <p className="text-gray-600 mb-6">
          Veuillez entrer le code à 4 chiffres envoyé à votre adresse email
        </p>
        
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={digitRefs[index]}
              type="text"
              maxLength={1}
              value={verificationDigits[index]}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          ))}
        </div>
        <div className="space-y-4">
          <button
            onClick={verifyCode}
            disabled={verificationDigits.some(digit => digit === '') || timeLeft === 0}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Vérifier le code
          </button>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Vous n'avez pas reçu le code ? 
              <button 
                onClick={() => {
                  const newCode = generateVerificationCode();
                  setGeneratedCode(newCode);
                  sendVerificationEmail(email, newCode);
                  setTimeLeft(300);
                  setTimerActive(true);
                }}
                className="text-green-600 hover:text-green-700 ml-1 font-medium"
                disabled={timeLeft > 0}
              >
                Renvoyer
              </button>
            </p>
            <button
              onClick={() => router.push('/Accueil')}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Annuler
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Le code expirera dans <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}






