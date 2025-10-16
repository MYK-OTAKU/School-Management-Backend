// ================================
// MODÈLE PAYMENT - GESTION DES PAIEMENTS ÉTUDIANTS
// ================================
// Ce modèle représente un paiement effectué par un élève.
// Responsabilités : stocker les montants réglés, le solde restant et les métadonnées financières.
// Dépendances : sequelize (config/sequelize), DataTypes.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  schoolYearId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Le montant payé doit être supérieur ou égal à 0.'
      }
    }
  },
  expectedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  appliedDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  balanceRemaining: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  type: {
    type: DataTypes.ENUM('registration', 'tuition', 'transport', 'misc'),
    allowNull: false,
    defaultValue: 'tuition'
  },
  method: {
    type: DataTypes.ENUM('cash', 'card', 'transfer', 'mobile_money', 'check'),
    allowNull: false,
    defaultValue: 'cash'
  },
  reference: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: {
      name: 'unique_payment_reference',
      msg: 'Cette référence de paiement existe déjà.'
    }
  },
  status: {
    type: DataTypes.ENUM('paid', 'partial', 'pending', 'cancelled'),
    allowNull: false,
    defaultValue: 'paid'
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recordedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  indexes: [
    { fields: ['studentId'] },
    { fields: ['schoolYearId'] },
    { unique: true, fields: ['reference'] },
    { fields: ['status'] }
  ]
});

module.exports = Payment;
