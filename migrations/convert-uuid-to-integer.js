/**
 * Migration: Convertir les IDs de UUID vers INTEGER
 * Date: 2025-10-08
 * Description: Convertit les tables products et orders de UUID vers INTEGER
 * ⚠️ ATTENTION: Cette migration supprime toutes les données existantes
 */

const { sequelize } = require('../config/sequelize');

async function migrate() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('🔄 Migration: Conversion UUID → INTEGER...');
    console.log('⚠️  ATTENTION: Cette migration va supprimer toutes les données des tables products, orders et order_items');

    // 1. Supprimer order_items (dépend de products et orders)
    console.log('🗑️  Suppression de order_items...');
    await queryInterface.dropTable('order_items', { cascade: true });
    console.log('✅ Table order_items supprimée');

    // 2. Supprimer orders
    console.log('🗑️  Suppression de orders...');
    await queryInterface.dropTable('orders', { cascade: true });
    console.log('✅ Table orders supprimée');

    // 3. Supprimer products
    console.log('🗑️  Suppression de products...');
    await queryInterface.dropTable('products', { cascade: true });
    console.log('✅ Table products supprimée');

    // 4. Recréer products avec INTEGER
    console.log('📦 Création de products avec INTEGER...');
    await queryInterface.createTable('products', {
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
      price: {
        type: sequelize.Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stock: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      categoryId: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      imageUrl: {
        type: sequelize.Sequelize.STRING(500),
        allowNull: true
      },
      isActive: {
        type: sequelize.Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: sequelize.Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: sequelize.Sequelize.DATE,
        allowNull: false
      }
    });
    console.log('✅ Table products créée avec INTEGER');

    // 5. Ajouter les index sur products
    await queryInterface.addIndex('products', ['name'], { name: 'products_name' });
    await queryInterface.addIndex('products', ['categoryId'], { name: 'products_category_id' });
    await queryInterface.addIndex('products', ['price'], { name: 'products_price' });
    console.log('✅ Index products créés');

    // 6. Recréer orders avec INTEGER
    console.log('📦 Création de orders avec INTEGER...');
    await queryInterface.createTable('orders', {
      id: {
        type: sequelize.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      orderNumber: {
        type: sequelize.Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      userId: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      totalAmount: {
        type: sequelize.Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      status: {
        type: sequelize.Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
      },
      shippingAddress: {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: sequelize.Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: sequelize.Sequelize.DATE,
        allowNull: false
      }
    });
    console.log('✅ Table orders créée avec INTEGER');

    // 7. Ajouter les index sur orders
    await queryInterface.addIndex('orders', ['orderNumber'], { name: 'orders_order_number', unique: true });
    await queryInterface.addIndex('orders', ['userId'], { name: 'orders_user_id' });
    await queryInterface.addIndex('orders', ['status'], { name: 'orders_status' });
    await queryInterface.addIndex('orders', ['createdAt'], { name: 'orders_created_at' });
    console.log('✅ Index orders créés');

    // 8. Recréer order_items avec INTEGER
    console.log('📦 Création de order_items avec INTEGER...');
    await queryInterface.createTable('order_items', {
      id: {
        type: sequelize.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      orderId: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      productId: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      quantity: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false
      },
      unitPrice: {
        type: sequelize.Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      subtotal: {
        type: sequelize.Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      createdAt: {
        type: sequelize.Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: sequelize.Sequelize.DATE,
        allowNull: false
      }
    });
    console.log('✅ Table order_items créée avec INTEGER');

    // 9. Ajouter les index sur order_items
    await queryInterface.addIndex('order_items', ['orderId'], { name: 'order_items_order_id' });
    await queryInterface.addIndex('order_items', ['productId'], { name: 'order_items_product_id' });
    console.log('✅ Index order_items créés');

    console.log('✅ Migration terminée avec succès!');
    console.log('📊 Les tables products, orders et order_items utilisent maintenant INTEGER');
    
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
