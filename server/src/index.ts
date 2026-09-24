import { createApp } from './app.js';

const {
  GOOGLE_CLIENT_ID = '',
  REDIS_URL = 'redis://localhost:6380',
  DATABASE_URL = '',
  BULL_BOARD_USER = '',
  BULL_BOARD_PASSWORD = '',
  ALLOWED_ORIGINS = 'https://conoce-tu-vehiculo-rd.onrender.com,http://localhost:5173',
  PORT = '3001',
} = process.env;

const app = createApp({
  googleClientId: GOOGLE_CLIENT_ID,
  redisUrl: REDIS_URL,
  databaseUrl: DATABASE_URL,
  bullBoardUser: BULL_BOARD_USER,
  bullBoardPassword: BULL_BOARD_PASSWORD,
  allowedOrigins: ALLOWED_ORIGINS.split(','),
});

app.listen(Number(PORT), () => console.log(`API listening on ${PORT}`));
