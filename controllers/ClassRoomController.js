// =====================================
// CONTRÔLEUR CLASSROOM - GESTION HTTP DES CLASSES & GROUPES
// Rôle : orchestrer les requêtes REST pour ClassRoom/ClassGroup.
// Dépendances : ClassRoomService, AuditService.
// =====================================

const ClassRoomService = require('../services/ClassRoomService');
const AuditService = require('../services/AuditService');

class ClassRoomController {
  static async list(req, res, next) {
    try {
      const { schoolYearId, isActive, search, page, limit } = req.query;

      const result = await ClassRoomService.listClassRooms(
        { schoolYearId, isActive, search },
        { page, limit }
      );

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CLASSES_VIEW',
        resourceType: 'ClassRoom',
        resourceId: null,
        details: { filters: req.query }
      });

      return res.success(result, 'Liste des classes récupérée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const classroom = await ClassRoomService.getClassRoomById(req.params.id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CLASSES_VIEW',
        resourceType: 'ClassRoom',
        resourceId: req.params.id
      });

      return res.success(classroom, 'Classe récupérée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const classroom = await ClassRoomService.createClassRoom(req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CLASSES_CREATE',
        resourceType: 'ClassRoom',
        resourceId: classroom.id,
        newValues: req.body
      });

      return res.created(classroom, 'Classe créée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const classroom = await ClassRoomService.updateClassRoom(req.params.id, req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CLASSES_UPDATE',
        resourceType: 'ClassRoom',
        resourceId: req.params.id,
        newValues: req.body
      });

      return res.success(classroom, 'Classe mise à jour avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await ClassRoomService.deleteClassRoom(req.params.id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CLASSES_DELETE',
        resourceType: 'ClassRoom',
        resourceId: req.params.id
      });

      return res.success(null, 'Classe supprimée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async createGroup(req, res, next) {
    try {
      const group = await ClassRoomService.createGroup(req.params.id, req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CLASSES_UPDATE',
        resourceType: 'ClassGroup',
        resourceId: group.id,
        newValues: req.body
      });

      return res.created(group, 'Groupe créé avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async updateGroup(req, res, next) {
    try {
      const group = await ClassRoomService.updateGroup(req.params.groupId, req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CLASSES_UPDATE',
        resourceType: 'ClassGroup',
        resourceId: req.params.groupId,
        newValues: req.body
      });

      return res.success(group, 'Groupe mis à jour avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async deleteGroup(req, res, next) {
    try {
      await ClassRoomService.deleteGroup(req.params.groupId);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CLASSES_UPDATE',
        resourceType: 'ClassGroup',
        resourceId: req.params.groupId
      });

      return res.success(null, 'Groupe supprimé avec succès');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClassRoomController;
