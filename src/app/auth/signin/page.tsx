"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginUser } from "../../../../lib/functions";
import { auth, googleProvider} from "../../../../lib/firebaseConfig";
// import { signInWithRedirect,getRedirectResult } from "firebase/auth";
import { getAuth, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "../../../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FiLogOut } from "react-icons/fi";

// Définir le schéma de validation avec Zod
const schema = z.object({
  email: z.string().email("Adresse email invalide").min(1, "Ce champ est obligatoire"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});
export default function AuthPage() {
//   const { data: session } = useSession();
const router = useRouter()
 const [isSubmitting, setIsSubmitting] = useState(false);
 const { user, logout ,setUser } = useContext(AuthContext);
// Mise à jour du contexte avec l'utilisateur
     // Rediriger l'utilisateur
const [showPassword, setShowPassword] = useState(false); // Gérer l'état de visibilité du mot de passe

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword); // Alterner l'état de visibilité
};
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema), // Intégrer Zod avec React Hook Form
});

const onSubmit = async (data) => {
  setIsSubmitting(true);
  try {
    const response = await loginUser(data.email, data.password); // Connexion

    if (response.success && response.user) {
      const user = response.user; // Utilise l'objet `user` du résultat

      // Met à jour l'utilisateur dans le contexte
      setUser(user);

      // Afficher le toast de connexion réussie
      toast.success('Connexion réussie !', {
        position: "top-right", // Positionner le toast en haut à droite
        autoClose: 5000, // Fermer automatiquement après 5 secondes
      });

      // Rediriger vers le tableau de bord après la connexion
      setTimeout(() => {
        router.push("/Dashboard");
      }, 2000); // Attendre 2 secondes avant la redirection
    } else {
      console.error("Erreur de connexion", response.error);
      toast.error("Erreur de connexion : " + response.error.message);
    }
  } catch (error) {
    console.error("Erreur de connexion", error);
    toast.error("Erreur de connexion : " + error.message);
  } finally {
    setIsSubmitting(false);
  }
};

// const handleGoogleLogin = async () => {
//   try {
//     const result = await signInWithRedirect(auth, googleProvider);
//     console.log("Utilisateur Google connecté:", result.user);
//   } catch (error) {
//     console.error("Erreur Google:", error);
//   }
// };

// const handleGoogleLogin = async () => {
//   try {
//     await signInWithRedirect(auth, googleProvider);
    
//     const result = await getRedirectResult(auth);
//     if (result) {
//       // setUser(result.user); // Met à jour l'utilisateur dans le contexte
//       console.log("Utilisateur Google connecté:", result.user);
//       router.push("/Dashboard")
//     }
//   } catch (error) {
//     console.error("Erreur Google:", error);
//   }
// };

const handleGoogleLogin = async () => {
  try {
    const resultatGoogle = await signInWithRedirect(auth, googleProvider);
      console.log("connexion google" ,resultatGoogle)
  } catch (error) {
    console.error("Erreur Google:", error);
  }
};

const handleFacebookLogin = async () => {
  // try {
  //   const result = await signInWithRedirect(auth, facebookProvider);
  //   console.log("Utilisateur Facebook connecté:", result.user);
  // } catch (error) {
  //   console.error("Erreur Facebook:", error);
  // }

  try {
    // await signInWithRedirect(auth, facebookProvider);
    
    const result = await getRedirectResult(auth);
    if (result) {
      // console.log("Utilisateur Google connecté:", result.user);
    }
  } catch (error) {
    console.error("Erreur Google:", error);
  }
};

