import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, shipment, action, transporterInfo } = await req.json();

    if (!email || !shipment || !action || !transporterInfo) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

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
      const baseStyles = `
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        padding: 20px;
      `;
      const cardStyles = `
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      `;
      const buttonStyles = `
        display: inline-block;
        background-color:rgb(65, 236, 22);
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
      `;

      if (action === "enlevement") {
        return {
          subject: `[${shipment.objectName}] Enlèvement effectué`,
          html: `
            <div style="${baseStyles}">
              <div style="${cardStyles}">
                <h2 style="color: #333; font-size: 20px; font-weight: bold; text-align: center;">
                  Votre colis a été pris en charge <span style="color:green">✓</span>
                </h2>
                
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                  Bonjour,<br><br>
                  Nous vous informons que votre colis <strong>${shipment.objectName}</strong> a été pris en charge par notre transporteur.
                </p>

                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h3 style="color: #047857; margin-top: 0;">Détails du transporteur :</h3>
                  <p style="margin-bottom: 5px;">
                    <strong>Transporteur :</strong> ${transporterInfo.firstName || transporterInfo.lastName}
                  </p>
                </div>

                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                  <strong>Prochaine étape :</strong> Le colis est maintenant en route vers sa destination finale.
                </p>

                <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/chat/${shipment.id}" 
                     style="${buttonStyles}">
                    chater avec le transporteur
                  </a>
                </div>

                <p style="color: #777; font-size: 14px; text-align: center;">
                  Merci de votre confiance,<br>
                  <strong>L'équipe ${process.env.APP_NAME || "Ton-transporteur"}</strong>
                </p>
              </div>
            </div>
          `
        };
      } else { // déchargement
        return {
          subject: `[${shipment.objectName}] Livraison effectuée`,
          html: `
            <div style="${baseStyles}">
              <div style="${cardStyles}">
                <h2 style="color: #333; font-size: 20px; font-weight: bold; text-align: center;">
                  Votre colis a été livré avec succès <span style="color:green">✓</span>
                </h2>
                
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                  Bonjour,<br><br>
                  Nous avons le plaisir de vous informer que votre colis <strong>${shipment.objectName}</strong> a été livré avec succès à son destinataire.
                </p>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                  Nous espérons que vous êtes satisfait de notre service. N'hésitez pas à nous faire part de votre expérience.
                </p>

                <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/chat/${shipment.id}" 
                     style="${buttonStyles}">
                    Donner votre avis
                  </a>
                </div>

                <p style="color: #777; font-size: 14px; text-align: center;">
                  À bientôt,<br>
                  <strong>L'équipe ${process.env.APP_NAME || "Ton-transporteur"}</strong>
                </p>
              </div>
            </div>
          `
        };
      }
    };

    const emailContent = getEmailContent();

    const mailOptions = {
      from: `"Notifications Colis" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la notification" }, 
      { status: 500 }
    );
  }
}