const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/sequelize');
const { initDefaultRolesAndPermissions } = require('../utils/permissionsInit');
const { Role } = require('../models');

describe('Tests des routes Utilisateurs', () => {
  let adminToken;
  let utilisateurRole;

  const authenticateAdmin = async () => {
    await initDefaultRolesAndPermissions();

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token');

    adminToken = response.body.token;
    utilisateurRole = await Role.findOne({ where: { name: 'Utilisateur' } });
  };

  beforeEach(async () => {
    await authenticateAdmin();
  });

  test('Connexion d\'un utilisateur administrateur', () => {
    expect(adminToken).toBeDefined();
  });

  test('Récupération de tous les utilisateurs', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
  });

  test('Création d\'un nouvel utilisateur', async () => {
    const payload = {
      username: 'janedoe',
      password: 'Password#123',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@example.com',
      phone: '0987654321',
      address: '456 Main St',
      roleId: utilisateurRole.id
    };

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.username).toBe(payload.username);
  });

  test('Déconnexion de l\'administrateur', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Déconnexion réussie');
  });
});
