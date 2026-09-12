import { Worker } from 'bullmq';
import { createRedisConnection } from './queues/connection.js';
import { EMAIL_QUEUE_NAME } from './queues/emailQueue.js';
import type { SendWelcomeEmailJobData } from './queues/emailQueue.js';
import { createEmailService } from './services/emailService.js';

const {
  REDIS_URL = 'redis://localhost:6380',
  GMAIL_USER = '',
  GMAIL_APP_PASSWORD = '',
} = process.env;

const connection = createRedisConnection(REDIS_URL);
const emailService = createEmailService(GMAIL_USER, GMAIL_APP_PASSWORD);

const worker = new Worker<SendWelcomeEmailJobData>(
  EMAIL_QUEUE_NAME,
  async (job) => {
    await emailService.sendWelcomeEmail(job.data);
  },
  { connection, concurrency: 5 },
);

worker.on('completed', (job) => {
  console.log(`email job ${job.id} sent to ${job.data.toEmail}`);
});

worker.on('failed', (job, err) => {
  console.error(`email job ${job?.id ?? 'unknown'} failed`, err);
});

console.log('email worker listening on queue', EMAIL_QUEUE_NAME);
