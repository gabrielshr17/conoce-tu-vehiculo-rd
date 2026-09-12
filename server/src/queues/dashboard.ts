import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import type { EmailQueue } from './emailQueue.js';

export interface DashboardCredentials {
  user: string;
  password: string;
}

function createBasicAuthMiddleware({ user, password }: DashboardCredentials) {
  return function basicAuth(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization ?? '';
    const [scheme, encoded] = header.split(' ');
    if (scheme === 'Basic' && encoded) {
      const [reqUser, reqPassword] = Buffer.from(encoded, 'base64').toString().split(':');
      if (reqUser === user && reqPassword === password) {
        next();
        return;
      }
    }
    res.set('WWW-Authenticate', 'Basic realm="Bull Board"');
    res.status(401).send('authentication required');
  };
}

export function createQueueDashboardRouter(
  emailQueue: EmailQueue,
  basePath: string,
  credentials: DashboardCredentials | null,
): Router | null {
  if (!credentials) return null;

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath(basePath);
  createBullBoard({ queues: [new BullMQAdapter(emailQueue)], serverAdapter });

  const router = Router();
  router.use(createBasicAuthMiddleware(credentials));
  router.use(serverAdapter.getRouter());
  return router;
}
