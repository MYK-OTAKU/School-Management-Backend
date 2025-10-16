// ================================
// CONTROLLER STUDENT - REQUÊTES HTTP
// ================================
// Ce contrôleur orchestre les opérations HTTP liées aux élèves.
// Responsabilités : valider les entrées, invoquer StudentService et journaliser les actions.
// Dépendances : StudentService, AuditService.

const StudentService = require('../services/StudentService');
const AuditService = require('../services/AuditService');

class StudentController {
  static async list(req, res, next) {
    try {
      const result = await StudentService.list(req.query, {
        page: req.query.page,
        limit: req.query.limit
      });

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'STUDENTS_VIEW',
        resourceType: 'Student',
        resourceId: null,
        details: { filters: req.query }
      });

      return res.success(result, 'Liste des élèves récupérée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await StudentService.getById(id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'STUDENTS_VIEW',
        resourceType: 'Student',
        resourceId: id
      });

      return res.success(student, 'Élève récupéré avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const student = await StudentService.create(req.body, req.user?.id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'STUDENTS_CREATE',
        resourceType: 'Student',
        resourceId: student.id,
        newValues: req.body
      });

      return res.created(student, 'Élève créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const student = await StudentService.update(id, req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'STUDENTS_UPDATE',
        resourceType: 'Student',
        resourceId: id,
        newValues: req.body
      });

      return res.success(student, 'Élève mis à jour avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      await StudentService.delete(id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'STUDENTS_DELETE',
        resourceType: 'Student',
        resourceId: id
      });

      return res.success(null, 'Élève supprimé avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async enroll(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await StudentService.enroll(id, req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'ENROLLMENTS_MANAGE',
        resourceType: 'Enrollment',
        resourceId: id,
        newValues: req.body
      });

      return res.success(updated, 'Inscription élève mise à jour avec succès');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudentController;
