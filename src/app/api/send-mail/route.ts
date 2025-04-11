import { NextResponse } from 'next/server';
import  nodemailer  from 'nodemailer';
export async function POST(req: Request) {
  try {
    const { email, shipment, type, chatId, user } = await req.json();

    if (!email || !shipment || !type || !chatId) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    console.log("email de l'envoie" , email)
    let mail = "devagencyweb@gmail.com";

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

    const getEmailContent = () => {
      switch (type) {
        case "acceptance":
          return {
            subject: "Offre  de transport acceptée",
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <h2 style="color: #333; font-size: 20px; font-weight: bold; text-align: center;">
                    Votre offre  de transport a été acceptée <span style="color:green">🚛✓</span>
                  </h2>
                  
                  <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Bonjour,  
                    <br><br>
                    Bonne nouvelle ! Votre offre de transport a été acceptée par <strong style="font-size:20px; font-weight:bold;er">${user.firstName} ${user.lastName}</strong>  
                  </p>

                  <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    <strong>À propos de votre colis :</strong>  <strong style="font-size:20px;font-weight:bolder;">${shipment.objectName}</strong>
                  </p>

                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/chat/${shipment.id}" 
                       style="display: inline-block; background-color:rgb(6, 249, 18); color: #ffffff; padding: 12px 20px; 
                              border-radius: 5px; text-decoration: none; font-weight: bold;">
                      Voir la conversation
                    </a>
                  </div>
                </div>
              </div>
            `
          };
        case "Annuler":
          return {
            subject: "Offre de transport annulée",
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <h2 style="color: #333; font-size: 20px; font-weight: bold; text-align: center;">
                    Offre de transport annulée <span style='color:red'>❌</span>
                  </h2>
                  
                  <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Bonjour,  
                    <br><br>
                    Votre offre de transport a été annulée par <strong style="font-size:20px; font-weight:bold; text-transform:capitalize;">${user.firstName} ${user.lastName}</strong>
                  </p>

                  <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    <strong style="font-size:25px text-transform:capitalize">Colis concerné :</strong> ${shipment.objectName}
                  </p>

                  <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Vous pouvez consulter d'autres offres disponibles ou contacter le support pour plus d'informations.
                  </p>

                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/mes-colis" 
                       style="display: inline-block; background-color:rgb(54, 244, 63); color: #ffffff; padding: 12px 20px; 
                              border-radius: 5px; text-decoration: none; font-weight: bold;">
                      Voir d'autres offres
                    </a>
                  </div>
                </div>
              </div>
            `
          };
        default:
          return {
            subject: "Nouveau message",
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <h2 style="color: #333; font-size: 20px; font-weight: bold; text-align: center;">
                    Nouveau message reçu 📩
                  </h2>
                  
                  <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Bonjour,  
                    <br><br>
                    Vous avez reçu un nouveau message de <strong style="font-size:20px; font-bold:bolder; text-transform:capitalize;">${user.firstName} ${user.lastName}</strong> 
                  </p>

                  <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    <strong>À propos du colis :</strong>  <strong style="font-size:20px; font-bold:bolder; text-transform:capitalize;">${shipment.objectName}</strong>
                  </p>

                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/chat/${shipment.id}" 
                       style="display: inline-block; background-color:rgb(68, 243, 33); color: #ffffff; padding: 12px 20px; 
                              border-radius: 5px; text-decoration: none; font-weight: bold;">
                      Voir la conversation
                    </a>
                  </div>
                </div>
              </div>
            `
          };
      }
    };

    const emailContent = getEmailContent();

    const mailOptions = {
      from: '"Ton Transporteur" <contact@ton-transporteur.fr>',
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
  }
}