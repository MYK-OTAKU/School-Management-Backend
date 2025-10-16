const request = require('supertest');
const speakeasy = require('speakeasy');
const app = require('../app');
const { User } = require('../models');
const { initDefaultRolesAndPermissions } = require('../utils/permissionsInit');

describe('Authentication Routes', () => {
  const loginAdmin = () =>
    request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

  beforeEach(async () => {
    await initDefaultRolesAndPermissions();
  });

  test('POST /api/auth/login should authenticate administrator', async () => {
    const response = await loginAdmin();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.username).toBe('admin');
  });

  test('POST /api/auth/login should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.errorCode).toBe('AUTH_001');
  });

  test('POST /api/auth/login should validate missing credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errorCode).toBe('MISSING_CREDENTIALS');
  });

  test('POST /api/auth/2fa/enable should enable two factor authentication', async () => {
    const loginResponse = await loginAdmin();
    const token = loginResponse.body.token;

    const enableResponse = await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', 'Bearer ' + token)
      .send({ forceNewSecret: true });

    expect(enableResponse.status).toBe(200);
    expect(enableResponse.body.success).toBe(true);
    expect(enableResponse.body.data.qrCode).toBeDefined();
    expect(enableResponse.body.data.manualEntryKey).toBeDefined();
  });

  test('2FA flow should require verification and accept valid code', async () => {
    const loginResponse = await loginAdmin();
    const token = loginResponse.body.token;

    await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', 'Bearer ' + token)
      .send({ forceNewSecret: true });

    const twoFactorLogin = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(twoFactorLogin.status).toBe(200);
    expect(twoFactorLogin.body.requireTwoFactor).toBe(true);
    expect(twoFactorLogin.body.tempToken).toBeDefined();

    const adminUser = await User.findOne({ where: { username: 'admin' } });
    const twoFactorCode = speakeasy.totp({
      secret: adminUser.twoFactorSecret,
      encoding: 'base32'
    });

    const verifyResponse = await request(app)
      .post('/api/auth/verify-2fa')
      .send({ token: twoFactorLogin.body.tempToken, twoFactorCode });

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.success).toBe(true);
    expect(verifyResponse.body.token).toBeDefined();
  });

  test('POST /api/auth/logout should invalidate session', async () => {
    const loginResponse = await loginAdmin();
    const token = loginResponse.body.token;

    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer ' + token);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.success).toBe(true);
    expect(logoutResponse.body.message).toBe('Déconnexion réussie');
  });
});
