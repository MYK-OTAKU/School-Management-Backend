// ================================
// MODÈLE STUDENT - GESTION DES ÉLÈVES
// ================================
// Ce modèle représente un élève inscrit dans l'établissement.
// Responsabilités : stocker les informations d'état civil et de rattachement scolaire.
// Dépendances : sequelize (config/sequelize), DataTypes.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(120),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le prénom est requis.'
      },
      len: {
        args: [1, 120],
        msg: 'Le prénom doit contenir entre 1 et 120 caractères.'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(120),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le nom est requis.'
      },
      len: {
        args: [1, 120],
        msg: 'Le nom doit contenir entre 1 et 120 caractères.'
      }
    }
  },
  otherNames: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  matricule: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: {
      name: 'unique_student_matricule',
      msg: 'Un élève avec ce matricule existe déjà.'
    },
    validate: {
      notEmpty: {
        msg: 'Le matricule est requis.'
      }
    }
  },
  gender: {
    type: DataTypes.ENUM('M', 'F', 'O'),
    allowNull: false,
    defaultValue: 'M'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  guardianName: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  guardianPhone: {
    type: DataTypes.STRING(30),
    allowNull: true,
    validate: {
      is: {
        args: [/^[+0-9\s-]*$/],
        msg: 'Le numéro du tuteur doit être valide.'
      }
    }
  },
  reductionPercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'La réduction ne peut pas être négative.'
      },
      max: {
        args: [100],
        msg: 'La réduction ne peut pas dépasser 100%.'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'graduated', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
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
  }
}, {
  tableName: 'students',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['matricule'] },
    { fields: ['schoolYearId'] },
    { fields: ['classroomId'] },
    { fields: ['classGroupId'] }
  ]
});

module.exports = Student;
