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
const Payment = require('./Payment');
const SchoolYear = require('./SchoolYear');
const ClassRoom = require('./ClassRoom');
const ClassGroup = require('./ClassGroup');
const Student = require('./Student');
const Enrollment = require('./Enrollment');
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
console.log('Payment:', typeof Payment, Payment?.name);
console.log('SchoolYear:', typeof SchoolYear, SchoolYear?.name);
console.log('ClassRoom:', typeof ClassRoom, ClassRoom?.name);
console.log('ClassGroup:', typeof ClassGroup, ClassGroup?.name);
console.log('Student:', typeof Student, Student?.name);
console.log('Enrollment:', typeof Enrollment, Enrollment?.name);

// ✅ CORRECTION: Vérifier avant de définir les associations
const defineAssociations = () => {
  try {
    // Vérifier que tous les modèles existent et sont valides
    const models = {
      User,
      Role,
      Permission,
      RolePermission,
      UserSession,
      ActivityLog,
      Settings,
      Product,
      Order,
      OrderItem,
      Payment,
      SchoolYear,
      ClassRoom,
      ClassGroup,
      Student,
      Enrollment
    };

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

    // Associations Student - Payment
    if (Student && Payment) {
      Student.hasMany(Payment, { foreignKey: 'studentId', as: 'payments' });
      Payment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
      console.log('✅ Associations Student-Payment définies');
    }

    // Associations SchoolYear - Payment
    if (SchoolYear && Payment) {
      SchoolYear.hasMany(Payment, { foreignKey: 'schoolYearId', as: 'payments' });
      Payment.belongsTo(SchoolYear, { foreignKey: 'schoolYearId', as: 'schoolYear' });
      console.log('✅ Associations SchoolYear-Payment définies');
    }

    // Associations User - Payment (enregistrant)
    if (User && Payment) {
      User.hasMany(Payment, { foreignKey: 'recordedById', as: 'recordedPayments' });
      Payment.belongsTo(User, { foreignKey: 'recordedById', as: 'recordedBy' });
      console.log('✅ Associations User-Payment définies');
    }

    // Association Category - Product (One-to-Many)
    if (Category && Product) {
      Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
      Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

      console.log('✅ Associations Category-Product définies');
    }

    if (SchoolYear && ClassRoom) {
      SchoolYear.hasMany(ClassRoom, { foreignKey: 'schoolYearId', as: 'classrooms' });
      ClassRoom.belongsTo(SchoolYear, { foreignKey: 'schoolYearId', as: 'schoolYear' });
      console.log('✅ Associations SchoolYear-ClassRoom définies');
    }

    if (ClassRoom && ClassGroup) {
      ClassRoom.hasMany(ClassGroup, { foreignKey: 'classroomId', as: 'groups' });
      ClassGroup.belongsTo(ClassRoom, { foreignKey: 'classroomId', as: 'classroom' });
      console.log('✅ Associations ClassRoom-ClassGroup définies');
    }

    if (SchoolYear && ClassGroup) {
      SchoolYear.hasMany(ClassGroup, { foreignKey: 'schoolYearId', as: 'classGroups' });
      ClassGroup.belongsTo(SchoolYear, { foreignKey: 'schoolYearId', as: 'schoolYear' });
      console.log('✅ Associations SchoolYear-ClassGroup définies');
    }

    if (SchoolYear && Student) {
      SchoolYear.hasMany(Student, { foreignKey: 'schoolYearId', as: 'students' });
      Student.belongsTo(SchoolYear, { foreignKey: 'schoolYearId', as: 'schoolYear' });
      console.log('✅ Associations SchoolYear-Student définies');
    }

    if (ClassRoom && Student) {
      ClassRoom.hasMany(Student, { foreignKey: 'classroomId', as: 'students' });
      Student.belongsTo(ClassRoom, { foreignKey: 'classroomId', as: 'classroom' });
      console.log('✅ Associations ClassRoom-Student définies');
    }

    if (ClassGroup && Student) {
      ClassGroup.hasMany(Student, { foreignKey: 'classGroupId', as: 'students' });
      Student.belongsTo(ClassGroup, { foreignKey: 'classGroupId', as: 'classGroup' });
      console.log('✅ Associations ClassGroup-Student définies');
    }

    if (Student && Enrollment) {
      Student.hasMany(Enrollment, { foreignKey: 'studentId', as: 'enrollments' });
      Enrollment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
      console.log('✅ Associations Student-Enrollment définies');
    }

    if (SchoolYear && Enrollment) {
      SchoolYear.hasMany(Enrollment, { foreignKey: 'schoolYearId', as: 'enrollments' });
      Enrollment.belongsTo(SchoolYear, { foreignKey: 'schoolYearId', as: 'schoolYear' });
      console.log('✅ Associations SchoolYear-Enrollment définies');
    }

    if (ClassRoom && Enrollment) {
      ClassRoom.hasMany(Enrollment, { foreignKey: 'classroomId', as: 'enrollments' });
      Enrollment.belongsTo(ClassRoom, { foreignKey: 'classroomId', as: 'classroom' });
      console.log('✅ Associations ClassRoom-Enrollment définies');
    }

    if (ClassGroup && Enrollment) {
      ClassGroup.hasMany(Enrollment, { foreignKey: 'classGroupId', as: 'enrollments' });
      Enrollment.belongsTo(ClassGroup, { foreignKey: 'classGroupId', as: 'classGroup' });
      console.log('✅ Associations ClassGroup-Enrollment définies');
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
  Payment,
  SchoolYear,
  ClassRoom,
  ClassGroup,
  Student,
  Enrollment,
  sequelize
};