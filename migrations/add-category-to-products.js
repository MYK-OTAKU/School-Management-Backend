/**
 * Migration: Ajouter la colonne categoryId à la table products
 * Date: 2025-10-08
 * Description: Ajoute la relation entre Products et Categories
 */

const { sequelize } = require('../config/sequelize');

async function migrate() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('🔄 Migration: Ajout de categoryId à products...');

    // Vérifier si la colonne existe déjà
    const tableDescription = await queryInterface.describeTable('products');
    
    if (tableDescription.categoryId) {
      console.log('✅ La colonne categoryId existe déjà');
      return;
    }

    // Ajouter la colonne categoryId
    await queryInterface.addColumn('products', 'categoryId', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    console.log('✅ Colonne categoryId ajoutée avec succès');

    // Ajouter l'index pour optimiser les recherches
    await queryInterface.addIndex('products', ['categoryId'], {
      name: 'products_category_id'
    });

    console.log('✅ Index products_category_id créé avec succès');

    // Ajouter la colonne imageUrl si elle n'existe pas
    if (!tableDescription.imageUrl) {
      await queryInterface.addColumn('products', 'imageUrl', {
        type: sequelize.Sequelize.STRING(500),
        allowNull: true
      });
      console.log('✅ Colonne imageUrl ajoutée avec succès');
    }

    console.log('✅ Migration terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    throw error;
  }
}

// Exécuter la migration si ce script est lancé directement
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('✅ Migration exécutée avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Échec de la migration:', error);
      process.exit(1);
    });
}

module.exports = migrate;
