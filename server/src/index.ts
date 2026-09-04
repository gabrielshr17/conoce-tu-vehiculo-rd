import { createApp } from './app.js';

const {
  GOOGLE_CLIENT_ID = '',
  GMAIL_USER = '',
  GMAIL_APP_PASSWORD = '',
  ALLOWED_ORIGINS = 'https://conoce-tu-vehiculo-rd.onrender.com,http://localhost:5173',
  PORT = '3001',
} = process.env;

const app = createApp({
  googleClientId: GOOGLE_CLIENT_ID,
  gmailUser: GMAIL_USER,
  gmailAppPassword: GMAIL_APP_PASSWORD,
  allowedOrigins: ALLOWED_ORIGINS.split(','),
});

app.listen(Number(PORT), () => console.log(`API listening on ${PORT}`));
