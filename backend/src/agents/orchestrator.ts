import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import cron from 'node-cron';

// Agent Status
export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  ERROR = 'error',
  STOPPED = 'stopped'
}

// Agent Type
export enum AgentType {
  RENT_COLLECTION = 'rent_collection',
  EXPENSE_MANAGER = 'expense_manager',
  DIVIDEND_DISTRIBUTION = 'dividend_distribution',
  MAINTENANCE = 'maintenance',
  COMPLIANCE = 'compliance',
  NOTIFICATION = 'notification'
}

// Base Agent Interface
export interface IAgent {
  id: string;
  type: AgentType;
  assetId: number;
  status: AgentStatus;
  lastRun?: Date;
  nextRun?: Date;
  config: Record<string, any>;

  initialize(): Promise<void>;
  execute(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): AgentStatus;
}

// Agent Registration
interface AgentRegistration {
  agent: IAgent;
  schedule?: string; // cron expression
  cronJob?: cron.ScheduledTask;
}

/**
 * Agent Orchestrator
 * Manages lifecycle of all AI agents
 */
export class AgentOrchestrator extends EventEmitter {
  private static instance: AgentOrchestrator;
  private agents: Map<string, AgentRegistration> = new Map();
  private initialized: boolean = false;

  private constructor() {
    super();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Initialize the orchestrator
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      logger.warn('Agent Orchestrator already initialized');
      return;
    }

    logger.info('Initializing Agent Orchestrator...');

    // Set up event listeners
    this.on('agent:started', (agentId: string) => {
      logger.info(`Agent started: ${agentId}`);
    });

    this.on('agent:stopped', (agentId: string) => {
      logger.info(`Agent stopped: ${agentId}`);
    });

    this.on('agent:error', (agentId: string, error: Error) => {
      logger.error(`Agent error: ${agentId}`, error);
    });

    this.on('agent:completed', (agentId: string) => {
      logger.info(`Agent completed execution: ${agentId}`);
    });

