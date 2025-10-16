// ================================
// CONTROLLER SCHOOLYEAR - GESTION DES REQUÊTES HTTP
// ================================
// Ce contrôleur orchestre les opérations HTTP liées aux années scolaires.
// Responsabilités : valider les entrées, appeler le service métier et formater les réponses.
// Dépendances : SchoolYearService, AuditService, utils/responseHandler pour les réponses standardisées.

const SchoolYearService = require('../services/SchoolYearService');
const AuditService = require('../services/AuditService');

class SchoolYearController {
  static async list(req, res, next) {
    try {
      const { isActive } = req.query;
      const schoolYears = await SchoolYearService.list({ isActive });

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'SCHOOL_YEARS_VIEW',
        resourceType: 'SchoolYear',
        resourceId: null,
        details: { filters: req.query }
      });

      return res.success(schoolYears, 'Liste des années scolaires récupérée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const schoolYear = await SchoolYearService.getById(id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'SCHOOL_YEARS_VIEW',
        resourceType: 'SchoolYear',
        resourceId: id
      });

      return res.success(schoolYear, 'Année scolaire récupérée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const schoolYear = await SchoolYearService.create(req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'SCHOOL_YEARS_CREATE',
        resourceType: 'SchoolYear',
        resourceId: schoolYear.id,
        newValues: req.body
      });

      return res.created(schoolYear, 'Année scolaire créée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const schoolYear = await SchoolYearService.update(id, req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'SCHOOL_YEARS_UPDATE',
        resourceType: 'SchoolYear',
        resourceId: id,
        newValues: req.body
      });

      return res.success(schoolYear, 'Année scolaire mise à jour avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async activate(req, res, next) {
    try {
      const { id } = req.params;
      const schoolYear = await SchoolYearService.activate(id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'SCHOOL_YEARS_ACTIVATE',
        resourceType: 'SchoolYear',
        resourceId: id
      });

      return res.success(schoolYear, 'Année scolaire activée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await SchoolYearService.delete(id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'SCHOOL_YEARS_DELETE',
        resourceType: 'SchoolYear',
        resourceId: id
      });

      return res.success(null, 'Année scolaire supprimée avec succès');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SchoolYearController;
