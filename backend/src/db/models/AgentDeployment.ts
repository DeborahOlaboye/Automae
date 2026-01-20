import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../index';

// Agent Type Enum
export enum AgentType {
  RentCollection = 'rent_collection',
  ExpenseManager = 'expense_manager',
  DividendDistribution = 'dividend_distribution',
  Maintenance = 'maintenance',
  Compliance = 'compliance',
  Notification = 'notification'
}

// Agent Status Enum
export enum AgentStatus {
  Active = 'active',
  Paused = 'paused',
  Stopped = 'stopped',
  Error = 'error'
}

// Agent Deployment attributes
export interface AgentDeploymentAttributes {
  id: number;
  assetId: number;
  agentType: AgentType;
  status: AgentStatus;
  contractAddress?: string;
  cronSchedule?: string;
  lastExecutedAt?: Date;
  nextExecutionAt?: Date;
  executionCount: number;
  errorCount: number;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Optional fields for creation
interface AgentDeploymentCreationAttributes extends Optional<AgentDeploymentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'contractAddress' | 'cronSchedule' | 'lastExecutedAt' | 'nextExecutionAt' | 'executionCount' | 'errorCount'> {}

// Agent Deployment Model
class AgentDeployment extends Model<AgentDeploymentAttributes, AgentDeploymentCreationAttributes> implements AgentDeploymentAttributes {
  public id!: number;
  public assetId!: number;
  public agentType!: AgentType;
  public status!: AgentStatus;
  public contractAddress?: string;
  public cronSchedule?: string;
  public lastExecutedAt?: Date;
  public nextExecutionAt?: Date;
  public executionCount!: number;
  public errorCount!: number;
  public config!: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AgentDeployment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    assetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assets',
        key: 'id'
      }
    },
    agentType: {
      type: DataTypes.ENUM(...Object.values(AgentType)),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AgentStatus)),
      allowNull: false,
      defaultValue: AgentStatus.Active
    },
    contractAddress: {
      type: DataTypes.STRING(42),
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/
      }
    },
    cronSchedule: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Cron expression for scheduled execution'
    },
    lastExecutedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nextExecutionAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    executionCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    errorCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'agent_deployments',
    timestamps: true,
    indexes: [
      {
        fields: ['assetId']
      },
      {
        fields: ['agentType']
      },
      {
        fields: ['status']
      },
      {
        fields: ['nextExecutionAt']
      }
    ]
  }
);

export default AgentDeployment;
