const request = require('supertest');
const app = require('../../app');
const { TestFactory } = require('../helpers/testHelpers');
const { Role, Permission, SchoolYear } = require('../../models');

jest.setTimeout(30000);

describe('🌐 Routes /api/classrooms', () => {
  let authToken;
  let schoolYear;

  beforeEach(async () => {
    schoolYear = await SchoolYear.create({ name: '2024-2025', isActive: true });

    const role = await TestFactory.createRole('ClassManager');
    const permissions = await Promise.all([
      Permission.findOrCreate({
        where: { name: 'CLASSES_VIEW' },
        defaults: { description: 'Voir les classes' }
      }),
      Permission.findOrCreate({
        where: { name: 'CLASSES_CREATE' },
        defaults: { description: 'Créer des classes' }
      }),
      Permission.findOrCreate({
        where: { name: 'CLASSES_UPDATE' },
        defaults: { description: 'Mettre à jour des classes' }
      }),
      Permission.findOrCreate({
        where: { name: 'CLASSES_DELETE' },
        defaults: { description: 'Supprimer des classes' }
      })
    ]);

    await role.addPermissions(permissions.map(([permission]) => permission));

    const user = await TestFactory.createUser({
      username: 'class-manager',
      email: 'class-manager@test.com',
      roleId: role.id
    });

    authToken = TestFactory.generateAuthToken(user);
  });

  const authHeader = () => ({ Authorization: `Bearer ${authToken}` });

  it('crée une classe', async () => {
    const response = await request(app)
      .post('/api/classrooms')
      .set(authHeader())
      .send({
        name: 'CE1',
        schoolYearId: schoolYear.id,
        level: 'primaire',
        groups: [{ name: 'Groupe A', capacity: 20 }]
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('CE1');
    expect(response.body.data.groups).toHaveLength(1);
  });

  it('liste les classes', async () => {
    await request(app)
      .post('/api/classrooms')
      .set(authHeader())
      .send({ name: 'CE1', schoolYearId: schoolYear.id });

    const response = await request(app)
      .get('/api/classrooms')
      .set(authHeader());

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.classrooms)).toBe(true);
    expect(response.body.data.classrooms.length).toBeGreaterThan(0);
  });

  it('crée un groupe pour une classe existante', async () => {
    const creation = await request(app)
      .post('/api/classrooms')
      .set(authHeader())
      .send({ name: 'CE1', schoolYearId: schoolYear.id });

    const classroomId = creation.body.data.id;

    const response = await request(app)
      .post(`/api/classrooms/${classroomId}/groups`)
      .set(authHeader())
      .send({ name: 'Groupe B', capacity: 25 });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('Groupe B');
  });

  it('retourne 403 sans permission', async () => {
    const role = await Role.create({ name: 'Teacher', description: 'Teacher role' });
    const user = await TestFactory.createUser({
      username: 'teacher',
      email: 'teacher@test.com',
      roleId: role.id
    });

    const token = TestFactory.generateAuthToken(user);

    const response = await request(app)
      .get('/api/classrooms')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
