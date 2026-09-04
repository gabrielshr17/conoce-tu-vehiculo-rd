import type { Request, Response } from 'express';
import type { EmailService } from '../services/emailService.js';
import { InvalidAccessTokenError, verifyAccessTokenAndGetProfile } from '../services/googleAuthService.js';

export function createWelcomeEmailController(emailService: EmailService, googleClientId: string) {
  return async function handleWelcomeEmail(req: Request, res: Response): Promise<void> {
    const { accessToken } = req.body ?? {};
    if (!accessToken) {
      res.status(400).json({ error: 'missing accessToken' });
      return;
    }

    let profile;
    try {
      profile = await verifyAccessTokenAndGetProfile(accessToken, googleClientId);
    } catch (err) {
      if (err instanceof InvalidAccessTokenError) {
        res.status(401).json({ error: 'invalid access token' });
        return;
      }
      throw err;
    }

    const email = profile.email;
    if (!email) {
      res.status(400).json({ error: 'token has no email' });
      return;
    }

    try {
      await emailService.sendWelcomeEmail({ toEmail: email, toName: profile.name ?? email });
      res.json({ ok: true });
    } catch (err) {
      console.error('welcome email failed', err);
      res.status(502).json({ error: 'email send failed' });
    }
  };
}
