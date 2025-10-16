const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { authenticate, hasPermission } = require('../middlewares/auth');
const { trackUserSession, logResourceActivity } = require('../middlewares/audit');

router.use(authenticate);
router.use(trackUserSession);

router.get(
  '/',
  hasPermission('PAYMENTS_VIEW'),
  logResourceActivity('PAYMENT'),
  PaymentController.list
);

router.get(
  '/:id',
  hasPermission('PAYMENTS_VIEW'),
  logResourceActivity('PAYMENT'),
  PaymentController.getById
);

router.post(
  '/',
  hasPermission('PAYMENTS_CREATE'),
  logResourceActivity('PAYMENT'),
  PaymentController.create
);

router.put(
  '/:id',
  hasPermission('PAYMENTS_UPDATE'),
  logResourceActivity('PAYMENT'),
  PaymentController.update
);

router.delete(
  '/:id',
  hasPermission('PAYMENTS_DELETE'),
  logResourceActivity('PAYMENT'),
  PaymentController.remove
);

module.exports = router;
