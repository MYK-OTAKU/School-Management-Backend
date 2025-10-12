// ================================
// MODÈLE PRODUCT - EXEMPLE DE CRUD RELATIONNEL
// ================================
// Ce modèle représente un produit dans le système.
// Il sert d'exemple de CRUD relationnel avec les catégories.
//
// Relations:
//   - belongsTo Category (un produit appartient à une catégorie)
//
// Champs:
//   - id: Identifiant unique (auto-incrémenté)
//   - name: Nom du produit
//   - description: Description détaillée
//   - price: Prix (décimal)
//   - stock: Quantité en stock
//   - categoryId: ID de la catégorie
//   - imageUrl: URL de l'image du produit
//   - isActive: Statut actif/inactif

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Product = sequelize.define('Product', {
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
      notEmpty: { msg: 'Le nom ne peut pas être vide' },
      len: { args: [3, 100], msg: 'Le nom doit contenir entre 3 et 100 caractères' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'Le prix doit être un nombre décimal' },
      min: { args: [0], msg: 'Le prix ne peut pas être négatif' }
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: 'Le stock doit être un nombre entier' },
      min: { args: [0], msg: 'Le stock ne peut pas être négatif' }
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrlOrEmpty(value) {
        if (value && value.trim() !== '') {
          // Valider uniquement si une valeur est fournie
          const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
          if (!urlRegex.test(value)) {
            throw new Error('URL d\'image invalide');
          }
        }
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['categoryId'] },
    { fields: ['isActive'] },
    { fields: ['price'] }
  ]
});

module.exports = Product;
