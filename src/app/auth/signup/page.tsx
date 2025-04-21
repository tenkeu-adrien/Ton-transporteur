"use client"
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../../context/AuthContext';
import Select from "react-select";
import "country-flag-icons/3x2/flags.css"; 
import { FaSpinner } from 'react-icons/fa';
import { createUserWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../../../lib/firebaseConfig'
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebaseConfig';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';

const schema = z.object({
  profile: z.string().min(1, "Veuillez sélectionner un profil"),
  // role: z.string().min(1, "Veuillez sélectionner un rôle"),
  lastName: z.string().min(1, "Le nom est obligatoire"),
  firstName: z.string().min(1, "Le prénom est obligatoire"),
  email: z.string().min(1, "L'email est obligatoire").email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "La confirmation du mot de passe est obligatoire"),
  phoneNumber: z.string().min(6, "Le numéro de téléphone est obligatoire"),
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
const [timeLeft, setTimeLeft] = useState(300); // 5 minutes en secondes 300
const [timerActive, setTimerActive] = useState(false);
   const {
    register,
    handleSubmit,
    setValue, watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Intégrer Zod avec React Hook Form
  });
  const router =useRouter()

  // useEffect(() => {
  //   if (!timerActive || timeLeft <= 0) return;
  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => {
  //       if (prev <= 1) {
  //         setTimerActive(false);
  //         clearInterval(timer);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  
  //   return () => clearInterval(timer);
  // }, [timerActive, timeLeft]);




  
  
  const formatTime = (seconds: number) => {
    console.log("seconde" ,seconds)
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const { user,logout} = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifier, setVerifier] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [verificationDigits, setVerificationDigits] = useState(['', '', '', '']);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [email ,setEmail] =useState("null")
const [error ,setError] = useState(null)
const digitRefs = [
  useRef(null),
  useRef(null),
  useRef(null),
  useRef(null)
];


// useEffect(() => {
//   if (user) {
//     router.back(); // Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
//   }
// }, [user,  router]);

useEffect(() => {
  let interval;
  
  if (timerActive && timeLeft > 0) {
    interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          if (isCodeSent) {
            setShowExpiredModal(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(interval);
}, [timerActive, timeLeft, isCodeSent]);








  useEffect(() => {
    if (selectedCountry) {
      setValue("phoneNumber", `${selectedCountry.phoneCode} `);
    }
  }, [selectedCountry, setValue]); // Met à jour quand le pays change
  

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            // Ne montrer la modale que si l'utilisateur est en train de vérifier
            if (isCodeSent) {
              setShowExpiredModal(true);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isCodeSent]);


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
          // throw new Error("Erreur lors de l'envoi de l'email");
        }
  
        setIsCodeSent(true);
        setTimeLeft(300); // 5 minutes
    setTimerActive(true);
    setShowExpiredModal(false);
      } catch (error) {
        // console.error("Erreur:", error);
        
        // toast.error("Erreur lors de l'envoi de l'email de vérification");
        setError(error.message)
        return null
      }
    };

//   const onSubmit = async (data) => {

//     setIsSubmitting(true)
//     try {
//       // Créer l'utilisateur dans Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );
//       // Générer le code de vérification
//       const code = generateVerificationCode();
//       setGeneratedCode(code);

//       // Enregistrer les données utilisateur dans Firestore avec le code de vérification
//       await setDoc(doc(db, "users", userCredential.user.uid), {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         phoneNumber: data.phoneNumber,
//         profile: data.profile,
//         role: data.role ?? "expediteur", 
//         verificationCode: code,
//         isVerified: false,
//         createdAt: serverTimestamp(),
//       });

//       // Envoyer l'email de vérification
//      ;
//       toast.success("Compte créé ! Veuillez vérifier votre email pour le code de vérification.");
//       await sendVerificationEmail(data.email, code)
// setEmail(data.email)
//       // router.push("/Dashboard")
//     } catch (error) {
//       // console.error("Erreur:", error);
//       // toast.error(`Erreur lors de l'inscription: ${error.message}`);
//       setError(error.message)
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


const onSubmit = async (data) => {
  setIsSubmitting(true);
  setError(null); // Réinitialiser les erreurs
  
  try {
    // 1. Création de l'utilisateur
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      data.email, 
      data.password
    );

    // 2. Génération et envoi du code
    const code = generateVerificationCode();
    setGeneratedCode(code);
    setEmail(data.email);

    // 3. Enregistrement dans Firestore
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      profile: data.profile,
      role: data.role ?? "expediteur",
      verificationCode: code,
      isVerified: false,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userData);

    // 4. Envoi de l'email
    await sendVerificationEmail(data.email, code);
    
    toast.success("Compte créé ! Vérifiez votre email pour le code de vérification.");
    
  } catch (error) {
    // console.error("Erreur d'inscription:", error);
    const friendlyError = getFriendlyError(error);
    setError(friendlyError);
    // toast.error(friendlyError);
  } finally {
    setIsSubmitting(false);
  }
};
  const getFriendlyError = (error) => {
    const errorCode = error.code || error.message;
    
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Cet email est déjà utilisé. Essayez de vous connecter ou utilisez un autre email.';
      case 'auth/weak-password':
        return 'Le mot de passe doit contenir au moins 6 caractères.';
      case 'auth/invalid-email':
        return 'Adresse email invalide.';
      case 'auth/operation-not-allowed':
        return 'Opération non autorisée. Contactez le support.';
      // Ajoutez d'autres cas au besoin
      default:
        return error.message || 'Une erreur est survenue lors de l\'inscription.';
    }
  };

  // Fonction pour vérifier le code
  // const verifyCode = async () => {
  //     setVerifier(true)
  //   if (verificationCode === generatedCode) {
  //     try {
  //       // Mettre à jour le statut de vérification dans Firestore
  //       await setDoc(doc(db, "users", auth.currentUser.uid), {
  //         isVerified: true
  //       }, { merge: true });

  //       toast.success("Compte vérifié avec succès !");
  //       router.push("/Dashboard");
  //     } catch (error) {
  //       console.error("Erreur lors de la vérification:", error);
  //       toast.error("Erreur lors de la vérification du compte");
  //     }
  //   } else {
  //     toast.error("Code de vérification incorrect");
  //   }
  // };
  const verifyCode = async () => {
    if (timeLeft === 0) {
      toast.error("Le code a expiré. Veuillez demander un nouveau code.");
      return;
    }
  
    setVerifier(true);
    if (verificationCode === generatedCode) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          isVerified: true
        }, { merge: true });
  
        toast.success("Compte vérifié avec succès !");
        router.push("/Dashboard");
      } catch (error) {
        // console.error("Erreur lors de la vérification:", error);
        // toast.error("Erreur lors de la vérification du compte");
        return null
      }
    } else {
      setError("Code de vérification incorrect")

    }
    setVerifier(false);
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
    <Image src={flag} alt={label} style={{ width: "20px", marginRight: "10px" }}  width={10} height={10}/>
    <span>{label}</span>
  </div>
);

