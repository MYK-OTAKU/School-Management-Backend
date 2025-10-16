// ================================
// SERVICE PAYMENT - LOGIQUE MÉTIER DES PAIEMENTS
// ================================
// Ce service encapsule la gestion des paiements élèves.
// Responsabilités : CRUD sécurisé, calcul des soldes et cohérence avec l'année scolaire active.
// Dépendances : models/Payment, models/Student, models/SchoolYear, sequelize (transaction), AppError.

const { Op } = require('sequelize');
const {
  Payment,
  Student,
  SchoolYear,
  sequelize
} = require('../models');
const { AppError } = require('../utils/errorHandler');

const PAYMENT_STATUSES = ['paid', 'partial', 'pending', 'cancelled'];
const PAYMENT_TYPES = ['registration', 'tuition', 'transport', 'misc'];
const PAYMENT_METHODS = ['cash', 'card', 'transfer', 'mobile_money', 'check'];

class PaymentService {
  static async list(filters = {}) {
    const where = {};

    if (filters.studentId) {
      where.studentId = Number(filters.studentId);
    }

    if (filters.schoolYearId) {
      where.schoolYearId = Number(filters.schoolYearId);
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const include = [
      { model: Student, as: 'student', attributes: ['id', 'firstName', 'lastName', 'matricule'] },
      { model: SchoolYear, as: 'schoolYear', attributes: ['id', 'name', 'isActive'] }
    ];

    return Payment.findAll({
      where,
      include,
      order: [['paymentDate', 'DESC'], ['id', 'DESC']]
    });
  }

  static async getById(id) {
    const payment = await Payment.findByPk(id, {
      include: [
        { model: Student, as: 'student', attributes: ['id', 'firstName', 'lastName', 'matricule'] },
        { model: SchoolYear, as: 'schoolYear', attributes: ['id', 'name', 'isActive'] }
      ]
    });

    if (!payment) {
      throw new AppError('Paiement introuvable', 'PAYMENT_NOT_FOUND', 404);
    }

    return payment;
  }

  static async create(payload, recordedById) {
    const transaction = await sequelize.transaction();

    try {
      const student = await this.#ensureStudentExists(payload.studentId, transaction);
      const schoolYearId = await this.#resolveSchoolYearId(payload.schoolYearId, transaction);

      const computed = this.#computeAmounts(payload);

      const reference = payload.reference || this.#generateReference(student.id);

      let payment;

      try {
        payment = await Payment.create({
          studentId: student.id,
          schoolYearId,
          amount: computed.amount,
          expectedAmount: computed.expectedAmount,
          appliedDiscount: computed.appliedDiscount,
          balanceRemaining: computed.balanceRemaining,
          status: computed.status,
          type: computed.type,
          method: computed.method,
          reference,
          paymentDate: payload.paymentDate || new Date(),
          notes: payload.notes || null,
          recordedById: recordedById || null
        }, { transaction });
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new AppError('Une référence de paiement identique existe déjà', 'PAYMENT_REFERENCE_DUPLICATE', 409);
        }
        throw error;
      }

      await transaction.commit();

      return this.getById(payment.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, payload = {}) {
    const transaction = await sequelize.transaction();

    try {
      const payment = await Payment.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });

      if (!payment) {
        throw new AppError('Paiement introuvable', 'PAYMENT_NOT_FOUND', 404);
      }

      if (payload.studentId && payload.studentId !== payment.studentId) {
        await this.#ensureStudentExists(payload.studentId, transaction);
      }

      const computed = this.#computeAmounts({
        amount: payload.amount ?? payment.amount,
        expectedAmount: payload.expectedAmount ?? payment.expectedAmount,
        appliedDiscount: payload.appliedDiscount ?? payment.appliedDiscount,
        balanceRemaining: payload.balanceRemaining,
        status: payload.status ?? payment.status,
        type: payload.type ?? payment.type,
        method: payload.method ?? payment.method
      });

      if (payload.schoolYearId && payload.schoolYearId !== payment.schoolYearId) {
        await this.#resolveSchoolYearId(payload.schoolYearId, transaction);
      }

