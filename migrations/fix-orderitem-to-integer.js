/**
 * Migration: Convertir OrderItem de UUID vers INTEGER
 * Date: 2025-10-08
 * Description: Supprime et recrée la table order_items avec des IDs INTEGER
 * ATTENTION: Cette migration supprimera toutes les données existantes dans order_items
 */

const { sequelize } = require('../config/sequelize');

async function migrate() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('🔄 Migration: Conversion OrderItem UUID → INTEGER...');

    // Vérifier si la table existe
    const tables = await queryInterface.showAllTables();
    
    if (tables.includes('order_items')) {
      console.log('⚠️  Table order_items trouvée, suppression en cours...');
      
      // Supprimer la table (toutes les données seront perdues)
      await queryInterface.dropTable('order_items');
      
      console.log('✅ Table order_items supprimée avec succès');
    } else {
      console.log('ℹ️  Table order_items n\'existe pas encore');
    }

    console.log('✅ Migration terminée avec succès!');
    console.log('ℹ️  La table order_items sera recréée au prochain démarrage du serveur');
    
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
