/**
 * Script de seed pour ajouter les permissions CATEGORIES
 * À exécuter après la création de la base de données
 */

const { Permission, Role, RolePermission } = require('../models');
const { sequelize } = require('../config/sequelize');

async function seedCategoryPermissions() {
  try {
    console.log('🌱 Début du seed des permissions Categories...');

    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');

    // Permissions à créer
    const categoryPermissions = [
      {
        name: 'CATEGORIES_VIEW',
        description: 'Voir les catégories'
      },
      {
        name: 'CATEGORIES_CREATE',
        description: 'Créer des catégories'
      },
      {
        name: 'CATEGORIES_UPDATE',
        description: 'Modifier des catégories'
      },
      {
        name: 'CATEGORIES_DELETE',
        description: 'Supprimer des catégories'
      }
    ];

    // Créer les permissions (ignore si elles existent déjà)
    for (const permData of categoryPermissions) {
      const [permission, created] = await Permission.findOrCreate({
        where: { name: permData.name },
        defaults: permData
      });

      if (created) {
        console.log(`✅ Permission créée: ${permData.name}`);
      } else {
        console.log(`ℹ️  Permission existe déjà: ${permData.name}`);
      }
    }

    // Récupérer le rôle Administrateur
    const adminRole = await Role.findOne({ where: { name: 'Administrateur' } });
    
    if (adminRole) {
      console.log(`\n📋 Attribution des permissions au rôle Administrateur...`);

      // Récupérer toutes les permissions CATEGORIES créées
      const permissionNames = categoryPermissions.map(p => p.name);
      const permissions = await Permission.findAll({
        where: { 
          name: permissionNames
        }
      });

      // Attribuer toutes les permissions au rôle admin
      for (const permission of permissions) {
        const [rolePermission, created] = await RolePermission.findOrCreate({
          where: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        });

        if (created) {
          console.log(`✅ Permission ${permission.name} attribuée à Administrateur`);
        } else {
          console.log(`ℹ️  Permission ${permission.name} déjà attribuée à Administrateur`);
        }
      }
    } else {
      console.log('⚠️  Rôle Administrateur non trouvé');
    }

    console.log('\n🎉 Seed des permissions Categories terminé avec succès!');
    console.log('\n📊 Résumé:');
    console.log(`   - ${categoryPermissions.length} permissions CATEGORIES créées/vérifiées`);
    if (adminRole) {
      console.log(`   - Permissions attribuées au rôle Administrateur`);
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

// Exécuter le seed
seedCategoryPermissions();
