// ================================
// CONTROLLER ORDER - GESTION DES COMMANDES
// ================================
// Ce contrôleur gère toutes les requêtes HTTP liées aux commandes.
// Il utilise OrderService pour la logique métier.
//
// Endpoints:
//   - GET /api/orders : Liste toutes les commandes (avec filtres et pagination)
//   - GET /api/orders/:id : Récupère une commande spécifique
//   - POST /api/orders : Crée une nouvelle commande
//   - PATCH /api/orders/:id/status : Met à jour le statut
//   - DELETE /api/orders/:id : Supprime une commande
//   - GET /api/orders/user/my-orders : Commandes de l'utilisateur connecté

const OrderService = require('../services/OrderService');
const AuditService = require('../services/AuditService');
const { AUDIT_ACTIONS } = require('../constants/auditActions');

class OrderController {
  static async getAllOrders(req, res, next) {
    try {
      const { page, limit, status, userId } = req.query;

      const result = await OrderService.getAllOrders(
        { status, userId },
        { page, limit }
      );

      await AuditService.logActivity(
        req.user?.id,
        AUDIT_ACTIONS.LIST_RESOURCE,
        'Order',
        null,
        { filters: req.query }
      );

      return res.status(200).json({
        success: true,
        message: 'Commandes récupérées avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const { id } = req.params;

      const order = await OrderService.getOrderById(id);

      await AuditService.logActivity(
        req.user?.id,
        AUDIT_ACTIONS.VIEW_RESOURCE,
        'Order',
        id
      );

      return res.status(200).json({
        success: true,
        message: 'Commande récupérée avec succès',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const orderData = req.body;

      const order = await OrderService.createOrder(userId, orderData);

      await AuditService.logActivity(
        userId,
        AUDIT_ACTIONS.CREATE_RESOURCE,
        'Order',
        order.id,
        { orderNumber: order.orderNumber, totalAmount: order.totalAmount }
      );

      return res.status(201).json({
        success: true,
        message: 'Commande créée avec succès',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Le statut est requis'
        });
      }

      const order = await OrderService.updateOrderStatus(id, status);

      await AuditService.logActivity(
        req.user.id,
        AUDIT_ACTIONS.UPDATE_RESOURCE,
        'Order',
        id,
        { newStatus: status }
      );

      return res.status(200).json({
        success: true,
        message: 'Statut de la commande mis à jour avec succès',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;

      const result = await OrderService.deleteOrder(id);

      await AuditService.logActivity(
        req.user.id,
        AUDIT_ACTIONS.DELETE_RESOURCE,
        'Order',
        id
      );

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit, status } = req.query;

      const result = await OrderService.getUserOrders(userId, { page, limit, status });

      return res.status(200).json({
        success: true,
        message: 'Mes commandes récupérées avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
