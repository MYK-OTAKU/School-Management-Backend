// ================================
// MODÈLE ORDER - EXEMPLE DE CRUD RELATIONNEL
// ================================
// Ce modèle représente une commande dans le système.
// Il sert d'exemple de CRUD relationnel avec les produits (OrderItems).
//
// Relations:
//   - belongsTo User (l'utilisateur qui a passé la commande)
//   - hasMany OrderItem (les produits de la commande)
//
// Champs:
//   - id: Identifiant unique (UUID)
//   - orderNumber: Numéro de commande unique
//   - userId: ID de l'utilisateur
//   - status: Statut de la commande (pending, confirmed, processing, shipped, delivered, cancelled)
//   - totalAmount: Montant total de la commande
//   - notes: Notes additionnelles

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  indexes: [
    { fields: ['orderNumber'], unique: true },
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Order;
