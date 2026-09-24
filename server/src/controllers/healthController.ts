import type { Request, Response } from 'express';
import type { Redis } from 'ioredis';
import type { Pool } from 'pg';

export function createHealthController(pool: Pool, redis: Redis) {
  return async function handleHealth(_req: Request, res: Response): Promise<void> {
    try {
      await Promise.all([pool.query('SELECT 1'), redis.ping()]);
      res.status(200).json({ status: 'ok', db: 'up', redis: 'up' });
    } catch (err) {
      console.error('health check failed', err);
      res.status(503).json({ status: 'unavailable' });
    }
  };
}
