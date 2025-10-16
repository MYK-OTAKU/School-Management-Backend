// =====================================
// MODÈLE CLASSGROUP - SOUS-GROUPE DE CLASSE
// Rôle : représenter les groupes rattachés aux classes.
// Dépendances : sequelize (config/sequelize), DataTypes.
// =====================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const ClassGroup = sequelize.define('ClassGroup', {
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
      notEmpty: { msg: 'Le nom du groupe est requis.' },
      len: { args: [1, 100], msg: 'Le nom du groupe doit contenir entre 1 et 100 caractères.' }
    }
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
  classroomId: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: 'class_groups',
  timestamps: true,
  indexes: [
    { fields: ['classroomId'] },
    { fields: ['schoolYearId'] },
    { fields: ['isActive'] }
  ]
});

module.exports = ClassGroup;