useEffect(() => {
  // Écouter les changements d'état d'authentification
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log("Utilisateur connecté:", user);
      router.push("/Dashboard"); // Rediriger vers le tableau de bord
    } else {
      console.log("Aucun utilisateur connecté");
    }
  });

  // Nettoyer l'écouteur lors du démontage du composant
  return () => unsubscribe();
}, [user]);
  return (

    <>
    <Navbar  user={user}  logout={logout}/>
    <div className="rounded-sm border border-stroke bg-white shadow-default darkk:border-strokedark darkk:bg-boxdark min-h-screen justify-center m-[200px]">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center"> 
              <Link className="mb-5.5 inline-block text-3xl text-green-400" href="/Accueil" >
               Ton-Transporteur
              </Link>

              <p className="2xl:px-20">
                Bienvenue !
              </p>

              <span className="inline-block">
                {/* <svg
                  width="350"
                  height="350"
                  viewBox="0 0 350 350"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.5825 294.844L30.5069 282.723C25.0538 280.414 19.4747 278.414 13.7961 276.732L13.4079 282.365L11.8335 276.159C4.79107 274.148 0 273.263 0 273.263C0 273.263 6.46998 297.853 20.0448 316.653L35.8606 319.429L23.5737 321.2C25.2813 323.253 27.1164 325.196 29.0681 327.019C48.8132 345.333 70.8061 353.736 78.1898 345.787C85.5736 337.838 75.5526 316.547 55.8074 298.235C49.6862 292.557 41.9968 288.001 34.2994 284.415L33.5825 294.844Z"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M62.8332 281.679L66.4705 269.714C62.9973 264.921 59.2562 260.327 55.2652 255.954L52.019 260.576L53.8812 254.45C48.8923 249.092 45.2489 245.86 45.2489 245.86C45.2489 245.86 38.0686 270.253 39.9627 293.358L52.0658 303.903L40.6299 299.072C41.0301 301.712 41.596 304.324 42.3243 306.893C49.7535 332.77 64.2336 351.323 74.6663 348.332C85.0989 345.341 87.534 321.939 80.1048 296.063C77.8019 288.041 73.5758 280.169 68.8419 273.123L62.8332 281.679Z"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M243.681 82.9153H241.762V30.3972C241.762 26.4054 240.975 22.4527 239.447 18.7647C237.918 15.0768 235.677 11.7258 232.853 8.90314C230.028 6.0805 226.674 3.84145 222.984 2.31385C219.293 0.786245 215.337 0 211.343 0H99.99C91.9222 0 84.1848 3.20256 78.48 8.90314C72.7752 14.6037 69.5703 22.3354 69.5703 30.3972V318.52C69.5703 322.512 70.3571 326.465 71.8859 330.153C73.4146 333.841 75.6553 337.192 78.48 340.015C81.3048 342.837 84.6582 345.076 88.3489 346.604C92.0396 348.131 95.9952 348.918 99.99 348.918H211.343C219.41 348.918 227.148 345.715 232.852 340.014C238.557 334.314 241.762 326.582 241.762 318.52V120.299H243.68L243.681 82.9153Z"
                    fill="#E6E6E6"
                  />
                  <path
                    d="M212.567 7.9054H198.033C198.701 9.54305 198.957 11.3199 198.776 13.0793C198.595 14.8387 197.984 16.5267 196.997 17.9946C196.01 19.4625 194.676 20.6652 193.114 21.4967C191.552 22.3283 189.809 22.7632 188.039 22.7632H124.247C122.477 22.7631 120.734 22.3281 119.172 21.4964C117.61 20.6648 116.277 19.462 115.289 17.9942C114.302 16.5263 113.691 14.8384 113.511 13.079C113.33 11.3197 113.585 9.54298 114.254 7.9054H100.678C94.6531 7.9054 88.8749 10.297 84.6146 14.5542C80.3543 18.8113 77.9609 24.5852 77.9609 30.6057V318.31C77.9609 324.331 80.3543 330.105 84.6146 334.362C88.8749 338.619 94.6531 341.011 100.678 341.011H212.567C218.592 341.011 224.37 338.619 228.63 334.362C232.891 330.105 235.284 324.331 235.284 318.31V30.6053C235.284 24.5848 232.891 18.811 228.63 14.554C224.37 10.297 218.592 7.9054 212.567 7.9054Z"
                    fill="white"
                  />
                  <path
                    d="M142.368 122.512C142.368 120.501 142.898 118.526 143.904 116.784C144.911 115.043 146.359 113.597 148.102 112.592C146.36 111.587 144.383 111.057 142.371 111.057C140.358 111.057 138.381 111.586 136.639 112.591C134.896 113.596 133.448 115.042 132.442 116.784C131.436 118.525 130.906 120.501 130.906 122.512C130.906 124.522 131.436 126.498 132.442 128.239C133.448 129.981 134.896 131.427 136.639 132.432C138.381 133.437 140.358 133.966 142.371 133.966C144.383 133.966 146.36 133.436 148.102 132.431C146.359 131.426 144.911 129.981 143.905 128.24C142.898 126.499 142.368 124.523 142.368 122.512Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M156.779 122.512C156.778 120.501 157.308 118.526 158.315 116.784C159.321 115.043 160.769 113.597 162.513 112.592C160.77 111.587 158.793 111.057 156.781 111.057C154.769 111.057 152.792 111.586 151.049 112.591C149.306 113.596 147.859 115.042 146.852 116.784C145.846 118.525 145.316 120.501 145.316 122.512C145.316 124.522 145.846 126.498 146.852 128.239C147.859 129.981 149.306 131.427 151.049 132.432C152.792 133.437 154.769 133.966 156.781 133.966C158.793 133.966 160.77 133.436 162.513 132.431C160.769 131.426 159.322 129.981 158.315 128.24C157.308 126.499 156.779 124.523 156.779 122.512Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M170.862 133.966C177.192 133.966 182.325 128.838 182.325 122.512C182.325 116.186 177.192 111.057 170.862 111.057C164.531 111.057 159.398 116.186 159.398 122.512C159.398 128.838 164.531 133.966 170.862 133.966Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M190.017 158.289H123.208C122.572 158.288 121.962 158.035 121.512 157.586C121.062 157.137 120.809 156.527 120.809 155.892V89.1315C120.809 88.496 121.062 87.8866 121.512 87.4372C121.962 86.9878 122.572 86.735 123.208 86.7343H190.017C190.653 86.735 191.263 86.9878 191.713 87.4372C192.163 87.8866 192.416 88.496 192.416 89.1315V155.892C192.416 156.527 192.163 157.137 191.713 157.586C191.263 158.035 190.653 158.288 190.017 158.289ZM123.208 87.6937C122.826 87.6941 122.46 87.8457 122.19 88.1154C121.92 88.385 121.769 88.7507 121.768 89.132V155.892C121.769 156.274 121.92 156.639 122.19 156.909C122.46 157.178 122.826 157.33 123.208 157.33H190.017C190.399 157.33 190.765 157.178 191.035 156.909C191.304 156.639 191.456 156.274 191.457 155.892V89.132C191.456 88.7507 191.304 88.385 191.035 88.1154C190.765 87.8457 190.399 87.6941 190.017 87.6937H123.208Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M204.934 209.464H102.469V210.423H204.934V209.464Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M105.705 203.477C107.492 203.477 108.941 202.029 108.941 200.243C108.941 198.457 107.492 197.01 105.705 197.01C103.918 197.01 102.469 198.457 102.469 200.243C102.469 202.029 103.918 203.477 105.705 203.477Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M204.934 241.797H102.469V242.757H204.934V241.797Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M105.705 235.811C107.492 235.811 108.941 234.363 108.941 232.577C108.941 230.791 107.492 229.344 105.705 229.344C103.918 229.344 102.469 230.791 102.469 232.577C102.469 234.363 103.918 235.811 105.705 235.811Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M203.062 278.617H170.68C170.121 278.617 169.584 278.394 169.189 277.999C168.793 277.604 168.571 277.068 168.57 276.509V265.168C168.571 264.609 168.793 264.073 169.189 263.678C169.584 263.283 170.121 263.06 170.68 263.06H203.062C203.621 263.06 204.158 263.283 204.553 263.678C204.949 264.073 205.171 264.609 205.172 265.168V276.509C205.171 277.068 204.949 277.604 204.553 277.999C204.158 278.394 203.621 278.617 203.062 278.617Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M116.263 203.477C118.05 203.477 119.499 202.029 119.499 200.243C119.499 198.457 118.05 197.01 116.263 197.01C114.476 197.01 113.027 198.457 113.027 200.243C113.027 202.029 114.476 203.477 116.263 203.477Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M126.818 203.477C128.605 203.477 130.054 202.029 130.054 200.243C130.054 198.457 128.605 197.01 126.818 197.01C125.031 197.01 123.582 198.457 123.582 200.243C123.582 202.029 125.031 203.477 126.818 203.477Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M116.263 235.811C118.05 235.811 119.499 234.363 119.499 232.577C119.499 230.791 118.05 229.344 116.263 229.344C114.476 229.344 113.027 230.791 113.027 232.577C113.027 234.363 114.476 235.811 116.263 235.811Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M126.818 235.811C128.605 235.811 130.054 234.363 130.054 232.577C130.054 230.791 128.605 229.344 126.818 229.344C125.031 229.344 123.582 230.791 123.582 232.577C123.582 234.363 125.031 235.811 126.818 235.811Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M264.742 229.309C264.972 229.414 265.193 229.537 265.404 229.678L286.432 220.709L287.183 215.174L295.585 215.123L295.089 227.818L267.334 235.153C267.275 235.345 267.205 235.535 267.124 235.719C266.722 236.574 266.077 237.292 265.269 237.783C264.46 238.273 263.525 238.514 262.58 238.475C261.636 238.436 260.723 238.119 259.958 237.563C259.193 237.008 258.61 236.239 258.28 235.353C257.951 234.467 257.892 233.504 258.108 232.584C258.325 231.664 258.809 230.829 259.5 230.183C260.19 229.538 261.056 229.11 261.989 228.955C262.922 228.799 263.879 228.922 264.742 229.309Z"
                    fill="#FFB8B8"
                  />
                  <path
                    d="M298.642 344.352H292.894L290.16 322.198L298.643 322.198L298.642 344.352Z"
                    fill="#FFB8B8"
                  />
                  <path
                    d="M288.788 342.711H299.873V349.685H281.809C281.809 347.835 282.544 346.062 283.853 344.754C285.162 343.446 286.937 342.711 288.788 342.711Z"
                    fill="#1C2434"
                  />
                  <path
                    d="M320.995 342.729L315.274 343.292L310.379 321.513L318.822 320.682L320.995 342.729Z"
                    fill="#FFB8B8"
                  />
                  <path
                    d="M311.028 342.061L322.059 340.975L322.744 347.916L304.766 349.685C304.676 348.774 304.767 347.854 305.033 346.977C305.299 346.101 305.735 345.285 306.317 344.577C306.898 343.869 307.614 343.283 308.422 342.851C309.23 342.419 310.116 342.151 311.028 342.061Z"
                    fill="#1C2434"
                  />
                  <path
                    d="M300.242 191.677C306.601 191.677 311.757 186.525 311.757 180.17C311.757 173.815 306.601 168.663 300.242 168.663C293.882 168.663 288.727 173.815 288.727 180.17C288.727 186.525 293.882 191.677 300.242 191.677Z"
                    fill="#FFB8B8"
                  />
                  <path
                    d="M291.607 339.872C291.113 339.873 290.635 339.7 290.256 339.383C289.877 339.066 289.623 338.626 289.537 338.139C286.562 321.636 276.838 267.676 276.605 266.181C276.6 266.147 276.597 266.112 276.598 266.077V262.054C276.597 261.907 276.643 261.764 276.729 261.645L278.013 259.847C278.074 259.761 278.154 259.689 278.247 259.639C278.34 259.588 278.444 259.559 278.549 259.554C285.874 259.211 309.86 258.206 311.019 259.652C312.183 261.106 311.772 265.512 311.678 266.38L311.682 266.471L322.459 335.337C322.543 335.886 322.408 336.446 322.082 336.896C321.756 337.347 321.265 337.65 320.717 337.742L313.986 338.85C313.485 338.931 312.971 338.829 312.539 338.563C312.107 338.297 311.784 337.885 311.63 337.401C309.548 330.754 302.568 308.393 300.149 299.741C300.133 299.686 300.099 299.639 300.051 299.607C300.004 299.576 299.946 299.563 299.89 299.571C299.834 299.579 299.782 299.608 299.745 299.651C299.708 299.694 299.688 299.749 299.689 299.806C299.81 308.054 300.102 329.098 300.203 336.366L300.214 337.148C300.218 337.678 300.023 338.191 299.668 338.584C299.313 338.978 298.823 339.224 298.295 339.274L291.804 339.863C291.738 339.869 291.672 339.872 291.607 339.872Z"
                    fill="#1C2434"
                  />
                  <path
                    d="M292.933 196.201C290.924 197.395 289.721 199.588 289.031 201.821C287.754 205.953 286.985 210.226 286.741 214.545L286.012 227.475L276.984 261.755C284.809 268.37 289.322 266.867 299.855 261.455C310.387 256.044 311.591 263.26 311.591 263.26L313.697 234.092L316.706 202.219C316.031 201.407 315.266 200.672 314.427 200.03C311.645 197.868 308.409 196.366 304.962 195.636C301.516 194.906 297.948 194.967 294.528 195.815L292.933 196.201Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M290.001 236.232C290.244 236.324 290.479 236.434 290.704 236.562L311.497 226.163L311.842 220.529L320.419 219.938L320.878 232.781L293.092 241.963C292.865 242.935 292.347 243.816 291.608 244.487C290.868 245.158 289.941 245.588 288.951 245.72C287.96 245.852 286.953 245.68 286.063 245.226C285.173 244.772 284.442 244.058 283.968 243.179C283.494 242.301 283.299 241.298 283.409 240.306C283.519 239.313 283.928 238.378 284.583 237.624C285.238 236.869 286.107 236.332 287.075 236.084C288.043 235.835 289.063 235.887 290.001 236.232Z"
                    fill="#FFB8B8"
                  />
                  <path
                    d="M316.556 202.365C321.672 204.17 322.573 223.716 322.573 223.716C316.554 220.409 309.332 225.821 309.332 225.821C309.332 225.821 307.827 220.709 306.022 214.094C305.477 212.233 305.412 210.265 305.832 208.372C306.253 206.479 307.147 204.724 308.429 203.269C308.429 203.269 311.44 200.56 316.556 202.365Z"
                    fill="#3056D3"
                  />
                  <path
                    d="M310.566 183.213C309.132 182.066 307.174 184.151 307.174 184.151L306.026 173.828C306.026 173.828 298.853 174.687 294.261 173.542C289.67 172.396 288.953 177.7 288.953 177.7C288.716 175.557 288.668 173.399 288.81 171.248C289.096 168.667 292.827 166.087 299.427 164.366C306.026 162.646 309.47 170.101 309.47 170.101C314.061 172.395 312.001 184.36 310.566 183.213Z"
                    fill="#1C2434"
                  />
                </svg> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="500" height="" viewBox="0 0 720 722.539" role="img" className="mt-8"  >
  <g id="Group_64" data-name="Group 64" transform="translate(-600.001 -166)">
    <g id="Group_63" data-name="Group 63" transform="translate(39.127 -21.613)">
      <path id="Path_1-1224" data-name="Path 1" d="M275.321,690.449,270.949,673.2a223.916,223.916,0,0,0-23.758-8.524l-.552,8.015-2.238-8.83c-10.012-2.862-16.824-4.121-16.824-4.121s9.2,34.987,28.5,61.735l22.486,3.95-17.469,2.519a90.608,90.608,0,0,0,7.811,8.28c28.072,26.057,59.34,38.013,69.838,26.7s-3.749-41.6-31.822-67.656c-8.7-8.078-19.635-14.56-30.579-19.664Z" transform="translate(417.297 140.418)" fill="#f2f2f2"/>
      <path id="Path_2-1225" data-name="Path 2" d="M345.1,652.214l5.171-17.023a223.933,223.933,0,0,0-15.931-19.578l-4.615,6.576,2.648-8.716c-7.093-7.623-12.273-12.221-12.273-12.221s-10.208,34.706-7.516,67.579l17.207,15-16.259-6.874a90.606,90.606,0,0,0,2.409,11.128c10.562,36.817,31.149,63.214,45.982,58.958s18.295-37.551,7.732-74.368c-3.274-11.414-9.283-22.614-16.013-32.638Z" transform="translate(389.102 159.921)" fill="#f2f2f2"/>
    </g>
    <g id="Group_62" data-name="Group 62" transform="translate(44.037 -0.462)">
      <path id="Path_22-1226" data-name="Path 22" d="M734.978,247.559h-3.956V139.187A62.725,62.725,0,0,0,668.3,76.462H438.687a62.725,62.725,0,0,0-62.725,62.725V733.736a62.725,62.725,0,0,0,62.725,62.725H668.3a62.725,62.725,0,0,0,62.724-62.724V324.7h3.956Z" transform="translate(360 90)" fill="#e6e6e6"/>
      <path id="Path_23-1227" data-name="Path 23" d="M671.423,93.336H641.454a22.255,22.255,0,0,1-20.607,30.659H489.306A22.254,22.254,0,0,1,468.7,93.335H440.708a46.843,46.843,0,0,0-46.843,46.843V733.864a46.843,46.843,0,0,0,46.843,46.843H671.423a46.843,46.843,0,0,0,46.843-46.843h0V140.177a46.843,46.843,0,0,0-46.842-46.842Z" transform="translate(359.405 89.439)" fill="#fff"/>
      <path id="Path_6-1228" data-name="Path 6" d="M530.421,337.151a23.626,23.626,0,0,1,11.827-20.472,23.637,23.637,0,1,0,0,40.939,23.621,23.621,0,0,1-11.823-20.467Z" transform="translate(355.65 82.117)" fill="#ccc"/>
      <path id="Path_7-1229" data-name="Path 7" d="M561.158,337.151a23.625,23.625,0,0,1,11.827-20.472,23.637,23.637,0,1,0,0,40.939,23.621,23.621,0,0,1-11.823-20.467Z" transform="translate(354.627 82.117)" fill="#ccc"/>
      <circle id="Ellipse_1" data-name="Ellipse 1" cx="23.637" cy="23.637" r="23.637" transform="translate(921.189 395.631)" fill="#16e610"/>
      <path id="Path_8-1230" data-name="Path 8" d="M627.963,409.252H490.2a4.953,4.953,0,0,1-4.947-4.947V266.543A4.953,4.953,0,0,1,490.2,261.6H627.963a4.953,4.953,0,0,1,4.947,4.947V404.3a4.953,4.953,0,0,1-4.947,4.947ZM490.2,263.576a2.971,2.971,0,0,0-2.968,2.968V404.306a2.971,2.971,0,0,0,2.968,2.968H627.963a2.971,2.971,0,0,0,2.968-2.968V266.544a2.971,2.971,0,0,0-2.968-2.968Z" transform="translate(356.366 83.844)" fill="#ccc"/>
      <rect id="Rectangle_1" data-name="Rectangle 1" width="211.284" height="1.979" transform="translate(803.805 598.696)" fill="#ccc"/>
      <circle id="Ellipse_2" data-name="Ellipse 2" cx="6.672" cy="6.672" r="6.672" transform="translate(803.805 572.996)" fill="#16e610"/>
      <rect id="Rectangle_2" data-name="Rectangle 2" width="211.284" height="1.979" transform="translate(803.805 665.417)" fill="#ccc"/>
      <circle id="Ellipse_3" data-name="Ellipse 3" cx="6.672" cy="6.672" r="6.672" transform="translate(803.805 639.718)" fill="#16e610"/>
      <path id="Path_977-1231" data-name="Path 977" d="M658.244,670.068H591.472a4.355,4.355,0,0,1-4.35-4.35v-23.4a4.355,4.355,0,0,1,4.35-4.35h66.772a4.355,4.355,0,0,1,4.35,4.35v23.4a4.355,4.355,0,0,1-4.35,4.35Z" transform="translate(352.978 71.328)" fill="#16e610"/>
      <circle id="Ellipse_7" data-name="Ellipse 7" cx="6.672" cy="6.672" r="6.672" transform="translate(825.57 572.996)" fill="#16e610"/>
      <circle id="Ellipse_8" data-name="Ellipse 8" cx="6.672" cy="6.672" r="6.672" transform="translate(847.335 572.996)" fill="#16e610"/>
      <circle id="Ellipse_9" data-name="Ellipse 9" cx="6.672" cy="6.672" r="6.672" transform="translate(825.57 639.718)" fill="#16e610"/>
      <circle id="Ellipse_10" data-name="Ellipse 10" cx="6.672" cy="6.672" r="6.672" transform="translate(847.335 639.718)" fill="#16e610"/>
    </g>
    <path id="Path_88-1232" data-name="Path 88" d="M966.106,823.539H251.642c-1.529,0-2.768-.546-2.768-1.218s1.239-1.219,2.768-1.219H966.106c1.528,0,2.768.546,2.768,1.219S967.634,823.539,966.106,823.539Z" transform="translate(351.127 65)" fill="#e6e6e6"/>
    <g id="Group_61" data-name="Group 61" transform="translate(-21145.078 -2078.104)">
      <path id="Path_92-1233" data-name="Path 92" d="M893.722,361.268l-16.8,33.257L826.7,417.359c-5.364,9.065-22.409,9.759-23.649,3.9-1.391-6.576,20.7-17.161,20.7-17.161l42.012-28.416,3.676-24.463Z" transform="translate(21477.109 2335.737)" fill="#ffb9b9"/>
      <path id="Path_93-1234" data-name="Path 93" d="M742.662,464.215,745.76,489l-17.969,1.24-1.858-26.023Z" transform="translate(21626.188 2455.967)" fill="#ffb9b9"/>
      <path id="Path_94-1235" data-name="Path 94" d="M900.869,676.83a48.641,48.641,0,0,0,4.434-5.422c2.575-3.564,4.86,14.716,4.86,14.716s2.479,7.435,1.859,11.153-14.87,3.718-17.349,3.1-14.87,0-14.87,0H861.215c-16.11-7.435,0-12.392,0-12.392,4.957-.62,21.686-16.11,21.686-16.11l3.718-6.815c2.478-.62,4.957,8.674,4.957,8.674Z" transform="translate(21465.504 2264.419)" fill="#090814"/>
      <path id="Path_95-1236" data-name="Path 95" d="M802.8,464.616l3.1,24.784-17.969,1.24-1.859-26.024Z" transform="translate(21612.521 2455.876)" fill="#ffb9b9"/>
      <path id="Path_96-1237" data-name="Path 96" d="M961.005,677.231a48.7,48.7,0,0,0,4.434-5.422c2.575-3.564,4.86,14.716,4.86,14.716s2.478,6.816,1.859,10.533-14.87,3.717-17.349,3.1-14.87.62-14.87.62H921.351c-16.11-7.435,0-12.392,0-12.392,4.957-.62,21.686-16.11,21.686-16.11l3.718-6.815c2.478-.62,4.957,8.674,4.957,8.674Z" transform="translate(21451.836 2264.328)" fill="#090814"/>
      <path id="Path_97-1238" data-name="Path 97" d="M930.929,446.165c2.479,3.1,1.239,13.631,1.239,13.631s4.337,34.078,2.478,37.176,1.239,5.576,3.1,9.914,3.718,14.87,3.718,14.87c10.533,8.674,9.914,48.329,9.914,48.329l3.717,35.317c-1.239,3.718-18.588,4.337-21.066,3.718s-9.914-56.384-9.914-56.384l-16.729-31.6s1.239,84.265,1.239,87.983-16.729,1.859-20.447,1.859-3.718-61.96-3.718-61.96l-3.718-16.109-19.827-73.732V450.5l3.1-4.337S928.451,443.067,930.929,446.165Z" transform="translate(21463.943 2314.471)" fill="#090814"/>
      <circle id="Ellipse_11" data-name="Ellipse 11" cx="19.208" cy="19.208" r="19.208" transform="translate(22348.404 2581.572)" fill="#ffb9b9"/>
      <path id="Path_98-1239" data-name="Path 98" d="M901.99,251.326c3.893,8.67,1.588,20.779-6.2,34.078l31.6-14.87-4.957-4.337,1.239-12.392Z" transform="translate(21456.018 2358.437)" fill="#ffb9b9"/>
      <path id="Path_99-1240" data-name="Path 99" d="M894.154,275.527c-4.138,2.46-6.613,6.98-8.034,11.58a109.735,109.735,0,0,0-4.716,26.218l-1.5,26.64L861.316,410.6c16.109,13.631,25.4,10.533,47.089-.62S932.57,413.7,932.57,413.7s1.859-.62,0-2.478,0,0,1.859-1.859,0,0-.62-1.859,0-.62.62-1.239-2.478-6.2-2.478-6.2l4.957-46.47,6.2-65.677c-7.435-9.294-28.5-17.349-28.5-17.349L895.394,284.2c-6.2,2.478-1.239-7.435-1.239-7.435Z" transform="translate(21463.852 2354.064)" fill="#16e610"/>
      <path id="Path_100-1241" data-name="Path 100" d="M968.242,343.937l2.478,37.176-31.6,45.231c0,10.533-5.576,13.012-5.576,13.012a81.9,81.9,0,0,1-5.576-10.533c-3.1-6.816,1.859-12.392,1.859-12.392l21.686-45.85-9.294-22.925Z" transform="translate(21448.936 2337.39)" fill="#ffb9b9"/>
      <path id="Path_101-1242" data-name="Path 101" d="M960.1,293.046c10.533,3.718,12.392,43.992,12.392,43.992-12.392-6.816-27.262,4.337-27.262,4.337s-3.1-10.533-6.816-24.164a23.68,23.68,0,0,1,4.957-22.306S949.563,289.329,960.1,293.046Z" transform="translate(21446.549 2349.247)" fill="#16e610"/>
      <path id="Path_102-1243" data-name="Path 102" d="M928.148,237.734c-2.445-1.956-5.781,1.6-5.781,1.6l-1.956-17.606s-12.226,1.467-20.051-.489-9.047,7.091-9.047,7.091a62.8,62.8,0,0,1-.245-11c.489-4.4,6.847-8.8,18.095-11.737s17.116,9.781,17.116,9.781C934.1,219.283,930.593,239.691,928.148,237.734Z" transform="translate(21457.121 2368.931)" fill="#090814"/>
    </g>
  </g>
</svg>
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2  ">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              {/* <span className="mb-1.5 block font-medium">Start for free</span> */}
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Se connecter
              </h2>

              <form  onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      //  className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    
                      {...register("email")} // Enregistrer le champ avec React Hook Form
    />
    {errors.email && (
      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
    )}

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                       className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"

                      // className=" focus:outline-none focus:ring-green-500 focus:border-green-500  w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      {...register("password")} // Enregistrer le champ avec React Hook Form
                      />




                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                      )}

                    <span className="absolute right-4 top-4">
                    {/* <?xml version="1.0" ?>

<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> */}
<svg fill="#00" width="22px" height="22px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">

