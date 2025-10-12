const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { authenticate, hasPermission } = require('../middlewares/auth');
const { logResourceActivity } = require('../middlewares/audit');

/**
 * Routes pour la gestion des catégories
 * Toutes les routes nécessitent une authentification
 */

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

/**
 * @route   GET /api/categories
 * @desc    Récupérer toutes les catégories avec pagination et filtres
 * @access  Private - Nécessite permission CATEGORIES_VIEW
 * @query   page, limit, search, isActive, sortBy, sortOrder
 */
router.get('/', 
  hasPermission('CATEGORIES_VIEW'),
  logResourceActivity('CATEGORY'),
  CategoryController.getCategories
);

/**
 * @route   GET /api/categories/:id
 * @desc    Récupérer une catégorie spécifique avec ses produits
 * @access  Private - Nécessite permission CATEGORIES_VIEW
 */
router.get('/:id', 
  hasPermission('CATEGORIES_VIEW'),
  logResourceActivity('CATEGORY'),
  CategoryController.getCategoryById
);

/**
 * @route   POST /api/categories
 * @desc    Créer une nouvelle catégorie
 * @access  Private - Nécessite permission CATEGORIES_CREATE
 * @body    { name, description, icon, color, isActive }
 */
router.post('/', 
  hasPermission('CATEGORIES_CREATE'),
  logResourceActivity('CATEGORY'),
  CategoryController.createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Mettre à jour une catégorie
 * @access  Private - Nécessite permission CATEGORIES_UPDATE
 * @body    { name, description, icon, color, isActive, displayOrder }
 */
router.put('/:id', 
  hasPermission('CATEGORIES_UPDATE'),
  logResourceActivity('CATEGORY'),
  CategoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Supprimer une catégorie
 * @access  Private - Nécessite permission CATEGORIES_DELETE
 * @query   force=true pour forcer la suppression même avec des produits
 */
router.delete('/:id', 
  hasPermission('CATEGORIES_DELETE'),
  logResourceActivity('CATEGORY'),
  CategoryController.deleteCategory
);

/**
 * @route   PUT /api/categories/reorder
 * @desc    Réorganiser l'ordre d'affichage des catégories
 * @access  Private - Nécessite permission CATEGORIES_UPDATE
 * @body    { categoryIds: [1, 3, 2, 4] }
 */
router.put('/reorder', 
  hasPermission('CATEGORIES_UPDATE'),
  logResourceActivity('CATEGORY'),
  CategoryController.reorderCategories
);

/**
 * @route   PATCH /api/categories/:id/toggle
 * @desc    Activer/Désactiver une catégorie
 * @access  Private - Nécessite permission CATEGORIES_UPDATE
 */
router.patch('/:id/toggle', 
  hasPermission('CATEGORIES_UPDATE'),
  logResourceActivity('CATEGORY'),
  CategoryController.toggleCategoryStatus
);

module.exports = router;
