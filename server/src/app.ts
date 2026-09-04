import cors from 'cors';
import express from 'express';
import { createWelcomeEmailController } from './controllers/welcomeEmailController.js';
import { createEmailService } from './services/emailService.js';

export interface AppConfig {
  googleClientId: string;
  gmailUser: string;
  gmailAppPassword: string;
  allowedOrigins: string[];
}

export function createApp(config: AppConfig) {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: config.allowedOrigins }));

  const emailService = createEmailService(config.gmailUser, config.gmailAppPassword);
  const handleWelcomeEmail = createWelcomeEmailController(emailService, config.googleClientId);

  app.post('/api/welcome-email', handleWelcomeEmail);

  return app;
}
