// ================================
// MODÈLE SCHOOLYEAR - ANNEE SCOLAIRE
// ================================
// Ce modèle représente une année scolaire dans le système.
// Responsabilités : stocker les informations de période scolaire et l'état actif.
// Dépendances : sequelize (config/sequelize), DataTypes.

const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const SchoolYear = sequelize.define('SchoolYear', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      name: 'unique_school_year_name',
      msg: 'Une année scolaire avec ce nom existe déjà.'
    },
    validate: {
      notEmpty: {
        msg: 'Le nom de l\'année scolaire est requis.'
      },
      len: {
        args: [4, 20],
        msg: 'Le nom de l\'année scolaire doit contenir entre 4 et 20 caractères.'
      },
      isValidFormat(value) {
        const pattern = /^(19|20)\d{2}-(19|20)\d{2}$/;
        if (!pattern.test(value)) {
          throw new Error('Le format du nom doit être AAAA-AAAA (ex: 2024-2025).');
        }
      }
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isAfterStartDate(value) {
        if (value && this.startDate && new Date(value) < new Date(this.startDate)) {
          throw new Error('La date de fin doit être postérieure à la date de début.');
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'school_years',
  timestamps: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['isActive'] }
  ]
});

module.exports = SchoolYear;