      try {
        await payment.update({
          studentId: payload.studentId ?? payment.studentId,
          schoolYearId: payload.schoolYearId ?? payment.schoolYearId,
          amount: computed.amount,
          expectedAmount: computed.expectedAmount,
          appliedDiscount: computed.appliedDiscount,
          balanceRemaining: computed.balanceRemaining,
          status: computed.status,
          type: computed.type,
          method: computed.method,
          paymentDate: payload.paymentDate ?? payment.paymentDate,
          notes: payload.notes ?? payment.notes,
          reference: payload.reference ?? payment.reference
        }, { transaction });
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new AppError('Une référence de paiement identique existe déjà', 'PAYMENT_REFERENCE_DUPLICATE', 409);
        }
        throw error;
      }

      await transaction.commit();

      return this.getById(payment.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id) {
    const transaction = await sequelize.transaction();

    try {
      const payment = await Payment.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });

      if (!payment) {
        throw new AppError('Paiement introuvable', 'PAYMENT_NOT_FOUND', 404);
      }

      if (!['pending', 'cancelled'].includes(payment.status)) {
        throw new AppError('Seuls les paiements en attente ou annulés peuvent être supprimés', 'PAYMENT_DELETE_RESTRICTED', 400);
      }

      await payment.destroy({ transaction });
      await transaction.commit();

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async #ensureStudentExists(studentId, transaction) {
    if (!studentId) {
      throw new AppError('L\'identifiant élève est requis', 'PAYMENT_STUDENT_REQUIRED', 400);
    }

    const student = await Student.findByPk(studentId, { transaction });

    if (!student) {
      throw new AppError('Élève introuvable', 'STUDENT_NOT_FOUND', 404);
    }

    return student;
  }

  static async #resolveSchoolYearId(schoolYearId, transaction) {
    if (schoolYearId) {
      const exists = await SchoolYear.findByPk(schoolYearId, { transaction });

      if (!exists) {
        throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
      }

      return schoolYearId;
    }

    const activeYear = await SchoolYear.findOne({ where: { isActive: true }, transaction });

    if (!activeYear) {
      throw new AppError('Aucune année scolaire active définie', 'SCHOOL_YEAR_REQUIRED', 400);
    }

    return activeYear.id;
  }

  static #computeAmounts(data) {
    const amount = this.#toMoney(data.amount);

    if (amount <= 0) {
      throw new AppError('Le montant payé doit être supérieur à zéro', 'PAYMENT_INVALID_AMOUNT', 400);
    }

    const expectedAmount = this.#toMoney(data.expectedAmount ?? amount);
    const appliedDiscount = this.#toMoney(data.appliedDiscount ?? 0);

    if (appliedDiscount < 0) {
      throw new AppError('La remise ne peut pas être négative', 'PAYMENT_INVALID_DISCOUNT', 400);
    }

    if (appliedDiscount > expectedAmount) {
      throw new AppError('La remise ne peut pas dépasser le montant attendu', 'PAYMENT_DISCOUNT_TOO_HIGH', 400);
    }

    const netExpected = Math.max(expectedAmount - appliedDiscount, 0);
    const balanceRemaining = data.balanceRemaining !== undefined
      ? this.#toMoney(data.balanceRemaining)
      : Math.max(netExpected - amount, 0);

    const type = this.#resolveEnumValue('type', data.type ?? 'tuition', PAYMENT_TYPES);
    const method = this.#resolveEnumValue('method', data.method ?? 'cash', PAYMENT_METHODS);

    let status = data.status ?? (balanceRemaining <= 0 ? 'paid' : 'partial');
    status = this.#resolveEnumValue('status', status, PAYMENT_STATUSES);

    if (status === 'paid' && balanceRemaining > 0) {
      throw new AppError('Un paiement payé ne peut pas avoir de solde restant', 'PAYMENT_STATUS_CONFLICT', 400);
    }

    if (status === 'pending' && amount > 0) {
      throw new AppError('Un paiement en attente ne peut pas avoir de montant encaissé', 'PAYMENT_PENDING_AMOUNT', 400);
    }

    return {
      amount: this.#formatMoney(amount),
      expectedAmount: this.#formatMoney(expectedAmount),
      appliedDiscount: this.#formatMoney(appliedDiscount),
      balanceRemaining: this.#formatMoney(balanceRemaining),
      status,
      type,
      method
    };
  }

  static #resolveEnumValue(field, value, allowed) {
    if (!allowed.includes(value)) {
      throw new AppError(`Valeur ${field} invalide`, `PAYMENT_INVALID_${field.toUpperCase()}`, 400);
    }

    return value;
  }

  static #toMoney(value) {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
      throw new AppError('Montant invalide', 'PAYMENT_INVALID_AMOUNT', 400);
    }

    return Number(numeric.toFixed(2));
  }

  static #formatMoney(value) {
    return Number(value).toFixed(2);
  }

  static #generateReference(studentId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PAY-${studentId}-${timestamp}-${randomSuffix}`;
  }
}

module.exports = PaymentService;
