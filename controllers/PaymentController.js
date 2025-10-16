// ================================
// CONTROLLER PAYMENT - REQUÊTES HTTP
// ================================
// Ce contrôleur orchestre les endpoints liés aux paiements.
// Responsabilités : valider les entrées, déléguer au service et journaliser les opérations.
// Dépendances : PaymentService, AuditService.

const PaymentService = require('../services/PaymentService');
const AuditService = require('../services/AuditService');

class PaymentController {
  static async list(req, res, next) {
    try {
      const payments = await PaymentService.list(req.query);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'PAYMENTS_VIEW',
        resourceType: 'Payment',
        resourceId: null,
        details: { filters: req.query }
      });

      return res.success(payments, 'Liste des paiements récupérée avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getById(id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'PAYMENTS_VIEW',
        resourceType: 'Payment',
        resourceId: id
      });

      return res.success(payment, 'Paiement récupéré avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const payment = await PaymentService.create(req.body, req.user?.id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'PAYMENTS_CREATE',
        resourceType: 'Payment',
        resourceId: payment.id,
        newValues: req.body
      });

      return res.created(payment, 'Paiement enregistré avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.update(id, req.body);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'PAYMENTS_UPDATE',
        resourceType: 'Payment',
        resourceId: id,
        newValues: req.body
      });

      return res.success(payment, 'Paiement mis à jour avec succès');
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      await PaymentService.remove(id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'PAYMENTS_DELETE',
        resourceType: 'Payment',
        resourceId: id
      });

      return res.success(null, 'Paiement supprimé avec succès');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
