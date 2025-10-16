// ================================
// SERVICE STUDENT - LOGIQUE MÉTIER
// ================================
// Ce service gère le cycle de vie des élèves et leur inscription annuelle.
// Responsabilités : CRUD élèves, génération de matricule, gestion des inscriptions.
// Dépendances : models (Student, Enrollment, SchoolYear, ClassRoom, ClassGroup, sequelize), SchoolYearService, AppError.

const { Op } = require('sequelize');
const {
  Student,
  Enrollment,
  SchoolYear,
  ClassRoom,
  ClassGroup,
  sequelize
} = require('../models');
const SchoolYearService = require('./SchoolYearService');
const { AppError } = require('../utils/errorHandler');

class StudentService {
  static async list(filters = {}, pagination = {}) {
    const {
      schoolYearId,
      classroomId,
      classGroupId,
      status,
      search
    } = filters;

    const page = Math.max(parseInt(pagination.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(pagination.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = {};

    const resolvedSchoolYearId = await this.resolveSchoolYearId(schoolYearId);
    if (resolvedSchoolYearId) {
      where.schoolYearId = resolvedSchoolYearId;
    }

    if (classroomId) {
      where.classroomId = classroomId;
    }

    if (classGroupId) {
      where.classGroupId = classGroupId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      const likeOperator = sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;
      where[Op.or] = [
        { firstName: { [likeOperator]: `%${search}%` } },
        { lastName: { [likeOperator]: `%${search}%` } },
        { otherNames: { [likeOperator]: `%${search}%` } },
        { matricule: { [likeOperator]: `%${search}%` } }
      ];
    }

    const { rows, count } = await Student.findAndCountAll({
      where,
      include: [
        { model: SchoolYear, as: 'schoolYear' },
        { model: ClassRoom, as: 'classroom' },
        { model: ClassGroup, as: 'classGroup' },
        {
          model: Enrollment,
          as: 'enrollments',
          separate: true,
          order: [['enrollmentDate', 'DESC']]
        }
      ],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC']
      ],
      limit,
      offset
    });

    return {
      items: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit) || 1
      }
    };
  }

  static async getById(id) {
    const student = await Student.findByPk(id, {
      include: [
        { model: SchoolYear, as: 'schoolYear' },
        { model: ClassRoom, as: 'classroom' },
        { model: ClassGroup, as: 'classGroup' },
        {
          model: Enrollment,
          as: 'enrollments',
          include: [
            { model: SchoolYear, as: 'schoolYear' },
            { model: ClassRoom, as: 'classroom' },
            { model: ClassGroup, as: 'classGroup' }
          ],
          order: [['enrollmentDate', 'DESC']]
        }
      ]
    });

    if (!student) {
      throw new AppError('Élève introuvable', 'STUDENT_NOT_FOUND', 404);
    }

    return student;
  }

