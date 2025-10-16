const { Role, Permission, User } = require('../models');

const initDefaultRolesAndPermissions = async () => {
  try {
    console.log('🔄 [INIT] Début initialisation rôles et permissions...');
    
    // Créer les permissions par défaut
    const permissions = [
      // Permissions administratives
      { name: 'ADMIN', description: 'Accès administrateur complet' },
      { name: 'USERS_ADMIN', description: 'Gestion des utilisateurs' },
      { name: 'ROLES_MANAGE', description: 'Gestion des rôles' },
      { name: 'PERMISSIONS_MANAGE', description: 'Gestion des permissions' },

      // Permissions de visualisation
      { name: 'USERS_VIEW', description: 'Voir les utilisateurs' },
      { name: 'ROLES_VIEW', description: 'Voir les rôles' },
      { name: 'PERMISSIONS_VIEW', description: 'Voir les permissions' },
      { name: 'MONITORING_VIEW', description: 'Accès au monitoring' },

      // Permissions de contenu
      { name: 'CONTENT_VIEW', description: 'Voir le contenu' },
      { name: 'CONTENT_MANAGE', description: 'Gérer le contenu' },
      { name: 'REPORTS_VIEW', description: 'Voir les rapports' },
      { name: 'SETTINGS_MANAGE', description: 'Gérer les paramètres' },

      // Permissions produits (exemple CRUD)
      { name: 'PRODUCTS_VIEW', description: 'Voir les produits' },
      { name: 'PRODUCTS_CREATE', description: 'Créer des produits' },
      { name: 'PRODUCTS_UPDATE', description: 'Modifier des produits' },
      { name: 'PRODUCTS_DELETE', description: 'Supprimer des produits' },

      // Permissions commandes (exemple CRUD relationnel)
      { name: 'ORDERS_VIEW', description: 'Voir les commandes' },
      { name: 'ORDERS_CREATE', description: 'Créer des commandes' },
      { name: 'ORDERS_UPDATE', description: 'Modifier des commandes' },
      { name: 'ORDERS_DELETE', description: 'Supprimer des commandes' },

      // Permissions élèves
      { name: 'STUDENTS_VIEW', description: 'Voir les élèves' },
      { name: 'STUDENTS_CREATE', description: 'Créer des élèves' },
      { name: 'STUDENTS_UPDATE', description: 'Modifier des élèves' },
      { name: 'STUDENTS_DELETE', description: 'Supprimer des élèves' },
      { name: 'ENROLLMENTS_MANAGE', description: 'Gérer les inscriptions des élèves' },

      // Permissions paiements
      { name: 'PAYMENTS_VIEW', description: 'Voir les paiements élèves' },
      { name: 'PAYMENTS_CREATE', description: 'Enregistrer des paiements élèves' },
      { name: 'PAYMENTS_UPDATE', description: 'Mettre à jour les paiements élèves' },
      { name: 'PAYMENTS_DELETE', description: 'Supprimer des paiements élèves' },
      { name: 'RECEIPTS_GENERATE', description: 'Générer des reçus financiers' },
      { name: 'FINANCIAL_REPORTS', description: 'Consulter les rapports financiers' },

      // Permissions pédagogiques
      { name: 'GRADES_VIEW', description: 'Voir les notes des élèves' },
      { name: 'GRADES_CREATE', description: 'Saisir les notes des élèves' },
      { name: 'GRADES_UPDATE', description: 'Modifier les notes des élèves' },
      { name: 'ATTENDANCE_VIEW', description: 'Consulter les présences' },
      { name: 'ATTENDANCE_MARK', description: 'Enregistrer les présences des élèves' }
    ];

    // Créer les permissions si elles n'existent pas
    for (const permData of permissions) {
      const [permission, created] = await Permission.findOrCreate({
        where: { name: permData.name },
        defaults: permData
      });
      
      if (created) {
        console.log(`✅ [INIT] Permission "${permData.name}" créée`);
      }
    }

    // Créer les rôles par défaut
    const roles = [
      {
        name: 'Administrateur',
        description: 'Accès complet au système',
        permissions: ['ADMIN', 'USERS_ADMIN', 'ROLES_MANAGE', 'PERMISSIONS_MANAGE', 'USERS_VIEW', 'ROLES_VIEW', 'PERMISSIONS_VIEW', 'MONITORING_VIEW', 'CONTENT_VIEW', 'CONTENT_MANAGE', 'REPORTS_VIEW', 'SETTINGS_MANAGE', 'PRODUCTS_VIEW', 'PRODUCTS_CREATE', 'PRODUCTS_UPDATE', 'PRODUCTS_DELETE', 'ORDERS_VIEW', 'ORDERS_CREATE', 'ORDERS_UPDATE', 'ORDERS_DELETE', 'STUDENTS_VIEW', 'STUDENTS_CREATE', 'STUDENTS_UPDATE', 'STUDENTS_DELETE', 'ENROLLMENTS_MANAGE', 'PAYMENTS_VIEW', 'PAYMENTS_CREATE', 'PAYMENTS_UPDATE', 'PAYMENTS_DELETE', 'RECEIPTS_GENERATE', 'FINANCIAL_REPORTS', 'GRADES_VIEW', 'GRADES_CREATE', 'GRADES_UPDATE', 'ATTENDANCE_VIEW', 'ATTENDANCE_MARK']
      },
      {
        name: 'Manager',
        description: 'Gestion opérationnelle',
        permissions: ['USERS_VIEW', 'CONTENT_VIEW', 'CONTENT_MANAGE', 'REPORTS_VIEW', 'MONITORING_VIEW', 'PRODUCTS_VIEW', 'PRODUCTS_CREATE', 'PRODUCTS_UPDATE', 'ORDERS_VIEW', 'ORDERS_CREATE', 'ORDERS_UPDATE', 'STUDENTS_VIEW', 'STUDENTS_CREATE', 'STUDENTS_UPDATE', 'ENROLLMENTS_MANAGE', 'PAYMENTS_VIEW', 'PAYMENTS_CREATE', 'PAYMENTS_UPDATE', 'GRADES_VIEW', 'ATTENDANCE_VIEW', 'ATTENDANCE_MARK']
      },
      {
        name: 'Utilisateur',
        description: 'Accès de base pour les utilisateurs',
        permissions: ['CONTENT_VIEW', 'REPORTS_VIEW', 'PRODUCTS_VIEW', 'ORDERS_VIEW', 'STUDENTS_VIEW']
      },
      {
        name: 'Directeur',
        description: 'Direction de l\'établissement',
        permissions: ['ADMIN', 'USERS_ADMIN', 'ROLES_MANAGE', 'PERMISSIONS_MANAGE', 'USERS_VIEW', 'ROLES_VIEW', 'PERMISSIONS_VIEW', 'MONITORING_VIEW', 'CONTENT_VIEW', 'CONTENT_MANAGE', 'REPORTS_VIEW', 'SETTINGS_MANAGE', 'STUDENTS_VIEW', 'STUDENTS_CREATE', 'STUDENTS_UPDATE', 'ENROLLMENTS_MANAGE', 'PAYMENTS_VIEW', 'PAYMENTS_CREATE', 'PAYMENTS_UPDATE', 'PAYMENTS_DELETE', 'RECEIPTS_GENERATE', 'FINANCIAL_REPORTS', 'GRADES_VIEW', 'GRADES_CREATE', 'GRADES_UPDATE', 'ATTENDANCE_VIEW', 'ATTENDANCE_MARK']
      },
      {
        name: 'Secrétaire',
        description: 'Gestion administrative quotidienne',
        permissions: ['STUDENTS_VIEW', 'STUDENTS_CREATE', 'STUDENTS_UPDATE', 'ENROLLMENTS_MANAGE', 'PAYMENTS_VIEW', 'PAYMENTS_CREATE', 'PAYMENTS_UPDATE']
      },
      {
        name: 'Comptable',
        description: 'Gestion financière de l\'établissement',
        permissions: ['PAYMENTS_VIEW', 'PAYMENTS_CREATE', 'PAYMENTS_UPDATE', 'PAYMENTS_DELETE', 'RECEIPTS_GENERATE', 'FINANCIAL_REPORTS']
      },
      {
        name: 'Professeur',
        description: 'Personnel enseignant',
        permissions: ['STUDENTS_VIEW', 'GRADES_VIEW', 'GRADES_CREATE', 'GRADES_UPDATE', 'ATTENDANCE_VIEW', 'ATTENDANCE_MARK']
      },
      {
        name: 'Parent',
        description: 'Responsable légal d\'un élève',
        permissions: ['STUDENTS_VIEW', 'RECEIPTS_GENERATE', 'REPORTS_VIEW']
      }
    ];

    // Créer les rôles et assigner les permissions
    for (const roleData of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: { 
          name: roleData.name, 
          description: roleData.description 
        }
      });

      if (created) {
        console.log(`✅ [INIT] Rôle "${roleData.name}" créé`);
      }

      // Récupérer les permissions pour ce rôle
      const rolePermissions = await Permission.findAll({
        where: { 
          name: { 
            [require('sequelize').Op.in]: roleData.permissions 
          } 
        }
      });

      // Assigner les permissions au rôle
      await role.setPermissions(rolePermissions);
      console.log(`✅ [INIT] ${rolePermissions.length} permissions assignées au rôle "${roleData.name}"`);
    }

    // Créer un utilisateur administrateur par défaut
    await createDefaultAdmin();

    console.log('✅ [INIT] Rôles et permissions initialisés avec succès');
  } catch (error) {
    console.error('❌ [INIT] Erreur lors de l\'initialisation des rôles et permissions:', error);
    throw error;
  }
};

