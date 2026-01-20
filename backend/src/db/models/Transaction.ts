import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../index';

// Transaction Type Enum
export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
  Dividend = 'dividend',
  Deposit = 'deposit',
  Withdrawal = 'withdrawal'
}

// Transaction Status Enum
export enum TransactionStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Failed = 'failed'
}

// Transaction attributes
export interface TransactionAttributes {
  id: number;
  assetId: number;
  txType: TransactionType;
  status: TransactionStatus;
  amount: string;
  fromAddress?: string;
  toAddress?: string;
  description?: string;
  txHash?: string;
  blockNumber?: number;
  referenceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional fields for creation
interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'fromAddress' | 'toAddress' | 'description' | 'txHash' | 'blockNumber' | 'referenceId'> {}

// Transaction Model
class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: number;
  public assetId!: number;
  public txType!: TransactionType;
  public status!: TransactionStatus;
  public amount!: string;
  public fromAddress?: string;
  public toAddress?: string;
  public description?: string;
  public txHash?: string;
  public blockNumber?: number;
  public referenceId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
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
    txType: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TransactionStatus)),
      allowNull: false,
      defaultValue: TransactionStatus.Pending
    },
    amount: {
      type: DataTypes.DECIMAL(30, 18),
      allowNull: false,
      comment: 'Amount in wei (stored as string to preserve precision)'
    },
    fromAddress: {
      type: DataTypes.STRING(42),
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/
      }
    },
    toAddress: {
      type: DataTypes.STRING(42),
      allowNull: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    txHash: {
      type: DataTypes.STRING(66),
      allowNull: true,
      unique: true,
      validate: {
        is: /^0x[a-fA-F0-9]{64}$/
      }
    },
    blockNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referenceId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'External reference ID (invoice number, etc)'
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
    tableName: 'transactions',
    timestamps: true,
    indexes: [
      {
        fields: ['assetId']
      },
      {
        fields: ['txType']
      },
      {
        fields: ['status']
      },
      {
        fields: ['txHash']
      },
      {
        fields: ['referenceId']
      },
      {
        fields: ['createdAt']
      }
    ]
  }
);

export default Transaction;
