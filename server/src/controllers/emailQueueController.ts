import type { Request, Response } from 'express';
import { enqueueWelcomeEmail } from '../queues/emailQueue.js';
import type { EmailQueue } from '../queues/emailQueue.js';

export function createEnqueueTestEmailController(emailQueue: EmailQueue) {
  return async function handleEnqueueTestEmail(req: Request, res: Response): Promise<void> {
    const { toEmail, toName } = req.body ?? {};

    if (typeof toEmail !== 'string' || !toEmail.includes('@')) {
      res.status(400).json({ error: 'toEmail must be a valid email' });
      return;
    }
    if (typeof toName !== 'string' || !toName.trim()) {
      res.status(400).json({ error: 'toName is required' });
      return;
    }

    try {
      const job = await enqueueWelcomeEmail(emailQueue, { toEmail, toName });
      res.status(202).json({ ok: true, jobId: job.id });
    } catch (err) {
      console.error('failed to enqueue test email', err);
      res.status(500).json({ error: 'failed to enqueue email job' });
    }
  };
}
