import { Router } from 'express';
import assetsRouter from './assets';
import agentsRouter from './agents';
import transactionsRouter from './transactions';
import dividendsRouter from './dividends';

const router = Router();

// API Routes
router.use('/assets', assetsRouter);
router.use('/agents', agentsRouter);
router.use('/transactions', transactionsRouter);
router.use('/dividends', dividendsRouter);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Automae API',
    version: process.env.npm_package_version || '0.1.0',
    endpoints: {
      assets: '/assets',
      agents: '/agents',
      transactions: '/transactions',
      dividends: '/dividends'
    }
  });
});

export default router;
