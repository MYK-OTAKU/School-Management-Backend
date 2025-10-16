// ================================
// SERVICE SCHOOLYEAR - LOGIQUE MÉTIER
// ================================
// Ce service centralise la gestion des années scolaires.
// Responsabilités : opérations CRUD, activation exclusive d'une année et règles métier.
// Dépendances : models/SchoolYear, sequelize (transaction), AppError pour la gestion des erreurs.

const { Op } = require('sequelize');
const { SchoolYear, sequelize } = require('../models');
const { AppError } = require('../utils/errorHandler');

class SchoolYearService {
  static async list(filters = {}) {
    const where = {};

    if (filters?.isActive !== undefined && filters.isActive !== null && filters.isActive !== '') {
      where.isActive = filters.isActive === true || filters.isActive === 'true';
    }

    return SchoolYear.findAll({
      where,
      order: [['startDate', 'DESC'], ['name', 'DESC']]
    });
  }

  static async getById(id) {
    const schoolYear = await SchoolYear.findByPk(id);

    if (!schoolYear) {
      throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
    }

    return schoolYear;
  }

  static async create(data) {
    const transaction = await sequelize.transaction();

    try {
      await this.validateDates(data.startDate, data.endDate);

      const existing = await SchoolYear.findOne({
        where: { name: data.name },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (existing) {
        throw new AppError('Une année scolaire avec ce nom existe déjà', 'SCHOOL_YEAR_ALREADY_EXISTS', 409);
      }

      const schoolYear = await SchoolYear.create({
        name: data.name,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        isActive: Boolean(data.isActive)
      }, { transaction });

      if (schoolYear.isActive) {
        await SchoolYear.update({ isActive: false }, {
          where: { id: { [Op.ne]: schoolYear.id } },
          transaction
        });
      }

      await transaction.commit();
      return schoolYear;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data) {
    const transaction = await sequelize.transaction();

    try {
      const schoolYear = await SchoolYear.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });

      if (!schoolYear) {
        throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
      }

      if (data.name && data.name !== schoolYear.name) {
        const existing = await SchoolYear.findOne({ where: { name: data.name }, transaction });
        if (existing) {
          throw new AppError('Une année scolaire avec ce nom existe déjà', 'SCHOOL_YEAR_ALREADY_EXISTS', 409);
        }
      }

      await this.validateDates(data.startDate ?? schoolYear.startDate, data.endDate ?? schoolYear.endDate);

      const willBeActive = data.isActive !== undefined ? Boolean(data.isActive) : schoolYear.isActive;

      await schoolYear.update({
        name: data.name ?? schoolYear.name,
        startDate: data.startDate !== undefined ? data.startDate : schoolYear.startDate,
        endDate: data.endDate !== undefined ? data.endDate : schoolYear.endDate,
        isActive: willBeActive
      }, { transaction });

      if (willBeActive) {
        await SchoolYear.update({ isActive: false }, {
          where: { id: { [Op.ne]: schoolYear.id } },
          transaction
        });
      }

      await transaction.commit();
      return schoolYear;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async activate(id) {
    const transaction = await sequelize.transaction();

    try {
      const schoolYear = await SchoolYear.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });

      if (!schoolYear) {
        throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
      }

      if (schoolYear.isActive) {
        return schoolYear;
      }

      await SchoolYear.update({ isActive: false }, {
        where: { id: { [Op.ne]: id } },
        transaction
      });

      await schoolYear.update({ isActive: true }, { transaction });

      await transaction.commit();
      return schoolYear;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const transaction = await sequelize.transaction();

    try {
      const schoolYear = await SchoolYear.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });

      if (!schoolYear) {
        throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
      }

      if (schoolYear.isActive) {
        throw new AppError('Impossible de supprimer une année scolaire active', 'SCHOOL_YEAR_ACTIVE_DELETE_FORBIDDEN', 400);
      }

      await schoolYear.destroy({ transaction });
      await transaction.commit();

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getActive() {
    return SchoolYear.findOne({ where: { isActive: true } });
  }

  static async validateDates(startDate, endDate) {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      throw new AppError('La date de fin doit être postérieure à la date de début', 'SCHOOL_YEAR_INVALID_DATES', 400);
    }
  }
}

module.exports = SchoolYearService;
