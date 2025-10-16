const bcrypt = require('bcrypt');
const {
  User,
  Role,
  Permission,
  SchoolYear,
  ClassRoom,
  ClassGroup,
  Student
} = require('../../models');
const { generateToken } = require('../../config/jwt');

/**
 * Factory pour créer des rôles selon le cahier des charges Dashboard Template
 */
class TestFactory {
  static async createRole(name, permissions = []) {
    const [role] = await Role.findOrCreate({
      where: { name },
      defaults: {
        name,
        description: `${name} - Test Role`
      }
    });

    // Ajouter des permissions si spécifiées
    if (permissions.length > 0) {
      const permissionObjects = await Promise.all(
        permissions.map(permName => 
          Permission.findOrCreate({
            where: { name: permName },
            defaults: { description: `${permName} permission` }
          }).then(([perm]) => perm)
        )
      );
      await role.setPermissions(permissionObjects);
    }

    return role;
  }

  static async createUser(userData = {}) {
    const defaults = {
      username: 'testuser',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@template.com',
      isActive: true,
      twoFactorEnabled: false
    };

    const hashedPassword = await bcrypt.hash(userData.password || defaults.password, 10);
    
    return await User.create({
      ...defaults,
      ...userData,
      password: hashedPassword
    });
  }

  static async createActiveSchoolYear(overrides = {}) {
    return await SchoolYear.create({
      name: overrides.name || '2024-2025',
      startDate: overrides.startDate || '2024-09-01',
      endDate: overrides.endDate || '2025-06-30',
      isActive: overrides.isActive !== undefined ? overrides.isActive : true
    });
  }

  static async createClassRoom(data = {}) {
    const schoolYearId = data.schoolYearId || (await this.createActiveSchoolYear()).id;

    return await ClassRoom.create({
      name: data.name || 'CE1',
      level: data.level || 'Primaire',
      capacity: data.capacity || 30,
      monthlyFee: data.monthlyFee || 15000,
      schoolYearId,
      isActive: data.isActive !== undefined ? data.isActive : true
    });
  }

  static async createClassGroup(data = {}) {
    const classroom = data.classroomId
      ? await ClassRoom.findByPk(data.classroomId)
      : await this.createClassRoom(data.classroomData || {});

    return await ClassGroup.create({
      name: data.name || 'Groupe A',
      classroomId: classroom.id,
      schoolYearId: classroom.schoolYearId,
      capacity: data.capacity || 30,
      isActive: data.isActive !== undefined ? data.isActive : true
    });
  }

  static async createStudent(data = {}) {
    const schoolYearId = data.schoolYearId || (await this.createActiveSchoolYear()).id;

    const student = await Student.create({
      firstName: data.firstName || 'Test',
      lastName: data.lastName || 'Eleve',
      matricule: data.matricule || `STU${Date.now().toString().slice(-6)}`,
      gender: data.gender || 'M',
      schoolYearId,
      classroomId: data.classroomId || null,
      classGroupId: data.classGroupId || null,
      status: data.status || 'active'
    });

    return student;
  }

  static async createAdminUser() {
    const adminRole = await this.createRole('Administrateur', [
      'ADMIN', 'USERS_ADMIN', 'VIEW_STATS_FINANCIAL'
    ]);

    return await this.createUser({
      username: 'admin',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'Template',
      roleId: adminRole.id
    });
  }

  static async createEmployeeUser() {
    const employeeRole = await this.createRole('Employé', ['SESSIONS_MANAGE']);

    return await this.createUser({
      username: 'employee',
      password: 'Employee123!',
      firstName: 'Employee',
      lastName: 'Template',
      roleId: employeeRole.id
    });
  }

  static generateAuthToken(user) {
    return generateToken({
      userId: user.id,
      username: user.username,
      roleId: user.roleId,
      sessionId: 1
    });
  }
}

module.exports = { TestFactory };