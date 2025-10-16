// =====================================
// MODÈLE CLASSROOM - STRUCTURE DE CLASSE
// Rôle : stocker les classes par année scolaire.
// Dépendances : sequelize (config/sequelize), DataTypes.
// =====================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const ClassRoom = sequelize.define('ClassRoom', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le nom de la classe est requis.' },
      len: { args: [2, 100], msg: 'Le nom doit contenir entre 2 et 100 caractères.' }
    }
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    validate: {
      min: { args: [1], msg: 'La capacité doit être au moins de 1.' }
    }
  },
  monthlyFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: { args: [0], msg: 'Le montant doit être positif.' }
    }
  },
  schoolYearId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'classrooms',
  timestamps: true,
  indexes: [
    { fields: ['schoolYearId'] },
    { fields: ['isActive'] }
  ]
});

module.exports = ClassRoom;
