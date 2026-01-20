import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../index';

// User attributes interface
export interface UserAttributes {
  id: number;
  walletAddress: string;
  email?: string;
  role: 'owner' | 'investor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Optional fields for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'email'> {}

// User Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public walletAddress!: string;
  public email?: string;
  public role!: 'owner' | 'investor' | 'admin';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    walletAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      unique: true,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: DataTypes.ENUM('owner', 'investor', 'admin'),
      allowNull: false,
      defaultValue: 'investor'
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
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['walletAddress']
      },
      {
        fields: ['email']
      }
    ]
  }
);

export default User;
