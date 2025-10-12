/**
 * Script de seed pour créer des catégories et produits de test
 * À exécuter après avoir créé les permissions
 */

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { Category, Product } = require('../models');
const { sequelize } = require('../config/sequelize');

async function seedTestData() {
  try {
    console.log('🌱 Début du seed des données de test...');

    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');

    // Catégories de test
    const categories = [
      {
        name: 'Électronique',
        description: 'Produits électroniques et accessoires high-tech',
        icon: '📱',
        color: '#3b82f6',
        isActive: true,
        displayOrder: 1
      },
      {
        name: 'Vêtements',
        description: 'Mode et accessoires vestimentaires',
        icon: '👕',
        color: '#8b5cf6',
        isActive: true,
        displayOrder: 2
      },
      {
        name: 'Alimentation',
        description: 'Produits alimentaires et boissons',
        icon: '🍕',
        color: '#f59e0b',
        isActive: true,
        displayOrder: 3
      },
      {
        name: 'Sport & Fitness',
        description: 'Équipements sportifs et fitness',
        icon: '⚽',
        color: '#10b981',
        isActive: true,
        displayOrder: 4
      },
      {
        name: 'Maison & Décoration',
        description: 'Articles pour la maison et décoration',
        icon: '🏠',
        color: '#ec4899',
        isActive: true,
        displayOrder: 5
      },
      {
        name: 'Livres & Médias',
        description: 'Livres, films, musique et jeux',
        icon: '📚',
        color: '#6366f1',
        isActive: true,
        displayOrder: 6
      }
    ];

    console.log('\n📦 Création des catégories...');
    const createdCategories = [];
    
    for (const catData of categories) {
      const [category, created] = await Category.findOrCreate({
        where: { name: catData.name },
        defaults: catData
      });

      createdCategories.push(category);
      
      if (created) {
        console.log(`✅ Catégorie créée: ${catData.icon} ${catData.name}`);
      } else {
        console.log(`ℹ️  Catégorie existe déjà: ${catData.icon} ${catData.name}`);
      }
    }

    // Produits de test pour chaque catégorie
    const products = [
      // Électronique
      {
        name: 'iPhone 15 Pro',
        description: 'Smartphone Apple dernière génération avec puce A17 Pro',
        price: 1199.99,
        stock: 50,
        categoryId: createdCategories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1592286927505-b7c1e5f1b9d5',
        isActive: true
      },
      {
        name: 'MacBook Air M2',
        description: 'Ordinateur portable ultraléger avec puce M2',
        price: 1399.99,
        stock: 30,
        categoryId: createdCategories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        isActive: true
      },
      {
        name: 'AirPods Pro 2',
        description: 'Écouteurs sans fil avec réduction de bruit active',
        price: 249.99,
        stock: 100,
        categoryId: createdCategories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7',
        isActive: true
      },

      // Vêtements
      {
        name: 'T-Shirt Premium Coton',
        description: 'T-shirt 100% coton bio, coupe moderne',
        price: 29.99,
        stock: 200,
        categoryId: createdCategories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        isActive: true
      },
      {
        name: 'Jean Slim Fit',
        description: 'Jean denim stretch, coupe ajustée',
        price: 79.99,
        stock: 150,
        categoryId: createdCategories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        isActive: true
      },
      {
        name: 'Baskets Running Pro',
        description: 'Chaussures de course légères et respirantes',
        price: 129.99,
        stock: 80,
        categoryId: createdCategories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        isActive: true
      },

      // Alimentation
      {
        name: 'Pizza Margherita Bio',
        description: 'Pizza artisanale aux ingrédients bio',
        price: 12.99,
        stock: 50,
        categoryId: createdCategories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        isActive: true
      },
      {
        name: 'Smoothie Fruits Rouges',
        description: 'Smoothie maison aux fruits frais',
        price: 5.99,
        stock: 30,
        categoryId: createdCategories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625',
        isActive: true
      },

      // Sport & Fitness
      {
        name: 'Tapis de Yoga Premium',
        description: 'Tapis antidérapant 6mm, écologique',
        price: 39.99,
        stock: 60,
        categoryId: createdCategories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
        isActive: true
      },
      {
        name: 'Haltères Réglables 20kg',
        description: 'Set d\'haltères ajustables de 2 à 20kg',
        price: 199.99,
        stock: 25,
        categoryId: createdCategories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
        isActive: true
      },

      // Maison & Décoration
      {
        name: 'Lampe Design LED',
        description: 'Lampe de bureau moderne avec variateur',
        price: 89.99,
        stock: 40,
        categoryId: createdCategories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
        isActive: true
      },
      {
        name: 'Coussin Velours 45x45',
        description: 'Coussin décoratif en velours doux',
        price: 24.99,
        stock: 120,
        categoryId: createdCategories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2',
        isActive: true
      },

      // Livres & Médias
      {
        name: 'Clean Code - Robert Martin',
        description: 'Guide pour écrire du code propre et maintenable',
        price: 45.99,
        stock: 70,
        categoryId: createdCategories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765',
        isActive: true
      },
      {
        name: 'Manette Gaming Pro',
        description: 'Manette sans fil pour console et PC',
        price: 69.99,
        stock: 90,
        categoryId: createdCategories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575',
        isActive: true
      }
    ];

    console.log('\n🛍️  Création des produits...');
    let createdCount = 0;
    let existingCount = 0;

    for (const prodData of products) {
      const [product, created] = await Product.findOrCreate({
        where: { name: prodData.name },
        defaults: prodData
      });

      if (created) {
        createdCount++;
        const category = createdCategories.find(c => c.id === prodData.categoryId);
        console.log(`✅ Produit créé: ${prodData.name} (${category.name})`);
      } else {
        existingCount++;
        console.log(`ℹ️  Produit existe déjà: ${prodData.name}`);
      }
    }

    console.log('\n🎉 Seed des données de test terminé avec succès!');
    console.log('\n📊 Résumé:');
    console.log(`   - ${createdCategories.length} catégories`);
    console.log(`   - ${createdCount} produits créés`);
    console.log(`   - ${existingCount} produits existants`);
    console.log(`   - ${products.length} produits au total`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

// Exécuter le seed
seedTestData();
