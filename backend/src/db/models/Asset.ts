import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../index';

// Asset Type Enum
export enum AssetType {
  RealEstate = 'RealEstate',
  Equipment = 'Equipment',
  Invoice = 'Invoice',
  SupplyChain = 'SupplyChain',
  Other = 'Other'
}

// Asset State Enum
export enum AssetState {
  Draft = 'Draft',
  Active = 'Active',
  Maintenance = 'Maintenance',
  Disputed = 'Disputed',
  Suspended = 'Suspended',
  Retired = 'Retired'
}

// Asset attributes interface
export interface AssetAttributes {
  id: number;
  onChainId: number;
  assetType: AssetType;
  state: AssetState;
  name: string;
  description?: string;
  physicalAddress?: string;
  tokenAddress: string;
  totalShares: number;
  treasuryAddress: string;
  metadataURI?: string;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Optional fields for creation
interface AssetCreationAttributes extends Optional<AssetAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Asset Model
class Asset extends Model<AssetAttributes, AssetCreationAttributes> implements AssetAttributes {
  public id!: number;
  public onChainId!: number;
  public assetType!: AssetType;
  public state!: AssetState;
  public name!: string;
  public description?: string;
  public physicalAddress?: string;
  public tokenAddress!: string;
  public totalShares!: number;
  public treasuryAddress!: string;
  public metadataURI?: string;
  public ownerId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Asset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    onChainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: 'Asset ID on blockchain'
    },
    assetType: {
      type: DataTypes.ENUM(...Object.values(AssetType)),
      allowNull: false
    },
    state: {
      type: DataTypes.ENUM(...Object.values(AssetState)),
      allowNull: false,
      defaultValue: AssetState.Draft
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    physicalAddress: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    tokenAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/
      }
    },
    totalShares: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    treasuryAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/
      }
    },
    metadataURI: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'IPFS hash or URI for detailed metadata'
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
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
    tableName: 'assets',
    timestamps: true,
    indexes: [
      {
        fields: ['onChainId']
      },
      {
        fields: ['ownerId']
      },
      {
        fields: ['state']
      },
      {
        fields: ['assetType']
      }
    ]
  }
);

export default Asset;
