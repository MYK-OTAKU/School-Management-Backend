// =====================================
// SERVICE CLASSROOM - LOGIQUE MÉTIER DES CLASSES ET GROUPES
// Rôle : gérer les CRUD et règles métier des classes et de leurs groupes.
// Dépendances : modèles (ClassRoom, ClassGroup, SchoolYear), sequelize pour transactions, AppError.
// =====================================

const { Op } = require('sequelize');
const { ClassRoom, ClassGroup, SchoolYear, sequelize } = require('../models');
const { AppError } = require('../utils/errorHandler');

class ClassRoomService {
  static async listClassRooms(filters = {}, pagination = {}) {
    const { schoolYearId, isActive, search } = filters;
    const { page = 1, limit = 20 } = pagination;

    const where = {};

    if (schoolYearId) {
      where.schoolYearId = schoolYearId;
    }

    if (isActive !== undefined && isActive !== null && isActive !== '') {
      where.isActive = isActive === true || isActive === 'true';
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { level: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const effectiveLimit = Math.min(parseInt(limit, 10) || 20, 100);
    const effectivePage = Math.max(parseInt(page, 10) || 1, 1);
    const offset = (effectivePage - 1) * effectiveLimit;

    const { rows, count } = await ClassRoom.findAndCountAll({
      where,
      include: [{ model: ClassGroup, as: 'groups' }],
      order: [['name', 'ASC']],
      limit: effectiveLimit,
      offset
    });

    return {
      classrooms: rows,
      pagination: {
        total: count,
        page: effectivePage,
        limit: effectiveLimit,
        totalPages: Math.ceil(count / effectiveLimit)
      }
    };
  }

  static async getClassRoomById(id) {
    const classroom = await ClassRoom.findByPk(id, {
      include: [{ model: ClassGroup, as: 'groups' }, { model: SchoolYear, as: 'schoolYear' }]
    });

    if (!classroom) {
      throw new AppError('Classe introuvable', 'CLASSROOM_NOT_FOUND', 404);
    }

    return classroom;
  }

  static async createClassRoom(payload) {
    const transaction = await sequelize.transaction();

    try {
      const { name, schoolYearId, level, description, capacity, monthlyFee, isActive = true, groups = [] } = payload;

      if (!name || !schoolYearId) {
        throw new AppError('Le nom et l\'année scolaire sont requis', 'CLASSROOM_INVALID_PAYLOAD', 400);
      }

      const schoolYear = await SchoolYear.findByPk(schoolYearId, { transaction });
      if (!schoolYear) {
        throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
      }

      const duplicate = await ClassRoom.findOne({
        where: { name, schoolYearId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (duplicate) {
        throw new AppError('Une classe avec ce nom existe déjà pour cette année', 'CLASSROOM_DUPLICATE', 409);
      }

      const classroom = await ClassRoom.create({
        name,
        schoolYearId,
        level: level || null,
        description: description || null,
        capacity: capacity || 30,
        monthlyFee: monthlyFee !== undefined ? monthlyFee : null,
        isActive: Boolean(isActive)
      }, { transaction });

      if (Array.isArray(groups) && groups.length > 0) {
        for (const group of groups) {
          if (!group?.name) {
            throw new AppError('Chaque groupe doit avoir un nom', 'CLASSGROUP_INVALID_PAYLOAD', 400);
          }

          await ClassGroup.create({
            name: group.name,
            description: group.description || null,
            capacity: group.capacity || classroom.capacity,
            classroomId: classroom.id,
            schoolYearId,
            isActive: group.isActive !== undefined ? Boolean(group.isActive) : true
          }, { transaction });
        }
      }

      await transaction.commit();

      return this.getClassRoomById(classroom.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async updateClassRoom(id, payload) {
    const transaction = await sequelize.transaction();

    try {
      const classroom = await ClassRoom.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!classroom) {
        throw new AppError('Classe introuvable', 'CLASSROOM_NOT_FOUND', 404);
      }

      const nextName = payload.name ?? classroom.name;
      const nextSchoolYearId = payload.schoolYearId ?? classroom.schoolYearId;

      if (nextName !== classroom.name || nextSchoolYearId !== classroom.schoolYearId) {
        const duplicate = await ClassRoom.findOne({
          where: {
            id: { [Op.ne]: classroom.id },
            name: nextName,
            schoolYearId: nextSchoolYearId
          },
          transaction
        });

        if (duplicate) {
          throw new AppError('Une classe avec ce nom existe déjà pour cette année', 'CLASSROOM_DUPLICATE', 409);
        }
      }

      if (payload.schoolYearId) {
        const schoolYear = await SchoolYear.findByPk(payload.schoolYearId, { transaction });
        if (!schoolYear) {
          throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
        }

        await ClassGroup.update({ schoolYearId: payload.schoolYearId }, {
          where: { classroomId: classroom.id },
          transaction
        });
      }

      await classroom.update({
        name: nextName,
        schoolYearId: nextSchoolYearId,
        level: payload.level !== undefined ? payload.level : classroom.level,
        description: payload.description !== undefined ? payload.description : classroom.description,
        capacity: payload.capacity !== undefined ? payload.capacity : classroom.capacity,
        monthlyFee: payload.monthlyFee !== undefined ? payload.monthlyFee : classroom.monthlyFee,
        isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : classroom.isActive
      }, { transaction });

      await transaction.commit();

      return this.getClassRoomById(classroom.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteClassRoom(id) {
    const transaction = await sequelize.transaction();

    try {
      const classroom = await ClassRoom.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!classroom) {
        throw new AppError('Classe introuvable', 'CLASSROOM_NOT_FOUND', 404);
      }

      const groupsCount = await ClassGroup.count({ where: { classroomId: id }, transaction });
      if (groupsCount > 0) {
        throw new AppError('Impossible de supprimer une classe ayant des groupes', 'CLASSROOM_HAS_GROUPS', 400);
      }

      await classroom.destroy({ transaction });
      await transaction.commit();

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async createGroup(classroomId, payload) {
    const transaction = await sequelize.transaction();

    try {
      const classroom = await ClassRoom.findByPk(classroomId, { transaction });
      if (!classroom) {
        throw new AppError('Classe introuvable', 'CLASSROOM_NOT_FOUND', 404);
      }

      if (!payload?.name) {
        throw new AppError('Le nom du groupe est requis', 'CLASSGROUP_INVALID_PAYLOAD', 400);
      }

      const duplicate = await ClassGroup.findOne({
        where: { classroomId, name: payload.name },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (duplicate) {
        throw new AppError('Un groupe avec ce nom existe déjà pour cette classe', 'CLASSGROUP_DUPLICATE', 409);
      }

      const classGroup = await ClassGroup.create({
        name: payload.name,
        description: payload.description || null,
        capacity: payload.capacity || classroom.capacity,
        classroomId,
        schoolYearId: classroom.schoolYearId,
        isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true
      }, { transaction });

      await transaction.commit();

      return classGroup;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async updateGroup(groupId, payload) {
    const transaction = await sequelize.transaction();

    try {
      const group = await ClassGroup.findByPk(groupId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!group) {
        throw new AppError('Groupe introuvable', 'CLASSGROUP_NOT_FOUND', 404);
      }

      if (payload?.name && payload.name !== group.name) {
        const duplicate = await ClassGroup.findOne({
          where: {
            id: { [Op.ne]: group.id },
            classroomId: group.classroomId,
            name: payload.name
          },
          transaction
        });

        if (duplicate) {
          throw new AppError('Un groupe avec ce nom existe déjà pour cette classe', 'CLASSGROUP_DUPLICATE', 409);
        }
      }

      await group.update({
        name: payload.name ?? group.name,
        description: payload.description !== undefined ? payload.description : group.description,
        capacity: payload.capacity !== undefined ? payload.capacity : group.capacity,
        isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : group.isActive
      }, { transaction });

      await transaction.commit();

      return group;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteGroup(groupId) {
    const group = await ClassGroup.findByPk(groupId);
    if (!group) {
      throw new AppError('Groupe introuvable', 'CLASSGROUP_NOT_FOUND', 404);
    }

    await group.destroy();
    return { success: true };
  }
}

module.exports = ClassRoomService;
