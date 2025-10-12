// ================================
// ROUTES PRODUCT - EXEMPLE DE CRUD SIMPLE
// ================================
// Ces routes définissent les endpoints pour la gestion des produits.
// Toutes les routes sont protégées par authentification.
//
// Permissions requises:
//   - PRODUCTS_VIEW: Voir les produits
//   - PRODUCTS_CREATE: Créer des produits
//   - PRODUCTS_UPDATE: Modifier des produits
//   - PRODUCTS_DELETE: Supprimer des produits

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticate, hasPermission } = require('../middlewares/auth');
const upload = require('../config/multer-config');

router.get(
  '/',
  authenticate,
  hasPermission('PRODUCTS_VIEW'),
  ProductController.getAllProducts
);

router.get(
  '/:id',
  authenticate,
  hasPermission('PRODUCTS_VIEW'),
  ProductController.getProductById
);

router.post(
  '/',
  authenticate,
  hasPermission('PRODUCTS_CREATE'),
  ProductController.createProduct
);

router.put(
  '/:id',
  authenticate,
  hasPermission('PRODUCTS_UPDATE'),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  hasPermission('PRODUCTS_DELETE'),
  ProductController.deleteProduct
);

router.patch(
  '/:id/stock',
  authenticate,
  hasPermission('PRODUCTS_UPDATE'),
  ProductController.updateStock
);

// Image upload routes
router.post(
  '/upload-image',
  authenticate,
  hasPermission('PRODUCTS_CREATE'),
  upload.single('image'),
  ProductController.uploadImage
);

router.delete(
  '/image/:filename',
  authenticate,
  hasPermission('PRODUCTS_DELETE'),
  ProductController.deleteImage
);

module.exports = router;
