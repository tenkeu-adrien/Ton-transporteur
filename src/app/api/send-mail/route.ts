import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail", // Change si tu utilises un autre service
      auth: {
        user: process.env.EMAIL_USER, // Ton email
        pass: process.env.EMAIL_PASS, // Ton mot de passe ou un App Password
      },
    });

    // Contenu de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Votre code de vérification",
      text: `Votre code de vérification est : ${code}`,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email envoyé !" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur d'envoi d'email" }, { status: 500 });
  }
}
