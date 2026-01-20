import { Router, Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { AgentOrchestrator } from '../../agents/orchestrator';

const router = Router();

/**
 * GET /api/v1/agents
 * Get all agents
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const orchestrator = AgentOrchestrator.getInstance();
    const agents = orchestrator.getAllAgents();

    res.json({
      success: true,
      data: agents.map(agent => ({
        id: agent.id,
        type: agent.type,
        assetId: agent.assetId,
        status: agent.status,
        lastRun: agent.lastRun,
        nextRun: agent.nextRun
      }))
    });
  } catch (error) {
    logger.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents'
    });
  }
});

/**
 * GET /api/v1/agents/:id
 * Get agent by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orchestrator = AgentOrchestrator.getInstance();
    const agent = orchestrator.getAgent(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: agent.id,
        type: agent.type,
        assetId: agent.assetId,
        status: agent.status,
        lastRun: agent.lastRun,
        nextRun: agent.nextRun,
        config: agent.config
      }
    });
  } catch (error) {
    logger.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent'
    });
  }
});

/**
 * POST /api/v1/agents/:id/execute
 * Manually execute an agent
 */
router.post('/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orchestrator = AgentOrchestrator.getInstance();

    await orchestrator.executeAgent(id);

    res.json({
      success: true,
      message: `Agent ${id} executed successfully`
    });
  } catch (error) {
    logger.error('Error executing agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute agent'
    });
  }
});

/**
 * POST /api/v1/agents/:id/stop
 * Stop an agent
 */
router.post('/:id/stop', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orchestrator = AgentOrchestrator.getInstance();

    await orchestrator.stopAgent(id);

    res.json({
      success: true,
      message: `Agent ${id} stopped successfully`
    });
  } catch (error) {
    logger.error('Error stopping agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop agent'
    });
  }
});

/**
 * POST /api/v1/agents/:id/start
 * Start a stopped agent
 */
router.post('/:id/start', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orchestrator = AgentOrchestrator.getInstance();

    await orchestrator.startAgent(id);

    res.json({
      success: true,
      message: `Agent ${id} started successfully`
    });
  } catch (error) {
    logger.error('Error starting agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start agent'
    });
  }
});

/**
 * GET /api/v1/agents/status
 * Get orchestrator status
 */
router.get('/status/overview', async (req: Request, res: Response) => {
  try {
    const orchestrator = AgentOrchestrator.getInstance();
    const status = orchestrator.getStatus();

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Error fetching orchestrator status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch status'
    });
  }
});

export default router;
