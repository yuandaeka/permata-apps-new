import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { logger } from './config/logger';
import { requestIdMiddleware } from './middlewares/requestId.middleware';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { generalRateLimiter } from './middlewares/rateLimiter.middleware';
import { NotFoundError } from './common/errors';

import { authRouter } from './modules/auth/auth.router';
import { usersRouter } from './modules/users/users.router';
import { childrenRouter } from './modules/children/children.router';
import { organizationsRouter } from './modules/organizations/organizations.router';
import { simulationsRouter } from './modules/prevention/simulations.router';
import { assessmentsRouter } from './modules/prevention/assessments.router';
import { safetyPassportRouter } from './modules/prevention/safetyPassport.router';
import { disasterIncidentsRouter } from './modules/disaster-response/disasterIncidents.router';
import { supportRouter } from './modules/disaster-response/support.router';
import { offlineRouter } from './modules/disaster-response/offline.router';
import { recoveryJournalRouter } from './modules/recovery/recoveryJournal.router';
import { growthRouter } from './modules/recovery/growth.router';
import { careCircleRouter } from './modules/recovery/careCircle.router';
import { griefJourneyRouter } from './modules/recovery/griefJourney.router';
import { mediaRouter } from './modules/files/media.router';
import { contentRouter } from './modules/content/content.router';
import { regionsRouter } from './modules/content/regions.router';
import { dashboardRouter } from './modules/analytics/dashboard.router';
import { aiRouter } from './modules/smart-technology/ai.router';
import { adminRouter } from './modules/admin/admin.router';
import { auditRouter } from './modules/audit/audit.router';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean);
if (env.WEB_APP_URL && !allowedOrigins.includes(env.WEB_APP_URL)) {
  allowedOrigins.push(env.WEB_APP_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (
        (process.env.VERCEL || allowedOrigins.includes('*.vercel.app')) &&
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);
app.use(
  morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  })
);
app.use(generalRateLimiter);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PERMATA API',
      version: '1.0.0',
      description:
        'Backend API for PERMATA - Platform Pendampingan Anak dalam Konteks Kebencanaan',
    },
    servers: [{ url: `${env.API_BASE_URL}/api/v1`, description: 'API Server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/modules/**/*.router.ts',
    './src/modules/**/*.schema.ts',
    path.join(__dirname, 'modules/**/*.router.{ts,js}'),
    path.join(__dirname, 'modules/**/*.schema.{ts,js}'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const SWAGGER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2';
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: `${SWAGGER_CDN}/swagger-ui.min.css`,
    customJs: [
      `${SWAGGER_CDN}/swagger-ui-bundle.js`,
      `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
    ],
  })
);
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PERMATA API',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/health',
  });
});

const healthHandler: express.RequestHandler = (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: env.NODE_ENV });
};
app.get('/health', healthHandler);
app.get('/api/v1/health', healthHandler);

const API_V1 = '/api/v1';
app.use(`${API_V1}/auth`, authRouter);
app.use(`${API_V1}/users`, usersRouter);
app.use(`${API_V1}/children`, childrenRouter);
app.use(`${API_V1}/organizations`, organizationsRouter);
app.use(`${API_V1}/simulations`, simulationsRouter);
app.use(`${API_V1}/assessments`, assessmentsRouter);
app.use(`${API_V1}/safety-passport`, safetyPassportRouter);
app.use(`${API_V1}/disaster-incidents`, disasterIncidentsRouter);
app.use(`${API_V1}/support`, supportRouter);
app.use(`${API_V1}/offline`, offlineRouter);
app.use(`${API_V1}/recovery-journal`, recoveryJournalRouter);
app.use(`${API_V1}/growth`, growthRouter);
app.use(`${API_V1}/care-circle`, careCircleRouter);
app.use(`${API_V1}/grief-journey`, griefJourneyRouter);
app.use(`${API_V1}/media`, mediaRouter);
app.use(`${API_V1}/content`, contentRouter);
app.use(`${API_V1}/regions`, regionsRouter);
app.use(`${API_V1}/dashboard`, dashboardRouter);
app.use(`${API_V1}/ai`, aiRouter);
app.use(`${API_V1}/admin`, adminRouter);
app.use(`${API_V1}/audit`, auditRouter);

app.use((_req, _res, next) => {
  next(new NotFoundError('Route'));
});

app.use(errorHandlerMiddleware);

export { app };
