const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const UserSession = require('./UserSession');
const ActivityLog = require('./ActivityLog');
const Settings = require('./Settings');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const { sequelize } = require('../config/sequelize');

// ✅ VÉRIFICATION: S'assurer que tous les modèles sont correctement définis
console.log('🔍 Vérification des modèles:');
console.log('User:', typeof User, User?.name);
console.log('Role:', typeof Role, Role?.name);
console.log('Permission:', typeof Permission, Permission?.name);
console.log('RolePermission:', typeof RolePermission, RolePermission?.name);
console.log('UserSession:', typeof UserSession, UserSession?.name);
console.log('ActivityLog:', typeof ActivityLog, ActivityLog?.name);
console.log('Settings:', typeof Settings, Settings?.name);
console.log('Category:', typeof Category, Category?.name);
console.log('Product:', typeof Product, Product?.name);
console.log('Order:', typeof Order, Order?.name);
console.log('OrderItem:', typeof OrderItem, OrderItem?.name);

// ✅ CORRECTION: Vérifier avant de définir les associations
const defineAssociations = () => {
  try {
    // Vérifier que tous les modèles existent et sont valides
    const models = { User, Role, Permission, RolePermission, UserSession, ActivityLog, Settings, Product, Order, OrderItem };

    for (const [name, model] of Object.entries(models)) {
      if (!model || typeof model !== 'function') {
        throw new Error(`Le modèle ${name} n'est pas correctement défini`);
      }
      console.log(`✅ Modèle ${name} validé`);
    }

    // Associations User - Role
    if (User && Role) {
      User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
      Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
      console.log('✅ Associations User-Role définies');
    }

    // Associations Role - Permission
    if (Role && Permission && RolePermission) {
      Role.belongsToMany(Permission, { 
        through: RolePermission, 
        foreignKey: 'roleId',
        otherKey: 'permissionId',
        as: 'permissions' 
      });

      Permission.belongsToMany(Role, { 
        through: RolePermission, 
        foreignKey: 'permissionId',
        otherKey: 'roleId',
        as: 'roles' 
      });
      console.log('✅ Associations Role-Permission définies');
    }

    // Associations User - Session
    if (User && UserSession) {
      User.hasMany(UserSession, { foreignKey: 'userId' });
      UserSession.belongsTo(User, { foreignKey: 'userId' });
      console.log('✅ Associations User-UserSession définies');
    }

    // Associations User - ActivityLog
    if (User && ActivityLog) {
      User.hasMany(ActivityLog, { foreignKey: 'userId' });
      ActivityLog.belongsTo(User, { foreignKey: 'userId' });
      console.log('✅ Associations User-ActivityLog définies');
    }

    // Associations Order - User
    if (Order && User) {
      Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
      console.log('✅ Associations Order-User définies');
    }

    // Associations Order - OrderItem - Product
    if (Order && OrderItem && Product) {
      Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
      OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

      Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
      OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

      console.log('✅ Associations Order-OrderItem-Product définies');
    }

    // Association Category - Product (One-to-Many)
    if (Category && Product) {
      Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
      Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

      console.log('✅ Associations Category-Product définies');
    }

    console.log('🎉 Toutes les associations ont été définies avec succès');

  } catch (error) {
    console.error('❌ Erreur lors de la définition des associations:', error);
    throw error;
  }
};

// Exécuter la définition des associations
defineAssociations();

module.exports = {
  User,
  Role,
  Permission,
  RolePermission,
  UserSession,
  ActivityLog,
  Settings,
  Category,
  Product,
  Order,
  OrderItem,
  sequelize
};