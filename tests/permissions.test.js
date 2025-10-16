const request = require('supertest');
const app = require('../app');
const { User, Role } = require('../models');
const { initDefaultRolesAndPermissions } = require('../utils/permissionsInit');

const createUser = async (username, password, roleId) => {
  return User.create({
    username,
    password,
    firstName: 'Test',
    lastName: 'User',
    email: username + '@example.com',
    roleId,
    isActive: true
  });
};

const authenticate = async (username, password) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
  return response.body.token;
};

describe('Permissions enforcement', () => {
  let adminRole;
  let managerRole;
  let userRole;
  let adminUser;
  let managerUser;
  let regularUser;

  beforeEach(async () => {
    await initDefaultRolesAndPermissions();

    adminRole = await Role.findOne({ where: { name: 'Administrateur' } });
    managerRole = await Role.findOne({ where: { name: 'Manager' } });
    userRole = await Role.findOne({ where: { name: 'Utilisateur' } });

    adminUser = await createUser('admin-test', 'Admin#123', adminRole.id);
    managerUser = await createUser('manager-test', 'Manager#123', managerRole.id);
    regularUser = await createUser('user-test', 'User#123', userRole.id);
  });

  test('administrator can list, create and delete users', async () => {
    const adminToken = await authenticate('admin-test', 'Admin#123');

    const listResponse = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body.data)).toBe(true);

    const createResponse = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({
        username: 'new-user',
        password: 'Password#123',
        firstName: 'New',
        lastName: 'User',
        email: 'new-user@example.com',
        roleId: userRole.id
      });
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);
    const createdUserId = createResponse.body.data.id;

    const deleteResponse = await request(app)
      .delete('/api/users/' + createdUserId)
      .set('Authorization', 'Bearer ' + adminToken);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
  });

  test('manager can view users but cannot create or delete them', async () => {
    const managerToken = await authenticate('manager-test', 'Manager#123');

    const listResponse = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer ' + managerToken);
    expect(listResponse.status).toBe(200);

    const createResponse = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer ' + managerToken)
      .send({
        username: 'manager-created',
        password: 'Password#123',
        firstName: 'Manager',
        lastName: 'Created',
        email: 'manager-created@example.com',
        roleId: userRole.id
      });
    expect(createResponse.status).toBe(403);

    const deleteResponse = await request(app)
      .delete('/api/users/' + regularUser.id)
      .set('Authorization', 'Bearer ' + managerToken);
    expect(deleteResponse.status).toBe(403);
  });

  test('regular user cannot access administrative user management routes', async () => {
    const userToken = await authenticate('user-test', 'User#123');

    const listResponse = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer ' + userToken);
    expect(listResponse.status).toBe(403);

    const createResponse = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        username: 'forbidden-user',
        password: 'Password#123',
        firstName: 'Forbidden',
        lastName: 'User',
        email: 'forbidden@example.com',
        roleId: userRole.id
      });
    expect(createResponse.status).toBe(403);
  });
});
