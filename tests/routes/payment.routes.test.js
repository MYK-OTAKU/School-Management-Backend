const request = require('supertest');
const app = require('../../app');
const { TestFactory } = require('../helpers/testHelpers');
const { Permission } = require('../../models');

jest.setTimeout(30000);

describe('🌐 Routes /api/payments', () => {
  let authToken;
  let student;

  beforeEach(async () => {
    const role = await TestFactory.createRole('AccountantRole');
    const permissionNames = ['PAYMENTS_VIEW', 'PAYMENTS_CREATE', 'PAYMENTS_UPDATE', 'PAYMENTS_DELETE'];
    const permissions = [];

    for (const name of permissionNames) {
      const [permission] = await Permission.findOrCreate({
        where: { name },
        defaults: { description: `${name} permission` }
      });
      permissions.push(permission);
    }

    await role.setPermissions(permissions);

    const user = await TestFactory.createUser({
      username: 'finance-user',
      email: 'finance@test.com',
      roleId: role.id
    });

    student = await TestFactory.createStudent();
    authToken = TestFactory.generateAuthToken(user);
  });

  const authHeader = () => ({ Authorization: `Bearer ${authToken}` });

  it('crée un paiement', async () => {
    const response = await request(app)
      .post('/api/payments')
      .set(authHeader())
      .send({
        studentId: student.id,
        schoolYearId: student.schoolYearId,
        amount: 45000,
        expectedAmount: 60000,
        method: 'cash',
        type: 'tuition'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('partial');
    expect(Number(response.body.data.balanceRemaining)).toBe(15000);
  });

  it('liste les paiements existants', async () => {
    await request(app)
      .post('/api/payments')
      .set(authHeader())
      .send({
        studentId: student.id,
        schoolYearId: student.schoolYearId,
        amount: 30000,
        expectedAmount: 30000,
        method: 'card',
        type: 'registration'
      });

    const response = await request(app)
      .get('/api/payments')
      .set(authHeader());

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('met à jour un paiement', async () => {
    const creation = await request(app)
      .post('/api/payments')
      .set(authHeader())
      .send({
        studentId: student.id,
        schoolYearId: student.schoolYearId,
        amount: 20000,
        expectedAmount: 40000,
        method: 'transfer',
        type: 'tuition'
      });

    const { id } = creation.body.data;

    const update = await request(app)
      .put(`/api/payments/${id}`)
      .set(authHeader())
      .send({
        amount: 40000,
        expectedAmount: 40000,
        status: 'paid'
      });

    expect(update.status).toBe(200);
    expect(update.body.data.status).toBe('paid');
    expect(Number(update.body.data.balanceRemaining)).toBe(0);
  });

  it('supprime un paiement annulé', async () => {
    const creation = await request(app)
      .post('/api/payments')
      .set(authHeader())
      .send({
        studentId: student.id,
        schoolYearId: student.schoolYearId,
        amount: 10000,
        expectedAmount: 20000,
        method: 'cash',
        type: 'transport'
      });

    const { id } = creation.body.data;

    await request(app)
      .put(`/api/payments/${id}`)
      .set(authHeader())
      .send({ status: 'cancelled' });

    const removal = await request(app)
      .delete(`/api/payments/${id}`)
      .set(authHeader());

    expect(removal.status).toBe(200);
    expect(removal.body.success).toBe(true);
  });

  it('retourne 403 lorsque l\'utilisateur ne possède pas la permission', async () => {
    const basicRole = await TestFactory.createRole('ProfessorRole');
    const basicUser = await TestFactory.createUser({
      username: 'teacher-user',
      email: 'teacher@test.com',
      roleId: basicRole.id
    });

    const token = TestFactory.generateAuthToken(basicUser);

    const response = await request(app)
      .post('/api/payments')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        studentId: student.id,
        schoolYearId: student.schoolYearId,
        amount: 10000,
        expectedAmount: 10000,
        method: 'cash',
        type: 'tuition'
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
