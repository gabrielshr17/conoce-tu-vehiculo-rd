import { Queue } from 'bullmq';
import type { Redis } from 'ioredis';

export const EMAIL_QUEUE_NAME = 'email';

export interface SendWelcomeEmailJobData {
  toEmail: string;
  toName: string;
}

export function createEmailQueue(connection: Redis) {
  return new Queue<SendWelcomeEmailJobData>(EMAIL_QUEUE_NAME, { connection });
}

export type EmailQueue = ReturnType<typeof createEmailQueue>;

export async function enqueueWelcomeEmail(queue: EmailQueue, data: SendWelcomeEmailJobData) {
  return queue.add('send-welcome-email', data, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { age: 86400, count: 1000 },
    removeOnFail: { age: 604800 },
  });
}
