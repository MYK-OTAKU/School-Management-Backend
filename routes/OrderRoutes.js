// ================================
// ROUTES ORDER - EXEMPLE DE CRUD RELATIONNEL
// ================================
// Ces routes définissent les endpoints pour la gestion des commandes.
// Toutes les routes sont protégées par authentification.
//
// Permissions requises:
//   - ORDERS_VIEW: Voir les commandes
//   - ORDERS_CREATE: Créer des commandes
//   - ORDERS_UPDATE: Modifier des commandes
//   - ORDERS_DELETE: Supprimer des commandes

const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authenticate, hasPermission } = require('../middlewares/auth');

router.get(
  '/user/my-orders',
  authenticate,
  OrderController.getMyOrders
);

router.get(
  '/',
  authenticate,
  hasPermission('ORDERS_VIEW'),
  OrderController.getAllOrders
);

router.get(
  '/:id',
  authenticate,
  hasPermission('ORDERS_VIEW'),
  OrderController.getOrderById
);

router.post(
  '/',
  authenticate,
  hasPermission('ORDERS_CREATE'),
  OrderController.createOrder
);

router.patch(
  '/:id/status',
  authenticate,
  hasPermission('ORDERS_UPDATE'),
  OrderController.updateOrderStatus
);

router.delete(
  '/:id',
  authenticate,
  hasPermission('ORDERS_DELETE'),
  OrderController.deleteOrder
);

module.exports = router;
