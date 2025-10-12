// ================================
// MODÈLE CATEGORY - EXEMPLE DE CRUD SIMPLE
// ================================
// Ce modèle représente une catégorie de produits.
// Il sert d'exemple de CRUD simple pour le template.
//
// Relations:
//   - hasMany Product (une catégorie contient plusieurs produits)
//
// Champs:
//   - id: Identifiant unique (auto-incrémenté)
//   - name: Nom de la catégorie
//   - description: Description détaillée
//   - icon: Icône de la catégorie (emoji ou classe CSS)
//   - color: Couleur hex pour l'affichage
//   - isActive: Si la catégorie est active

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '📦',
    comment: 'Emoji ou classe d\'icône'
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#6366f1',
    validate: {
      is: /^#[0-9A-Fa-f]{6}$/
    },
    comment: 'Couleur hex pour l\'affichage'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Ordre d\'affichage des catégories'
  }
}, {
  tableName: 'categories',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['name']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['displayOrder']
    }
  ]
});

module.exports = Category;
