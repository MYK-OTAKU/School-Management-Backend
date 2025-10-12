// ================================
// CONTROLLER PRODUCT - GESTION DES REQUÊTES HTTP
// ================================
// Ce contrôleur gère toutes les requêtes HTTP liées aux produits.
// Il utilise ProductService pour la logique métier.
//
// Endpoints:
//   - GET /api/products : Liste tous les produits (avec filtres et pagination)
//   - GET /api/products/:id : Récupère un produit spécifique
//   - POST /api/products : Crée un nouveau produit
//   - PUT /api/products/:id : Met à jour un produit
//   - DELETE /api/products/:id : Supprime un produit
//   - PATCH /api/products/:id/stock : Met à jour le stock

const ProductService = require('../services/ProductService');
const AuditService = require('../services/AuditService');
const path = require('path');
const fs = require('fs');

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const { page, limit, search, categoryId, isActive, sortBy, sortOrder } = req.query;

      const result = await ProductService.getAllProducts(
        { search, categoryId, isActive, sortBy, sortOrder },
        { page, limit }
      );

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'PRODUCTS_VIEW',
        resourceType: 'Product',
        resourceId: null,
        details: { filters: req.query }
      });

      return res.status(200).json({
        success: true,
        message: 'Produits récupérés avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await ProductService.getProductById(id);

      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'PRODUCTS_VIEW',
        resourceType: 'Product',
        resourceId: id
      });

      return res.status(200).json({
        success: true,
        message: 'Produit récupéré avec succès',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const productData = req.body;

      const product = await ProductService.createProduct(productData);

      await AuditService.logActivity({
        userId: req.user.id,
        action: 'PRODUCTS_CREATE',
        resourceType: 'Product',
        resourceId: product.id,
        newValues: { productName: product.name }
      });

      return res.status(201).json({
        success: true,
        message: 'Produit créé avec succès',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productData = req.body;

      const product = await ProductService.updateProduct(id, productData);

      await AuditService.logActivity({
        userId: req.user.id,
        action: 'PRODUCTS_UPDATE',
        resourceType: 'Product',
        resourceId: id,
        newValues: productData
      });

      return res.status(200).json({
        success: true,
        message: 'Produit mis à jour avec succès',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const result = await ProductService.deleteProduct(id);

      await AuditService.logActivity({
        userId: req.user.id,
        action: 'PRODUCTS_DELETE',
        resourceType: 'Product',
        resourceId: id
      });

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity, operation } = req.body;

      const product = await ProductService.updateStock(id, quantity, operation);

      await AuditService.logActivity({
        userId: req.user.id,
        action: 'PRODUCTS_UPDATE_STOCK',
        resourceType: 'Product',
        resourceId: id,
        details: { quantity, operation, newStock: product.stock }
      });

      return res.status(200).json({
        success: true,
        message: 'Stock mis à jour avec succès',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni'
        });
      }

      // Vérifier la taille du fichier (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        // Supprimer le fichier uploadé
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Le fichier est trop volumineux (5MB maximum)'
        });
      }

      // Construire l'URL de l'image
      const imageUrl = `/uploads/${req.file.filename}`;

      await AuditService.logActivity({
        userId: req.user.id,
        action: 'PRODUCTS_UPLOAD_IMAGE',
        resourceType: 'Product',
        resourceId: null,
        details: { filename: req.file.filename, originalName: req.file.originalname }
      });

      return res.status(200).json({
        success: true,
        message: 'Image uploadée avec succès',
        data: {
          imageUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        }
      });
    } catch (error) {
      // Nettoyer le fichier en cas d'erreur
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Erreur lors de la suppression du fichier:', unlinkError);
        }
      }
      next(error);
    }
  }

  static async deleteImage(req, res, next) {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), 'uploads', filename);

      // Vérifier si le fichier existe
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);

        await AuditService.logActivity({
          userId: req.user.id,
          action: 'PRODUCTS_DELETE_IMAGE',
          resourceType: 'Product',
          resourceId: null,
          details: { filename }
        });

        return res.status(200).json({
          success: true,
          message: 'Image supprimée avec succès'
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Image non trouvée'
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
