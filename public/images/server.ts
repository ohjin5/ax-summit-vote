import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import voteHandler from './api/vote';
import resultsHandler from './api/results';
import adminResultsHandler from './api/admin/results';
import statusHandler from './api/status';
import adminLoginHandler from './api/admin/login';
import adminStatusHandler from './api/admin/status';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve static images directly from public/images
  app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

  // API Routes
  app.get('/api/status', (req: Request, res: Response) => statusHandler(req, res));
  app.post('/api/vote', (req: Request, res: Response) => voteHandler(req, res));
  app.get('/api/results', (req: Request, res: Response) => resultsHandler(req, res));
  app.get('/api/admin/results', (req: Request, res: Response) => adminResultsHandler(req, res));
  app.post('/api/admin/login', (req: Request, res: Response) => adminLoginHandler(req, res));
  app.post('/api/admin/status', (req: Request, res: Response) => adminStatusHandler(req, res));

  // Vite middleware setup for local development / production static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AX SUMMIT 2026 Voting Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
