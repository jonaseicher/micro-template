import { DataTypes } from 'sequelize';
import sequelize from './sequelize';

const Doctor = sequelize.define(
  'Doctor',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  },
);

// `sequelize.define` also returns the model
console.log(Doctor === sequelize.models.Doctor); // true