<g id="Password" opacity="0.5">

<path d="M391,233.9478H121a45.1323,45.1323,0,0,0-45,45v162a45.1323,45.1323,0,0,0,45,45H391a45.1323,45.1323,0,0,0,45-45v-162A45.1323,45.1323,0,0,0,391,233.9478ZM184.123,369.3794a9.8954,9.8954,0,1,1-9.8964,17.1387l-16.33-9.4287v18.8593a9.8965,9.8965,0,0,1-19.793,0V377.0894l-16.33,9.4287a9.8954,9.8954,0,0,1-9.8964-17.1387l16.3344-9.4307-16.3344-9.4306a9.8954,9.8954,0,0,1,9.8964-17.1387l16.33,9.4282V323.9487a9.8965,9.8965,0,0,1,19.793,0v18.8589l16.33-9.4282a9.8954,9.8954,0,0,1,9.8964,17.1387l-16.3344,9.4306Zm108,0a9.8954,9.8954,0,1,1-9.8964,17.1387l-16.33-9.4287v18.8593a9.8965,9.8965,0,0,1-19.793,0V377.0894l-16.33,9.4287a9.8954,9.8954,0,0,1-9.8964-17.1387l16.3344-9.4307-16.3344-9.4306a9.8954,9.8954,0,0,1,9.8964-17.1387l16.33,9.4282V323.9487a9.8965,9.8965,0,0,1,19.793,0v18.8589l16.33-9.4282a9.8954,9.8954,0,0,1,9.8964,17.1387l-16.3344,9.4306Zm108,0a9.8954,9.8954,0,1,1-9.8964,17.1387l-16.33-9.4287v18.8593a9.8965,9.8965,0,0,1-19.793,0V377.0894l-16.33,9.4287a9.8954,9.8954,0,0,1-9.8964-17.1387l16.3344-9.4307-16.3344-9.4306a9.8954,9.8954,0,0,1,9.8964-17.1387l16.33,9.4282V323.9487a9.8965,9.8965,0,0,1,19.793,0v18.8589l16.33-9.4282a9.8954,9.8954,0,0,1,9.8964,17.1387l-16.3344,9.4306Z"/>

<path d="M157.8965,143.9487a98.1035,98.1035,0,1,1,196.207,0V214.147h19.793V143.9487a117.8965,117.8965,0,0,0-235.793,0V214.147h19.793Z"/>

</g>

</svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  {/* <input
                    type="submit"
                    value="Se connecterr"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  /> */}
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

                <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuez avec</span>
            </div>
          </div>
        </div>

        {/* Connexion par Google et Facebook */}
        <div className="mt-6 gridd gridd-colss-2 gap-3">
  {/* Bouton Google */}
  <button
  type="button"
    onClick={() => handleGoogleLogin()}
    className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
  >
    <Image
      src="/images/icon/search.png" // Chemin de l'icône Google
      alt="Google"
      width={20} // Largeur de l'icône
      height={20} // Hauteur de l'icône
      className="mr-2 " // Marge à droite pour espacer l'icône du texte
    />
    Google
  </button>
</div>
                <div className="mt-6 text-center">
                  <p>
                    vous n'avez pas de compte ?
                    <Link href="/auth/signup" className="text-green-500">
                    créer 
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>



      
      <Footer />
    </>)
}