  static async create(data, createdBy) {
    const transaction = await sequelize.transaction();

    try {
      const schoolYearId = await this.resolveSchoolYearId(data.schoolYearId);
      if (!schoolYearId) {
        throw new AppError('Aucune année scolaire active définie', 'ACTIVE_SCHOOL_YEAR_REQUIRED', 400);
      }

      const classroomId = data.classroomId || null;
      const classGroupId = data.classGroupId || null;

      await this.validateClassReferences({
        classroomId,
        classGroupId,
        schoolYearId
      }, transaction);

      const matricule = data.matricule || await this.generateMatricule(schoolYearId, transaction);

      const student = await Student.create({
        firstName: data.firstName,
        lastName: data.lastName,
        otherNames: data.otherNames || null,
        matricule,
        gender: data.gender || 'M',
        dateOfBirth: data.dateOfBirth || null,
        guardianName: data.guardianName || null,
        guardianPhone: data.guardianPhone || null,
        reductionPercent: data.reductionPercent ?? 0,
        status: data.status || 'active',
        notes: data.notes || null,
        schoolYearId,
        classroomId,
        classGroupId
      }, { transaction });

      await Enrollment.create({
        studentId: student.id,
        schoolYearId,
        classroomId,
        classGroupId,
        status: 'active',
        notes: data.enrollmentNotes || null
      }, { transaction });

      await transaction.commit();

      return this.getById(student.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data) {
    const transaction = await sequelize.transaction();

    try {
      const student = await Student.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });

      if (!student) {
        throw new AppError('Élève introuvable', 'STUDENT_NOT_FOUND', 404);
      }

      if (data.matricule && data.matricule !== student.matricule) {
        const existing = await Student.findOne({
          where: { matricule: data.matricule },
          transaction
        });

        if (existing) {
          throw new AppError('Un élève avec ce matricule existe déjà', 'STUDENT_DUPLICATE_MATRICULE', 409);
        }
      }

      const nextSchoolYearId = await this.resolveSchoolYearId(data.schoolYearId || student.schoolYearId);
      const nextClassroomId = data.classroomId ?? student.classroomId;
      const nextClassGroupId = data.classGroupId ?? student.classGroupId;

      await this.validateClassReferences({
        classroomId: nextClassroomId,
        classGroupId: nextClassGroupId,
        schoolYearId: nextSchoolYearId
      }, transaction);

      await student.update({
        firstName: data.firstName ?? student.firstName,
        lastName: data.lastName ?? student.lastName,
        otherNames: data.otherNames ?? student.otherNames,
        matricule: data.matricule ?? student.matricule,
        gender: data.gender ?? student.gender,
        dateOfBirth: data.dateOfBirth ?? student.dateOfBirth,
        guardianName: data.guardianName ?? student.guardianName,
        guardianPhone: data.guardianPhone ?? student.guardianPhone,
        reductionPercent: data.reductionPercent ?? student.reductionPercent,
        status: data.status ?? student.status,
        notes: data.notes ?? student.notes,
        schoolYearId: nextSchoolYearId,
        classroomId: nextClassroomId,
        classGroupId: nextClassGroupId
      }, { transaction });

      await transaction.commit();

      return this.getById(student.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const transaction = await sequelize.transaction();

    try {
      const student = await Student.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });

      if (!student) {
        throw new AppError('Élève introuvable', 'STUDENT_NOT_FOUND', 404);
      }

      await Enrollment.destroy({ where: { studentId: id }, transaction });
      await student.destroy({ transaction });

      await transaction.commit();

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async enroll(studentId, data) {
    const transaction = await sequelize.transaction();

    try {
      const student = await Student.findByPk(studentId, { transaction, lock: transaction.LOCK.UPDATE });

      if (!student) {
        throw new AppError('Élève introuvable', 'STUDENT_NOT_FOUND', 404);
      }

      const schoolYearId = await this.resolveSchoolYearId(data.schoolYearId);
      if (!schoolYearId) {
        throw new AppError('Année scolaire requise pour inscrire l’élève', 'SCHOOL_YEAR_REQUIRED', 400);
      }

      const classroomId = data.classroomId || null;
      const classGroupId = data.classGroupId || null;

      await this.validateClassReferences({ classroomId, classGroupId, schoolYearId }, transaction);

      const enrollmentPayload = {
        classroomId,
        classGroupId,
        enrollmentDate: data.enrollmentDate || new Date(),
        status: data.status || 'active',
        notes: data.notes || null
      };

      const [enrollment] = await Enrollment.findOrCreate({
        where: { studentId, schoolYearId },
        defaults: {
          studentId,
          schoolYearId,
          ...enrollmentPayload
        },
        transaction
      });

      await enrollment.update(enrollmentPayload, { transaction });

      await student.update({
        schoolYearId,
        classroomId: enrollmentPayload.classroomId,
        classGroupId: enrollmentPayload.classGroupId
      }, { transaction });

      await transaction.commit();

      return this.getById(studentId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async resolveSchoolYearId(requestedId) {
    if (requestedId) {
      const existing = await SchoolYear.findByPk(requestedId);
      if (!existing) {
        throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
      }
      return existing.id;
    }

    const active = await SchoolYearService.getActive();
    return active?.id || null;
  }

  static async generateMatricule(schoolYearId, transaction) {
    const year = await SchoolYear.findByPk(schoolYearId, { transaction });

    if (!year) {
      throw new AppError('Année scolaire introuvable', 'SCHOOL_YEAR_NOT_FOUND', 404);
    }

    const prefix = `STU${year.name.slice(2, 4)}`;

    const lastStudent = await Student.findOne({
      where: { schoolYearId },
      order: [['matricule', 'DESC']],
      transaction
    });

    let nextSequence = 1;
    if (lastStudent?.matricule?.startsWith(prefix)) {
      const current = parseInt(lastStudent.matricule.slice(prefix.length), 10);
      if (!Number.isNaN(current)) {
        nextSequence = current + 1;
      }
    }

    const padded = String(nextSequence).padStart(4, '0');
    return `${prefix}${padded}`;
  }

  static async validateClassReferences({ classroomId, classGroupId, schoolYearId }, transaction) {
    let classroom = null;

    if (classroomId) {
      classroom = await ClassRoom.findByPk(classroomId, { transaction });
      if (!classroom) {
        throw new AppError('Classe introuvable', 'CLASSROOM_NOT_FOUND', 404);
      }
      if (schoolYearId && classroom.schoolYearId !== schoolYearId) {
        throw new AppError('La classe ne correspond pas à l’année scolaire fournie', 'CLASSROOM_SCHOOLYEAR_MISMATCH', 400);
      }
    }

    if (classGroupId) {
      const classGroup = await ClassGroup.findByPk(classGroupId, { transaction });
      if (!classGroup) {
        throw new AppError('Groupe introuvable', 'CLASSGROUP_NOT_FOUND', 404);
      }
      if (schoolYearId && classGroup.schoolYearId !== schoolYearId) {
        throw new AppError('Le groupe ne correspond pas à l’année scolaire fournie', 'CLASSGROUP_SCHOOLYEAR_MISMATCH', 400);
      }
      if (classroomId && classGroup.classroomId !== classroomId) {
        throw new AppError('Le groupe ne correspond pas à la classe fournie', 'CLASSGROUP_CLASSROOM_MISMATCH', 400);
      }
    }
  }
}

module.exports = StudentService;
