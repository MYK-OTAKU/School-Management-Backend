// ================================
// SCRIPT D'INITIALISATION DE LA BASE DE DONNÉES
// ================================
// Ce script initialise la base de données avec :
// - Les rôles par défaut (Administrateur, Manager, Employé)
// - Les permissions de base
// - Un compte administrateur par défaut

require('dotenv').config();
const { initDb, sequelize } = require('../config/sequelize');
const { initDefaultRolesAndPermissions } = require('../utils/permissionsInit');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role');

async function seed() {
  try {
    console.log('🌱 [SEED] Démarrage du script de peuplement de la base de données...\n');

    // 1. Connexion à la base de données
    console.log('📡 [SEED] Connexion à la base de données...');
    await initDb();
    console.log('✅ [SEED] Connexion établie\n');

    // 2. Synchronisation des modèles
    console.log('🔄 [SEED] Synchronisation des modèles...');
    require('../models');
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ [SEED] Modèles synchronisés\n');

    // 3. Initialisation des rôles et permissions
    console.log('🛡️  [SEED] Création des rôles et permissions...');
    await initDefaultRolesAndPermissions();
    console.log('✅ [SEED] Rôles et permissions créés\n');

    // 4. Création de l'administrateur par défaut
    console.log('👤 [SEED] Création de l\'administrateur par défaut...');

    const adminRole = await Role.findOne({ where: { name: 'Administrateur' } });

    if (!adminRole) {
      console.error('❌ [SEED] Erreur : Rôle Administrateur non trouvé');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ where: { username: 'admin' } });

    if (existingAdmin) {
      console.log('ℹ️  [SEED] Un administrateur existe déjà');
    } else {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);

      await User.create({
        username: 'admin',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@maliandevs.com',
        roleId: adminRole.id,
        isActive: true,
        emailVerified: true
      });

      console.log('✅ [SEED] Administrateur créé avec succès');
      console.log('   Username: admin');
      console.log('   Password: Admin123!');
      console.log('   Email: admin@maliandevs.com\n');
    }

    console.log('🎉 [SEED] Peuplement terminé avec succès!\n');
    console.log('📋 [SEED] Récapitulatif:');
    console.log('   - Rôles: Administrateur, Manager, Employé');
    console.log('   - Permissions: Toutes les permissions de base');
    console.log('   - Admin: admin / Admin123!\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ [SEED] Erreur lors du peuplement:', error);
    process.exit(1);
  }
}

seed();
