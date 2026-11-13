import 'express';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';

async function start() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    const server = app.listen(env.PORT, () => {
      logger.info(`PERMATA API running on port ${env.PORT}`, {
        environment: env.NODE_ENV,
        docs: `${env.API_BASE_URL}/api/docs`,
      });
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Server and database connection closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  start();
}

export default app;
