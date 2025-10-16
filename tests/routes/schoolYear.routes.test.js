const request = require('supertest');
const app = require('../../app');
const { TestFactory } = require('../helpers/testHelpers');
const { Role, Permission } = require('../../models');

describe('🌐 Routes /api/school-years', () => {
  let authToken;
  let user;

  beforeEach(async () => {
    const role = await TestFactory.createRole('SchoolManager');
    const [permission] = await Permission.findOrCreate({
      where: { name: 'SCHOOL_YEARS_MANAGE' },
      defaults: { description: 'Gestion des années scolaires' }
    });
    await role.addPermission(permission);

    user = await TestFactory.createUser({
      username: 'school-admin',
      email: 'school-admin@test.com',
      roleId: role.id
    });

    authToken = TestFactory.generateAuthToken(user);
  });

  const authHeader = () => ({ Authorization: `Bearer ${authToken}` });

  it('crée une année scolaire', async () => {
    const response = await request(app)
      .post('/api/school-years')
      .set(authHeader())
      .send({ name: '2024-2025', startDate: '2024-09-01', endDate: '2025-06-30' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('2024-2025');
  });

  it('active l\'année scolaire via POST /:id/activate', async () => {
    const creation = await request(app)
      .post('/api/school-years')
      .set(authHeader())
      .send({ name: '2024-2025' });

    const { id } = creation.body.data;

    const activation = await request(app)
      .post(`/api/school-years/${id}/activate`)
      .set(authHeader())
      .send();

    expect(activation.status).toBe(200);
    expect(activation.body.data.isActive).toBe(true);
  });

  it('retourne 403 si utilisateur sans permission', async () => {
    const role = await Role.create({ name: 'Teacher', description: 'Teacher role' });
    const forbiddenUser = await TestFactory.createUser({
      username: 'teacher',
      email: 'teacher@test.com',
      roleId: role.id
    });

    const token = TestFactory.generateAuthToken(forbiddenUser);

    const response = await request(app)
      .get('/api/school-years')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
