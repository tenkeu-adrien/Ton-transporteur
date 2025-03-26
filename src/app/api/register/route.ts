import type { NextApiRequest, NextApiResponse } from "next";
import { auth  ,db} from "../../../../lib/firebaseConfig"; // Assure-toi que ton Firebase est bien configuré ici
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import nodemailer from "nodemailer";
// export async function POST
export  async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { email, password, name } = req.body;
        console.log("data" ,email ,password,name)
    // Création de l'utilisateur dans Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Sauvegarde de l'utilisateur dans Firestore
    const userRef = doc(collection(db, "users"), firebaseUser.uid);
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      name,
      email,
      createdAt: new Date(),
    });

    // Génération du code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Envoi de l'email avec Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Utilise Gmail ou un autre service
      auth: {
        user: process.env.EMAIL_USER, // Ajoute ces variables dans .env.local
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Code de vérification",
      text: `Votre code de vérification est : ${verificationCode}`,
    });

    return res.status(200).json({ message: "Utilisateur créé, email envoyé !" });
  } catch (error: any) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({ message: error.message });
  }
}
