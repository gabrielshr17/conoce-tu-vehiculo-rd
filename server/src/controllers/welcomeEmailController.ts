import type { Request, Response } from 'express';
import { enqueueWelcomeEmail } from '../queues/emailQueue.js';
import type { EmailQueue } from '../queues/emailQueue.js';
import { InvalidAccessTokenError, verifyAccessTokenAndGetProfile } from '../services/googleAuthService.js';

export function createWelcomeEmailController(emailQueue: EmailQueue, googleClientId: string) {
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
      const job = await enqueueWelcomeEmail(emailQueue, { toEmail: email, toName: profile.name ?? email });
      res.status(202).json({ ok: true, jobId: job.id });
    } catch (err) {
      console.error('failed to enqueue welcome email', err);
      res.status(502).json({ error: 'failed to enqueue welcome email' });
    }
  };
}
