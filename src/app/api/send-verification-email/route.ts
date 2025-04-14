import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// export async function POST(req: Request) {
//   try {
//     const { to, subject, code } = await req.json();

//     // Configurer le transporteur d'email (à adapter selon votre service d'email)
//     // const transporter = nodemailer.createTransport({
//     //   host: process.env.SMTP_HOST,
//     //   port: parseInt(process.env.SMTP_PORT),
//     //   secure: true,
//     //   auth: {
//     //     user: process.env.SMTP_USER,
//     //     pass: process.env.SMTP_PASSWORD,
//     //   },
//     // });

//     const transporter = nodemailer.createTransport({
//       // host: process.env.EMAIL_HOST,
//       // port: parseInt(process.env.EMAIL_PORT, 10),
//       // secure: process.env.EMAIL_SECURE === "true",
//       //  // True pour 465, False pour 587
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
//     console.log("Envoi d'email à :", to) ;
//     console.log("varaible d'environnement" ,process.env.SMTP_FROM)
//     // Envoyer l'email
//    const result   = await transporter.sendMail({
//       from: process.env.SMTP_FROM,
//       to: to,
//       subject: subject,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Vérification de votre compte</h2>
//           <p>Voici votre code de vérification :</p>
//           <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background-color: #f0f0f0; border-radius: 5px;">
//             ${code}
//           </h1>
//           <p>Ce code expirera dans 30 minutes.</p>
//         </div>
//       `,
//     });
//   console.log("de la reponse apres la soumission" ,result)
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Erreur lors de l\'envoi de l\'email:', error);
//     return NextResponse.json(
//       { error: 'Erreur lors de l\'envoi de l\'email' },
//       { status: 500 }
//     );
//   }
// } 




export async function POST(req: Request) {
  const { to, subject, code ,email } = await req.json();

  // Création du transporteur en utilisant Gmail
  const transporter = nodemailer.createTransport({
    host: "mail.ton-transporteur.fr", // Serveur LWS
      port: 465, // Port SSL
      secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    
      tls: {
        rejectUnauthorized: false
      }
  });

  const mailOptions = {
    from:'"Ton Transporteur" <contact@ton-transporteur.fr>',  // L'expéditeur doit être ton adresse Gmail
    to: to,                      // Le destinataire
    subject: subject,      // Le sujet de l'email
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #f96d06; text-align: center;">Bienvenue chez  Ton-Transporteur ! 🚛</h2>
      <p>Bonjour,</p>
      <p>Nous sommes ravis de vous compter parmi nous.</p>
     <p>Ton-transporteur est la plateforme qui facilite l'envoi de tout type de colis et déménagement en toute simplicité.</p>
      <div style="text-align: center; margin: 20px 0;">
        <h1 style="font-size: 32px; letter-spacing: 5px; padding: 15px; background-color: #f0f0f0; border-radius: 5px; display: inline-block;">
          ${code}
        </h1>
      </div>
      
      <p style="text-align: center;">⚠️ Ce code expirera dans <strong>05 minutes</strong>.</p>
      
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
      
      <p>À très bientôt chez <strong>Ton-Transporteur</strong> ! 🚀</p>
  
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      
      <p style="font-size: 12px; text-align: center; color: #666;">
        Cet email est envoyé automatiquement, merci de ne pas y répondre. <br>
        <strong>Ton-Transporteur</strong> - Tous droits réservés.
      </p>
    </div>
  `,
  };

  try {
     let result =  await transporter.sendMail(mailOptions);
     console.log("result" ,result)
    return NextResponse.json({ message: "Email envoyé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json({ message: "Erreur lors de l'envoi de l'email" }, { status: 500 });
  }
}