// Fonction pour créer un administrateur par défaut
const createDefaultAdmin = async () => {
  try {
    console.log('🔄 [INIT] Vérification administrateur par défaut...');
    
    // Vérifier si un administrateur existe déjà
    const adminRole = await Role.findOne({ where: { name: 'Administrateur' } });
    
    if (!adminRole) {
      console.error('❌ [INIT] Le rôle Administrateur n\'existe pas');
      return;
    }

    const existingAdmin = await User.findOne({
      where: { roleId: adminRole.id }
    });

    if (existingAdmin) {
      console.log('ℹ️  [INIT] Un utilisateur administrateur existe déjà:', existingAdmin.username);
      return;
    }

    // Créer l'utilisateur administrateur par défaut
    console.log('🔄 [INIT] Création administrateur par défaut...');
    
    const adminUser = await User.create({
      username: 'admin',
      password: 'admin123', // ✅ Sera haché automatiquement par le hook
      firstName: 'Super',
      lastName: 'Administrateur',
      email: 'admin@gamingcenter.com',
      roleId: adminRole.id,
      isActive: true
    });

    console.log('✅ [INIT] Utilisateur administrateur créé avec succès !');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Changez le mot de passe après la première connexion !');
    
  } catch (error) {
    console.error('❌ [INIT] Erreur lors de la création de l\'administrateur par défaut:', error);
    throw error;
  }
};

module.exports = { initDefaultRolesAndPermissions };