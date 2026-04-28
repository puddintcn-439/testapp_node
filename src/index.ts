import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import * as Sentry from '@sentry/node';
import { initDb } from './config/db';
import { swaggerSpec } from './config/swagger';
import userRoutes from './routes/userRoutes';
import metricsRoutes from './routes/metricsRoutes';
import authRoutes from './routes/authRoutes';
import healthRoutes from './routes/healthRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'https://testapp-node.vercel.app'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/health', healthRoutes);
app.use('/metrics', metricsRoutes);
app.use('/api/bookings', bookingRoutes);

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV || 'production' });
  app.use(Sentry.Handlers.requestHandler());
}

// Sentry error handler (if enabled) should be registered after routes
if (process.env.SENTRY_DSN) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SentryReq = require('@sentry/node');
  app.use(SentryReq.Handlers.errorHandler());
}

export { app, initDb };

// Only start the HTTP server when running locally (not on Vercel)
if (!process.env.VERCEL) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  initDb()
    .then(() => {
      app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
    })
    .catch((err) => {
      console.warn('DB init failed; starting server without DB:', err.message || err);
      app.listen(port, () =>
        console.log(`Server running at http://localhost:${port} (DB unavailable)`),
      );
    });
}