const handleResendCode = async () => {
  const newCode = generateVerificationCode();
  setGeneratedCode(newCode);
  await sendVerificationEmail(email, newCode);
  setVerificationDigits(['', '', '', '']); // Réinitialiser les champs de code
  setTimeLeft(300); // Réinitialiser à 5 minutes
  setTimerActive(true);
  setShowExpiredModal(false);
  
  // Remettre le focus sur le premier champ
  if (digitRefs[0].current) {
    digitRefs[0].current.focus();
  }
};

  return (

<>
<Navbar  user={user} logout={logout} />


    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">

      
        {/* Augmentation de la largeur */}
        <h1 className="text-2xl font-bold mb-2 text-center">Formulaire d&apos;Inscription</h1>
      
        <div className="text-center"> 
              <a className=" inline-block text-3xl text-green-400" href="/Accueil" >
               Ton-Transporteur
              </a>
            </div>
            {error && (
  <p className="text-red-500 text-sm mb-1 text-center">
    {error}
  </p>
)}
        <div className='flex justify-center relative bg-none'>
     
      </div> 
      <div className='mt-3  mb-3'>
      <p className='mb-2 mt-3'>Saisissez vos informations personnelles pour créer votre compte.</p>
        <p className=''>Déjà un compte ?

<a href="/auth/signin">  <span className='ml-2  hover:text-green-600  text-green-400'>Connectez-vous</span></a></p>
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
      <div className="flex gap-4 items-start">
        <div className='flex-1'>
          <label className="block text-sm font-medium text-gray-700">Mot de Passe :</label>
          <input
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="******"
            {...register("password")}
          />
          {errors.password && (
            <p className="mb-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div className='flex-1'>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation de mot de passe:</label>
          <input
            type="password"
            className="mb-1  w-full p-2 border border-gray-300 rounded-md shadow-sm"
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
      <div className="flex flex-row gap-2 items-center">
        <Select
          options={countries}
          value={selectedCountry}
          onChange={handleCountryChange}
          formatOptionLabel={formatOptionLabel}
          styles={customStyles}
          className="mt-1 block w-[200px]"
        />
       
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
                <label className="block text-sm font-medium text-gray-700 mb-3">Profil de l&apos;utilisateur :</label>
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
              
            </div>



      {/* Checkbox pour les conditions d'utilisation */}
      <div className="flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-green-600 border-gray-300 rounded"
          {...register("terms")}
        />
        <label className="ml-2 text-sm text-gray-700">
          J&apos;accepte les conditions d&apos;utilisation <a href="/politique-confidentialite" className='text-green-600'>politique d&apos;utilisattion</a>
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
        {error && (
  <p className="text-red-500 text-sm mb-6">
    {error}
  </p>
)}
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
  disabled={verificationDigits.some(digit => digit === '') || timeLeft === 0 || verifier}
  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
>
  Vérifier le code
</button>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Vous n&apos;avez pas reçu le code ? 
          
<button 
  onClick={handleResendCode}
  className={`ml-1 font-medium ${
    timeLeft > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-700'
  }`}
  disabled={timeLeft > 0} // Permettre de renvoyer après 2 minutes
>
  Renvoyer
</button>
            </p>
            {/* <button
              onClick={() => router.push('/Accueil')}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Annuler
            </button> */}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Le code expirera dans <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  </div>
)}

{showExpiredModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative">
      <button
        onClick={() => setShowExpiredModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">Temps écoulé</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>Le temps pour entrer le code a expiré. Veuillez demander un nouveau code.</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowExpiredModal(false)}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Compris
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}






