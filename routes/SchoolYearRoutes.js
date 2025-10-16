const express = require('express');
const router = express.Router();
const SchoolYearController = require('../controllers/SchoolYearController');
const { authenticate, hasPermission } = require('../middlewares/auth');
const { logResourceActivity } = require('../middlewares/audit');

/**
 * Routes pour la gestion des années scolaires
 * Toutes les routes sont protégées par authentification et nécessitent la permission SCHOOL_YEARS_MANAGE
 */

router.use(authenticate);

router.get('/',
  hasPermission('SCHOOL_YEARS_MANAGE'),
  logResourceActivity('SCHOOL_YEAR'),
  SchoolYearController.list
);

router.get('/:id',
  hasPermission('SCHOOL_YEARS_MANAGE'),
  logResourceActivity('SCHOOL_YEAR'),
  SchoolYearController.getById
);

router.post('/',
  hasPermission('SCHOOL_YEARS_MANAGE'),
  logResourceActivity('SCHOOL_YEAR'),
  SchoolYearController.create
);

router.put('/:id',
  hasPermission('SCHOOL_YEARS_MANAGE'),
  logResourceActivity('SCHOOL_YEAR'),
  SchoolYearController.update
);

router.post('/:id/activate',
  hasPermission('SCHOOL_YEARS_MANAGE'),
  logResourceActivity('SCHOOL_YEAR'),
  SchoolYearController.activate
);

router.delete('/:id',
  hasPermission('SCHOOL_YEARS_MANAGE'),
  logResourceActivity('SCHOOL_YEAR'),
  SchoolYearController.delete
);

module.exports = router;
