// ================================
// MODÈLE ENROLLMENT - INSCRIPTIONS
// ================================
// Ce modèle relie un élève à une année scolaire, une classe et un groupe.
// Responsabilités : tracer l'historique des affectations et leur statut.
// Dépendances : sequelize (config/sequelize), DataTypes.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  classroomId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  classGroupId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('active', 'transferred', 'suspended', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['studentId', 'schoolYearId'] },
    { fields: ['classroomId'] },
    { fields: ['classGroupId'] }
  ]
});

module.exports = Enrollment;
