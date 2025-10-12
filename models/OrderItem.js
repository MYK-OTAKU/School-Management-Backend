// ================================
// MODÈLE ORDERITEM - TABLE DE JONCTION ENRICHIE
// ================================
// Ce modèle représente les produits dans une commande.
// C'est une table de jonction enrichie entre Order et Product.
//
// Relations:
//   - belongsTo Order (la commande associée)
//   - belongsTo Product (le produit commandé)
//
// Champs:
//   - id: Identifiant unique (auto-incrémenté)
//   - orderId: ID de la commande (INTEGER)
//   - productId: ID du produit (INTEGER)
//   - quantity: Quantité commandée
//   - unitPrice: Prix unitaire au moment de la commande
//   - subtotal: Sous-total (quantity * unitPrice)

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La quantité doit être au moins 1' }
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  indexes: [
    { fields: ['orderId'] },
    { fields: ['productId'] }
  ]
});

module.exports = OrderItem;
