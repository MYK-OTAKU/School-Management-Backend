/**
 * Migration: Création de la table school_years et permission associée
 * Date: 2025-10-12
 * Description: Crée la table des années scolaires et enregistre la permission SCHOOL_YEARS_MANAGE.
 */

const { sequelize } = require('../config/sequelize');

async function migrate() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log('🔄 Migration: Création de la table school_years...');

    const tables = await queryInterface.showAllTables();
    const tableName = 'school_years';

    if (!tables.includes(tableName)) {
      await queryInterface.createTable(tableName, {
        id: {
          type: sequelize.Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: sequelize.Sequelize.STRING(20),
          allowNull: false,
          unique: true
        },
        startDate: {
          type: sequelize.Sequelize.DATE,
          allowNull: true
        },
        endDate: {
          type: sequelize.Sequelize.DATE,
          allowNull: true
        },
        isActive: {
          type: sequelize.Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
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

      await queryInterface.addIndex(tableName, ['isActive'], {
        name: 'school_years_is_active_idx'
      });

      console.log('✅ Table school_years créée avec succès');
    } else {
      console.log('ℹ️  La table school_years existe déjà, création ignorée.');
    }

    // Insérer la permission SCHOOL_YEARS_MANAGE si elle n'existe pas déjà
    console.log('🔄 Vérification de la permission SCHOOL_YEARS_MANAGE...');
    const [existingPermissions] = await sequelize.query(
      "SELECT id FROM permissions WHERE name = 'SCHOOL_YEARS_MANAGE' LIMIT 1"
    );

    if (!existingPermissions || existingPermissions.length === 0) {
      await queryInterface.bulkInsert('permissions', [{
        name: 'SCHOOL_YEARS_MANAGE',
        description: 'Gestion des années scolaires',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      console.log('✅ Permission SCHOOL_YEARS_MANAGE créée');
    } else {
      console.log('ℹ️  La permission SCHOOL_YEARS_MANAGE existe déjà');
    }

    // Associer la permission au rôle Administrateur si disponible
    console.log('🔄 Association de la permission au rôle Administrateur...');
    const [adminRole] = await sequelize.query(
      "SELECT id FROM roles WHERE name = 'Administrateur' LIMIT 1"
    );

    const [permission] = await sequelize.query(
      "SELECT id FROM permissions WHERE name = 'SCHOOL_YEARS_MANAGE' LIMIT 1"
    );

    if (adminRole?.length && permission?.length) {
      const roleId = adminRole[0].id;
      const permissionId = permission[0].id;

      const [existingLink] = await sequelize.query(
        `SELECT * FROM role_permissions WHERE "roleId" = ${roleId} AND "permissionId" = ${permissionId} LIMIT 1`
      );

      if (!existingLink || existingLink.length === 0) {
        await queryInterface.bulkInsert('role_permissions', [{
          roleId,
          permissionId,
          createdAt: new Date(),
          updatedAt: new Date()
        }]);

        console.log('✅ Permission SCHOOL_YEARS_MANAGE associée au rôle Administrateur');
      } else {
        console.log('ℹ️  La permission est déjà associée au rôle Administrateur');
      }
    } else {
      console.log('⚠️  Impossible d\'associer la permission : rôle ou permission introuvable');
    }

    console.log('🎉 Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration create-school-years:', error);
    throw error;
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('✅ Migration create-school-years exécutée avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Échec de la migration create-school-years:', error);
      process.exit(1);
    });
}

module.exports = migrate;
