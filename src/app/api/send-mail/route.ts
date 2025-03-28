import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, shipment, type, chatId } = await req.json();
console.log("email ,shipment ,type  chatId" ,email ,shipment,type,chatId)
    if (!email || !shipment || !type || !chatId) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: type === "acceptance" ? "Offre acceptée" : "Nouveau message",
      html:`
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333; font-size: 20px; font-weight: bold; text-align: center;">
        ${type === "acceptance" ? "Votre offre a été acceptée 🎉" : "Nouveau message reçu 📩"}
      </h2>
      
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Bonjour,  
        <br><br>
        ${type === "acceptance" ? 
          "Bonne nouvelle ! Votre offre a été acceptée par un transporteur." : 
          "Vous avez reçu un nouveau message dans votre espace de discussion."}
      </p>

     <p style="color: #555; font-size: 16px; line-height: 1.5;">
  <strong>À propos de votre colis :</strong> ${shipment.objectName}
</p>


      <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}" 
           style="display: inline-block; background-color:rgb(6, 249, 18); color: #ffffff; padding: 12px 20px; 
                  border-radius: 5px; text-decoration: none; font-weight: bold;">
          Voir la conversation
        </a>
      </div>

      <p style="color: #555; font-size: 14px; text-align: center;">
        Nous restons à votre disposition pour toute question.
        <br>
        À très bientôt sur <strong>Ton-Transporteur</strong> 🚛  
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      
      <p style="color: #888; font-size: 12px; text-align: center;">
        Cet email est généré automatiquement, merci de ne pas y répondre.
      </p>
    </div>
  </div>
`
,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
  }
}
