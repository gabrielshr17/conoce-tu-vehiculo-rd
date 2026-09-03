import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';

const {
  GOOGLE_CLIENT_ID,
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  ALLOWED_ORIGINS = 'https://conoce-tu-vehiculo-rd.onrender.com,http://localhost:5173',
  PORT = 3001,
} = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

const app = express();
app.use(express.json());
app.use(cors({ origin: ALLOWED_ORIGINS.split(',') }));

/**
 * `accessToken` es un token opaco (no un JWT), así que no hay nada que
 * decodificar localmente: Google mismo lo valida en cada llamada.
 * tokeninfo confirma que el token se emitió para nuestro client_id;
 * userinfo, ya autenticado con ese token, entrega el perfil.
 */
async function verifyAccessTokenAndGetProfile(accessToken) {
  const tokenInfoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
  );
  if (!tokenInfoRes.ok) throw new Error('invalid access token');
  const tokenInfo = await tokenInfoRes.json();
  if (tokenInfo.aud !== GOOGLE_CLIENT_ID) throw new Error('audience mismatch');

  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userInfoRes.ok) throw new Error('failed to fetch profile');
  return userInfoRes.json();
}

app.post('/api/welcome-email', async (req, res) => {
  const { accessToken } = req.body ?? {};
  if (!accessToken) return res.status(400).json({ error: 'missing accessToken' });

  let profile;
  try {
    profile = await verifyAccessTokenAndGetProfile(accessToken);
  } catch {
    return res.status(401).json({ error: 'invalid access token' });
  }

  const email = profile?.email;
  if (!email) return res.status(400).json({ error: 'token has no email' });
  const name = profile.name ?? email;

  const passwordUrl = 'https://myaccount.google.com/signinoptions/password';

  try {
    await transporter.sendMail({
      from: `"Conoce tu Vehículo RD" <${GMAIL_USER}>`,
      to: email,
      subject: 'Bienvenido/a a Conoce tu Vehículo RD',
      text:
        `${name}, su excelencia, es bienvenido/a a Conoce tu Vehículo RD.\n\n` +
        `Si deseas cambiar la contraseña de tu cuenta de Google, hazlo aquí: ${passwordUrl}`,
      html:
        `<p>${name}, su excelencia, es bienvenido/a a Conoce tu Vehículo RD.</p>` +
        `<p>Si deseas cambiar la contraseña de tu cuenta de Google, hazlo aquí: <a href="${passwordUrl}">${passwordUrl}</a></p>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('welcome email failed', err);
    res.status(502).json({ error: 'email send failed' });
  }
});

app.listen(PORT, () => console.log(`API listening on ${PORT}`));
