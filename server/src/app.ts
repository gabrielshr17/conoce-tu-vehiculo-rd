import cors from 'cors';
import express from 'express';
import { createEnqueueTestEmailController } from './controllers/emailQueueController.js';
import { createHealthController } from './controllers/healthController.js';
import { createWelcomeEmailController } from './controllers/welcomeEmailController.js';
import { createDbPool } from './db/pool.js';
import { createRedisConnection } from './queues/connection.js';
import { createQueueDashboardRouter } from './queues/dashboard.js';
import { createEmailQueue } from './queues/emailQueue.js';

export interface AppConfig {
  googleClientId: string;
  redisUrl: string;
  databaseUrl: string;
  bullBoardUser: string;
  bullBoardPassword: string;
  allowedOrigins: string[];
}

const QUEUE_DASHBOARD_PATH = '/admin/queues';

export function createApp(config: AppConfig) {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: config.allowedOrigins }));

  const connection = createRedisConnection(config.redisUrl);
  const emailQueue = createEmailQueue(connection);
  const dbPool = createDbPool(config.databaseUrl);

  const handleWelcomeEmail = createWelcomeEmailController(emailQueue, config.googleClientId);
  const handleEnqueueTestEmail = createEnqueueTestEmailController(emailQueue);

  app.get('/health', createHealthController(dbPool, connection));
  app.post('/api/welcome-email', handleWelcomeEmail);
  app.post('/api/test/welcome-email', handleEnqueueTestEmail);

  const dashboardCredentials =
    config.bullBoardUser && config.bullBoardPassword
      ? { user: config.bullBoardUser, password: config.bullBoardPassword }
      : null;
  const dashboardRouter = createQueueDashboardRouter(emailQueue, QUEUE_DASHBOARD_PATH, dashboardCredentials);
  if (dashboardRouter) {
    app.use(QUEUE_DASHBOARD_PATH, dashboardRouter);
  }

  return app;
}
