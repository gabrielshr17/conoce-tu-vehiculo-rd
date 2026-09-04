import nodemailer from 'nodemailer';

export interface WelcomeEmailParams {
  toEmail: string;
  toName: string;
}

export function createEmailService(gmailUser: string, gmailAppPassword: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailAppPassword },
  });

  async function sendWelcomeEmail({ toEmail, toName }: WelcomeEmailParams): Promise<void> {
    const passwordUrl = 'https://myaccount.google.com/signinoptions/password';
    await transporter.sendMail({
      from: `"Conoce tu Vehículo RD" <${gmailUser}>`,
      to: toEmail,
      subject: 'Bienvenido/a a Conoce tu Vehículo RD',
      text:
        `${toName}, su excelencia, es bienvenido/a a Conoce tu Vehículo RD.\n\n` +
        `Si deseas cambiar la contraseña de tu cuenta de Google, hazlo aquí: ${passwordUrl}`,
      html:
        `<p>${toName}, su excelencia, es bienvenido/a a Conoce tu Vehículo RD.</p>` +
        `<p>Si deseas cambiar la contraseña de tu cuenta de Google, hazlo aquí: <a href="${passwordUrl}">${passwordUrl}</a></p>`,
    });
  }

  return { sendWelcomeEmail };
}

export type EmailService = ReturnType<typeof createEmailService>;