    this.initialized = true;
    logger.info('Agent Orchestrator initialized successfully');
  }

  /**
   * Register an agent
   */
  public registerAgent(agent: IAgent, schedule?: string): void {
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent ${agent.id} already registered`);
    }

    logger.info(`Registering agent: ${agent.id} (${agent.type})`);

    const registration: AgentRegistration = { agent };

    // Set up scheduled execution if cron schedule provided
    if (schedule) {
      logger.info(`Setting up cron schedule for agent ${agent.id}: ${schedule}`);

      registration.schedule = schedule;
      registration.cronJob = cron.schedule(schedule, async () => {
        await this.executeAgent(agent.id);
      }, {
        scheduled: true,
        timezone: 'UTC'
      });
    }

    this.agents.set(agent.id, registration);
    this.emit('agent:registered', agent.id);
  }

  /**
   * Unregister an agent
   */
  public async unregisterAgent(agentId: string): Promise<void> {
    const registration = this.agents.get(agentId);
    if (!registration) {
      throw new Error(`Agent ${agentId} not found`);
    }

    logger.info(`Unregistering agent: ${agentId}`);

    // Stop cron job if exists
    if (registration.cronJob) {
      registration.cronJob.stop();
    }

    // Stop the agent
    await registration.agent.stop();

    this.agents.delete(agentId);
    this.emit('agent:unregistered', agentId);
  }

  /**
   * Execute an agent
   */
  public async executeAgent(agentId: string): Promise<void> {
    const registration = this.agents.get(agentId);
    if (!registration) {
      throw new Error(`Agent ${agentId} not found`);
    }

    const { agent } = registration;

    if (agent.status === AgentStatus.RUNNING) {
      logger.warn(`Agent ${agentId} is already running, skipping execution`);
      return;
    }

    try {
      logger.info(`Executing agent: ${agentId}`);
      this.emit('agent:started', agentId);

      await agent.execute();

      this.emit('agent:completed', agentId);
    } catch (error) {
      logger.error(`Error executing agent ${agentId}:`, error);
      this.emit('agent:error', agentId, error);
      throw error;
    }
  }

  /**
   * Stop an agent
   */
  public async stopAgent(agentId: string): Promise<void> {
    const registration = this.agents.get(agentId);
    if (!registration) {
      throw new Error(`Agent ${agentId} not found`);
    }

    logger.info(`Stopping agent: ${agentId}`);

    // Stop cron job if exists
    if (registration.cronJob) {
      registration.cronJob.stop();
    }

    await registration.agent.stop();
    this.emit('agent:stopped', agentId);
  }

  /**
   * Start a stopped agent
   */
  public async startAgent(agentId: string): Promise<void> {
    const registration = this.agents.get(agentId);
    if (!registration) {
      throw new Error(`Agent ${agentId} not found`);
    }

    logger.info(`Starting agent: ${agentId}`);

    // Restart cron job if exists
    if (registration.cronJob) {
      registration.cronJob.start();
    }

    await registration.agent.initialize();
    this.emit('agent:started', agentId);
  }

  /**
   * Get agent status
   */
  public getAgentStatus(agentId: string): AgentStatus {
    const registration = this.agents.get(agentId);
    if (!registration) {
      throw new Error(`Agent ${agentId} not found`);
    }

    return registration.agent.getStatus();
  }

  /**
   * Get all agents for an asset
   */
  public getAssetAgents(assetId: number): IAgent[] {
    const assetAgents: IAgent[] = [];

    for (const [, registration] of this.agents) {
      if (registration.agent.assetId === assetId) {
        assetAgents.push(registration.agent);
      }
    }

    return assetAgents;
  }

  /**
   * Get all agents
   */
  public getAllAgents(): IAgent[] {
    return Array.from(this.agents.values()).map(reg => reg.agent);
  }

  /**
   * Get agent by ID
   */
  public getAgent(agentId: string): IAgent | undefined {
    return this.agents.get(agentId)?.agent;
  }

  /**
   * Shutdown orchestrator
   */
  public async shutdown(): Promise<void> {
    logger.info('Shutting down Agent Orchestrator...');

    // Stop all agents
    const stopPromises: Promise<void>[] = [];

    for (const [agentId, registration] of this.agents) {
      logger.info(`Stopping agent: ${agentId}`);

      if (registration.cronJob) {
        registration.cronJob.stop();
      }

      stopPromises.push(registration.agent.stop());
    }

    await Promise.all(stopPromises);

    this.agents.clear();
    this.initialized = false;

    logger.info('Agent Orchestrator shut down successfully');
  }

  /**
   * Get orchestrator status
   */
  public getStatus(): {
    initialized: boolean;
    totalAgents: number;
    agentsByStatus: Record<AgentStatus, number>;
    agentsByType: Record<AgentType, number>;
  } {
    const agentsByStatus: Record<AgentStatus, number> = {
      [AgentStatus.IDLE]: 0,
      [AgentStatus.RUNNING]: 0,
      [AgentStatus.ERROR]: 0,
      [AgentStatus.STOPPED]: 0
    };

    const agentsByType: Record<AgentType, number> = {
      [AgentType.RENT_COLLECTION]: 0,
      [AgentType.EXPENSE_MANAGER]: 0,
      [AgentType.DIVIDEND_DISTRIBUTION]: 0,
      [AgentType.MAINTENANCE]: 0,
      [AgentType.COMPLIANCE]: 0,
      [AgentType.NOTIFICATION]: 0
    };

    for (const [, registration] of this.agents) {
      const agent = registration.agent;
      agentsByStatus[agent.status]++;
      agentsByType[agent.type]++;
    }

    return {
      initialized: this.initialized,
      totalAgents: this.agents.size,
      agentsByStatus,
      agentsByType
    };
  }
}

export default AgentOrchestrator;
