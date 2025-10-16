const PaymentService = require('../../services/PaymentService');
const { Payment, SchoolYear, Student } = require('../../models');

jest.setTimeout(30000);

describe('🧪 PaymentService', () => {
  let schoolYear;
  let student;

  beforeEach(async () => {
    schoolYear = await SchoolYear.create({ name: '2024-2025', isActive: true });

    student = await Student.create({
      firstName: 'Awa',
      lastName: 'Traoré',
      matricule: 'STU0001',
      gender: 'F',
      schoolYearId: schoolYear.id
    });
  });

  it('crée un paiement partiel et calcule le solde', async () => {
    const payment = await PaymentService.create({
      studentId: student.id,
      schoolYearId: schoolYear.id,
      amount: 50000,
      expectedAmount: 75000,
      method: 'cash',
      type: 'tuition'
    });

    expect(payment.studentId).toBe(student.id);
    expect(Number(payment.balanceRemaining)).toBe(25000);
    expect(payment.status).toBe('partial');
    expect(payment.reference).toMatch(/^PAY-/);
  });

  it('utilise l\'année scolaire active lorsque non précisée', async () => {
    const payment = await PaymentService.create({
      studentId: student.id,
      amount: 30000,
      expectedAmount: 30000,
      method: 'transfer',
      type: 'tuition'
    });

    expect(payment.schoolYearId).toBe(schoolYear.id);
    expect(payment.status).toBe('paid');
    expect(Number(payment.balanceRemaining)).toBe(0);
  });

  it('met à jour un paiement en statut payé', async () => {
    const payment = await PaymentService.create({
      studentId: student.id,
      schoolYearId: schoolYear.id,
      amount: 20000,
      expectedAmount: 40000,
      method: 'cash',
      type: 'tuition'
    });

    const updated = await PaymentService.update(payment.id, {
      amount: 40000,
      expectedAmount: 40000,
      status: 'paid'
    });

    expect(updated.status).toBe('paid');
    expect(Number(updated.balanceRemaining)).toBe(0);
  });

  it('refuse la suppression d\'un paiement payé', async () => {
    const payment = await PaymentService.create({
      studentId: student.id,
      schoolYearId: schoolYear.id,
      amount: 15000,
      expectedAmount: 15000,
      method: 'cash',
      type: 'registration'
    });

    await expect(PaymentService.remove(payment.id))
      .rejects.toThrow('Seuls les paiements en attente ou annulés peuvent être supprimés');
  });

  it('supprime un paiement annulé', async () => {
    const payment = await PaymentService.create({
      studentId: student.id,
      schoolYearId: schoolYear.id,
      amount: 10000,
      expectedAmount: 20000,
      method: 'cash',
      type: 'tuition'
    });

    await PaymentService.update(payment.id, { status: 'cancelled' });

    const result = await PaymentService.remove(payment.id);
    expect(result.success).toBe(true);

    const exists = await Payment.findByPk(payment.id);
    expect(exists).toBeNull();
  });
});
