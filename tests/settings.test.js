const request = require('supertest');
const app = require('../app');
const { User, Role, Permission, Settings } = require('../models');
const { initDefaultRolesAndPermissions } = require('../utils/permissionsInit');

const seedSettingsPermissions = async (role) => {
  const permissions = ['settings.read', 'settings.create', 'settings.update', 'settings.delete'];
  const assigned = [];

  for (const name of permissions) {
    const [permission] = await Permission.findOrCreate({
      where: { name },
      defaults: {
        name,
        description: 'Permission ' + name,
        category: 'settings'
      }
    });
    assigned.push(permission);
  }

  await role.addPermissions(assigned);
};

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

const login = async (username, password) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
  return response.body.token;
};

describe('Settings API', () => {
  let adminRole;
  let userRole;
  let adminUser;
  let regularUser;

  beforeEach(async () => {
    await initDefaultRolesAndPermissions();

    adminRole = await Role.findOne({ where: { name: 'Administrateur' } });
    userRole = await Role.findOne({ where: { name: 'Utilisateur' } });

    await seedSettingsPermissions(adminRole);

    adminUser = await createUser('admin-settings', 'Admin#123', adminRole.id);
    regularUser = await createUser('user-settings', 'User#123', userRole.id);

    await Settings.bulkCreate([
      {
        key: 'app.name',
        value: 'Dashboard Template',
        type: 'string',
        category: 'general',
        isPublic: true
      },
      {
        key: 'app.version',
        value: '1.0.0',
        type: 'string',
        category: 'general',
        isPublic: true
      },
      {
        key: 'security.session_timeout',
        value: '3600',
        type: 'number',
        category: 'security',
        isPublic: false
      },
      {
        key: 'features.notifications_enabled',
        value: 'true',
        type: 'boolean',
        category: 'features',
        isPublic: true
      }
    ]);
  });

  test('GET /api/settings/public returns only public settings with type conversion', async () => {
    const response = await request(app)
      .get('/api/settings/public');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    const settings = response.body.data.settings;

    expect(settings['app.name']).toBe('Dashboard Template');
    expect(settings['app.version']).toBe('1.0.0');
    expect(settings['features.notifications_enabled']).toBe(true);
    expect(settings['security.session_timeout']).toBeUndefined();
  });

  test('GET /api/settings/admin/all returns all settings for admin', async () => {
    const token = await login('admin-settings', 'Admin#123');

    const response = await request(app)
      .get('/api/settings/admin/all')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(200);
    const settings = response.body.data.settings;
    expect(settings['security.session_timeout']).toBe(3600);
  });

  test('POST /api/settings/admin creates new setting', async () => {
    const token = await login('admin-settings', 'Admin#123');

    const response = await request(app)
      .post('/api/settings/admin')
      .set('Authorization', 'Bearer ' + token)
      .send({
        key: 'general.support_email',
        value: 'support@example.com',
        type: 'string',
        category: 'general',
        isPublic: false
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    const created = await Settings.findOne({ where: { key: 'general.support_email' } });
    expect(created).not.toBeNull();
    expect(created.value).toBe('support@example.com');
  });

  test('PUT /api/settings/admin/:key updates existing setting', async () => {
    const token = await login('admin-settings', 'Admin#123');

    const response = await request(app)
      .put('/api/settings/admin/security.session_timeout')
      .set('Authorization', 'Bearer ' + token)
      .send({
        value: '7200',
        type: 'number',
        category: 'security',
        isPublic: false
      });

    expect(response.status).toBe(200);
    expect(response.body.data.setting.value).toBe('7200');
  });

  test('DELETE /api/settings/admin/:key removes setting', async () => {
    const token = await login('admin-settings', 'Admin#123');

    const response = await request(app)
      .delete('/api/settings/admin/app.version')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const deleted = await Settings.findOne({ where: { key: 'app.version' } });
    expect(deleted).toBeNull();
  });

  test('GET /api/settings/user/preferences merges defaults with overrides', async () => {
    const token = await login('user-settings', 'User#123');

    await Settings.create({
      key: 'user.' + regularUser.id + '.theme',
      value: 'dark',
      type: 'string',
      category: 'user_preferences',
      isPublic: false
    });

    const response = await request(app)
      .get('/api/settings/user/preferences')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(200);
    const preferences = response.body.data.preferences;
    expect(preferences.theme).toBe('dark');
    expect(preferences.language).toBe('fr');
    expect(preferences.notifications_email).toBe(true);
  });

  test('PUT /api/settings/user/preferences updates allowed preferences', async () => {
    const token = await login('user-settings', 'User#123');

    const response = await request(app)
      .put('/api/settings/user/preferences')
      .set('Authorization', 'Bearer ' + token)
      .send({
        theme: 'light',
        notifications_email: false,
        unknown_preference: 'ignored'
      });

    expect(response.status).toBe(200);
    expect(response.body.data.updated).toBe(2);

    const updated = await Settings.findOne({
      where: { key: 'user.' + regularUser.id + '.notifications_email' }
    });
    expect(updated.value).toBe('false');
  });

  test('regular user cannot access admin settings endpoints', async () => {
    const token = await login('user-settings', 'User#123');

    const response = await request(app)
      .get('/api/settings/admin/all')
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(403);
  });
});
