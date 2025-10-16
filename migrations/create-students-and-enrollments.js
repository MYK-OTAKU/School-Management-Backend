/**
 * Migration: Création des tables students et enrollments + permissions associées
 * Date: 2025-10-12
 * Description: Ajoute les structures nécessaires à la gestion des élèves et des inscriptions.
 */

const { sequelize } = require('../config/sequelize');

const TABLE_STUDENTS = 'students';
const TABLE_ENROLLMENTS = 'enrollments';

const PERMISSIONS = [
  { name: 'STUDENTS_VIEW', description: 'Voir les élèves' },
  { name: 'STUDENTS_CREATE', description: 'Créer des élèves' },
  { name: 'STUDENTS_UPDATE', description: 'Mettre à jour les élèves' },
  { name: 'STUDENTS_DELETE', description: 'Supprimer des élèves' },
  { name: 'ENROLLMENTS_MANAGE', description: 'Gérer les inscriptions des élèves' }
];

const normalizeTableName = (table) => table.toString().toLowerCase();

async function ensurePermissions(queryInterface) {
  console.log('🔄 Migration: Vérification des permissions élèves...');

  for (const permission of PERMISSIONS) {
    const [existing] = await sequelize.query(
      `SELECT id FROM permissions WHERE name = :name LIMIT 1`,
      { replacements: { name: permission.name } }
    );

    if (!existing?.length) {
      await queryInterface.bulkInsert('permissions', [{
        name: permission.name,
        description: permission.description,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      console.log(`✅ Permission ${permission.name} créée`);
    } else {
      console.log(`ℹ️  Permission ${permission.name} déjà présente`);
    }
  }

  const [adminRole] = await sequelize.query(
    `SELECT id FROM roles WHERE name = 'Administrateur' LIMIT 1`
  );

  if (!adminRole?.length) {
    console.log('⚠️  Rôle Administrateur introuvable, association permissions ignorée');
    return;
  }

  const roleId = adminRole[0].id;

  for (const permission of PERMISSIONS) {
    const [permissionRow] = await sequelize.query(
      `SELECT id FROM permissions WHERE name = :name LIMIT 1`,
      { replacements: { name: permission.name } }
    );

    if (!permissionRow?.length) {
      continue;
    }

    const permissionId = permissionRow[0].id;

    const [existingLink] = await sequelize.query(
      `SELECT 1 FROM role_permissions WHERE "roleId" = :roleId AND "permissionId" = :permissionId LIMIT 1`,
      { replacements: { roleId, permissionId } }
    );

    if (!existingLink?.length) {
      await queryInterface.bulkInsert('role_permissions', [{
        roleId,
        permissionId,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      console.log(`✅ Permission ${permission.name} associée au rôle Administrateur`);
    }
  }
}

async function createStudentsTable(queryInterface, tables) {
  if (tables.includes(normalizeTableName(TABLE_STUDENTS))) {
    console.log('ℹ️  La table students existe déjà, création ignorée.');
    return;
  }

  console.log('🔄 Création de la table students...');

  await queryInterface.createTable(TABLE_STUDENTS, {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: sequelize.Sequelize.STRING(120),
      allowNull: false
    },
    lastName: {
      type: sequelize.Sequelize.STRING(120),
      allowNull: false
    },
    otherNames: {
      type: sequelize.Sequelize.STRING(120),
      allowNull: true
    },
    matricule: {
      type: sequelize.Sequelize.STRING(30),
      allowNull: false,
      unique: true
    },
    gender: {
      type: sequelize.Sequelize.ENUM('M', 'F', 'O'),
      allowNull: false,
      defaultValue: 'M'
    },
    dateOfBirth: {
      type: sequelize.Sequelize.DATEONLY,
      allowNull: true
    },
    guardianName: {
      type: sequelize.Sequelize.STRING(150),
      allowNull: true
    },
    guardianPhone: {
      type: sequelize.Sequelize.STRING(30),
      allowNull: true
    },
    reductionPercent: {
      type: sequelize.Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: sequelize.Sequelize.ENUM('active', 'graduated', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    notes: {
      type: sequelize.Sequelize.TEXT,
      allowNull: true
    },
    schoolYearId: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'school_years',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    classroomId: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'classrooms',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    classGroupId: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'class_groups',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    createdAt: {
      type: sequelize.Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: sequelize.Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  await Promise.all([
    queryInterface.addIndex(TABLE_STUDENTS, ['matricule'], {
      name: 'students_matricule_idx',
      unique: true
    }),
    queryInterface.addIndex(TABLE_STUDENTS, ['schoolYearId'], {
      name: 'students_school_year_idx'
    }),
    queryInterface.addIndex(TABLE_STUDENTS, ['classroomId'], {
      name: 'students_classroom_idx'
    }),
    queryInterface.addIndex(TABLE_STUDENTS, ['classGroupId'], {
      name: 'students_class_group_idx'
    })
  ]);

  console.log('✅ Table students créée avec succès');
}

async function createEnrollmentsTable(queryInterface, tables) {
  if (tables.includes(normalizeTableName(TABLE_ENROLLMENTS))) {
    console.log('ℹ️  La table enrollments existe déjà, création ignorée.');
    return;
  }

  console.log('🔄 Création de la table enrollments...');

  await queryInterface.createTable(TABLE_ENROLLMENTS, {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: TABLE_STUDENTS,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    schoolYearId: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'school_years',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    classroomId: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'classrooms',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    classGroupId: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'class_groups',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    enrollmentDate: {
      type: sequelize.Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: sequelize.Sequelize.ENUM('active', 'transferred', 'suspended', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    notes: {
      type: sequelize.Sequelize.TEXT,
      allowNull: true
    },
    createdAt: {
      type: sequelize.Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: sequelize.Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  await Promise.all([
    queryInterface.addConstraint(TABLE_ENROLLMENTS, {
      fields: ['studentId', 'schoolYearId'],
      type: 'unique',
      name: 'enrollments_student_year_unique'
    }),
    queryInterface.addIndex(TABLE_ENROLLMENTS, ['schoolYearId'], {
      name: 'enrollments_school_year_idx'
    }),
    queryInterface.addIndex(TABLE_ENROLLMENTS, ['classroomId'], {
      name: 'enrollments_classroom_idx'
    }),
    queryInterface.addIndex(TABLE_ENROLLMENTS, ['classGroupId'], {
      name: 'enrollments_class_group_idx'
    })
  ]);

  console.log('✅ Table enrollments créée avec succès');
}

async function migrate() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log('🔄 Migration: début création students & enrollments');

    const tables = (await queryInterface.showAllTables()).map(normalizeTableName);

    await createStudentsTable(queryInterface, tables);
    await createEnrollmentsTable(queryInterface, tables);
    await ensurePermissions(queryInterface);

    console.log('🎉 Migration students & enrollments terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur migration create-students-and-enrollments:', error);
    throw error;
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('✅ Migration create-students-and-enrollments exécutée avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Échec migration create-students-and-enrollments:', error);
      process.exit(1);
    });
}

module.exports = migrate;
