/**
 * Migration: Création des tables classrooms et class_groups + permissions associées
 * Date: 2025-10-12
 */

const { sequelize } = require('../config/sequelize');

async function migrate() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log('🔄 Migration: Création des tables classrooms et class_groups...');

    const tables = await queryInterface.showAllTables();

    if (!tables.includes('classrooms')) {
      await queryInterface.createTable('classrooms', {
        id: {
          type: sequelize.Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: sequelize.Sequelize.STRING(100),
          allowNull: false
        },
        level: {
          type: sequelize.Sequelize.STRING(50),
          allowNull: true
        },
        description: {
          type: sequelize.Sequelize.TEXT,
          allowNull: true
        },
        capacity: {
          type: sequelize.Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 30
        },
        monthlyFee: {
          type: sequelize.Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        schoolYearId: {
          type: sequelize.Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'school_years',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        isActive: {
          type: sequelize.Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
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

      await queryInterface.addConstraint('classrooms', {
        fields: ['schoolYearId', 'name'],
        type: 'unique',
        name: 'classrooms_school_year_id_name_unique'
      });

      await queryInterface.addIndex('classrooms', ['schoolYearId'], {
        name: 'classrooms_school_year_id_idx'
      });

      await queryInterface.addIndex('classrooms', ['isActive'], {
        name: 'classrooms_is_active_idx'
      });

      console.log('✅ Table classrooms créée');
    } else {
      console.log('ℹ️  La table classrooms existe déjà');
    }

    if (!tables.includes('class_groups')) {
      await queryInterface.createTable('class_groups', {
        id: {
          type: sequelize.Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: sequelize.Sequelize.STRING(100),
          allowNull: false
        },
        description: {
          type: sequelize.Sequelize.TEXT,
          allowNull: true
        },
        capacity: {
          type: sequelize.Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 30
        },
        classroomId: {
          type: sequelize.Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'classrooms',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        schoolYearId: {
          type: sequelize.Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'school_years',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        isActive: {
          type: sequelize.Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
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

      await queryInterface.addConstraint('class_groups', {
        fields: ['classroomId', 'name'],
        type: 'unique',
        name: 'class_groups_classroom_id_name_unique'
      });

      await queryInterface.addIndex('class_groups', ['classroomId'], {
        name: 'class_groups_classroom_id_idx'
      });

      await queryInterface.addIndex('class_groups', ['schoolYearId'], {
        name: 'class_groups_school_year_id_idx'
      });

      await queryInterface.addIndex('class_groups', ['isActive'], {
        name: 'class_groups_is_active_idx'
      });

      console.log('✅ Table class_groups créée');
    } else {
      console.log('ℹ️  La table class_groups existe déjà');
    }

    const permissions = [
      { name: 'CLASSES_VIEW', description: 'Voir les classes' },
      { name: 'CLASSES_CREATE', description: 'Créer des classes' },
      { name: 'CLASSES_UPDATE', description: 'Mettre à jour des classes' },
      { name: 'CLASSES_DELETE', description: 'Supprimer des classes' }
    ];

    const now = new Date();

    for (const permission of permissions) {
      const [existing] = await sequelize.query(
        `SELECT id FROM permissions WHERE name = '${permission.name}' LIMIT 1`
      );

      if (!existing || existing.length === 0) {
        await queryInterface.bulkInsert('permissions', [{
          name: permission.name,
          description: permission.description,
          createdAt: now,
          updatedAt: now
        }]);
        console.log(`✅ Permission ${permission.name} créée`);
      } else {
        console.log(`ℹ️  Permission ${permission.name} déjà présente`);
      }
    }

    const [adminRole] = await sequelize.query(
      "SELECT id FROM roles WHERE name = 'Administrateur' LIMIT 1"
    );

    if (adminRole?.length) {
      const roleId = adminRole[0].id;

      for (const permission of permissions) {
        const [permissionRow] = await sequelize.query(
          `SELECT id FROM permissions WHERE name = '${permission.name}' LIMIT 1`
        );

        if (permissionRow?.length) {
          const permissionId = permissionRow[0].id;

          const [existingLink] = await sequelize.query(
            `SELECT 1 FROM role_permissions WHERE "roleId" = ${roleId} AND "permissionId" = ${permissionId} LIMIT 1`
          );

          if (!existingLink || existingLink.length === 0) {
            await queryInterface.bulkInsert('role_permissions', [{
              roleId,
              permissionId,
              createdAt: now,
              updatedAt: now
            }]);
            console.log(`✅ Permission ${permission.name} assignée à Administrateur`);
          }
        }
      }
    } else {
      console.log('⚠️  Rôle Administrateur introuvable, permissions non assignées');
    }

    console.log('🎉 Migration classes/groups terminée !');
  } catch (error) {
    console.error('❌ Erreur migration classes/groups:', error);
    throw error;
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('✅ Migration create-classrooms-and-classgroups exécutée');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Échec migration create-classrooms-and-classgroups:', error);
      process.exit(1);
    });
}

module.exports = migrate;
