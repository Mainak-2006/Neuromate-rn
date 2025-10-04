import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { clerkMiddleware, requireAuth } from './middleware/auth';
import { apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));
  app.use(clerkMiddleware);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.send(`
      <html lang="en" className="scroll-smooth">
      <head></head>
      <body>
        <h1>Welcome to the NeuroMate API</h1>
      </body>
      </html>`);
  });

  app.use('/api', requireAuth, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;     
};

export const app = createApp();

export default app;