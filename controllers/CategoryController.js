const { Category, Product, sequelize } = require('../models');
const { Op } = require('sequelize');
const AuditService = require('../services/AuditService');

/**
 * CategoryController
 * Gestion CRUD complète des catégories de produits
 */

class CategoryController {
  /**
   * Récupérer toutes les catégories avec le nombre de produits
   */
  static async getCategories(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        search = '', 
        isActive,
        sortBy = 'displayOrder',
        sortOrder = 'ASC'
      } = req.query;

      const offset = (page - 1) * limit;

      // Construction des filtres
      const where = {};
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      // Récupération avec comptage de produits
      const { count, rows: categories } = await Category.findAndCountAll({
        where,
        include: [{
          model: Product,
          as: 'products',
          attributes: [],
          required: false
        }],
        attributes: {
          include: [
            [
              sequelize.fn('COUNT', sequelize.col('products.id')),
              'productsCount'
            ]
          ]
        },
        group: ['Category.id'],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        subQuery: false
      });

      // Reformater pour obtenir les vraies catégories avec le count
      const categoriesWithCount = await Promise.all(
        categories.map(async (cat) => {
          const productCount = await Product.count({
            where: { categoryId: cat.id }
          });
          
          return {
            ...cat.get({ plain: true }),
            productsCount: productCount
          };
        })
      );

      // Log d'audit
      await AuditService.logActivity({
        userId: req.user?.id,
        action: 'CATEGORIES_VIEW',
        resourceType: 'Category',
        resourceId: null,
        details: { filters: req.query }
      });

      res.json({
        success: true,
        data: {
          categories: categoriesWithCount,
          pagination: {
            total: count.length || 0,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil((count.length || 0) / limit)
          }
        }
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des catégories:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des catégories',
        error: error.message
      });
    }
  }

  /**
   * Récupérer une catégorie spécifique avec ses produits
   */
  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id, {
        include: [{
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false,
          order: [['name', 'ASC']]
        }]
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      res.json({
        success: true,
        data: category
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la catégorie',
        error: error.message
      });
    }
  }

  /**
   * Créer une nouvelle catégorie
   */
  static async createCategory(req, res) {
    try {
      const { name, description, icon, color, isActive = true } = req.body;

      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Le nom de la catégorie est requis'
        });
      }

      // Vérifier l'unicité du nom
      const existingCategory = await Category.findOne({
        where: { name: name.trim() }
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'Une catégorie avec ce nom existe déjà'
        });
      }

      // Obtenir le prochain displayOrder
      const maxOrder = await Category.max('displayOrder') || 0;

      // Créer la catégorie
      const category = await Category.create({
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon || '📦',
        color: color || '#6366f1',
        isActive,
        displayOrder: maxOrder + 1
      });

      // Log d'audit
      await AuditService.logActivity({
        userId: req.user.id,
        action: 'CREATE_CATEGORY',
        resourceType: 'Category',
        resourceId: category.id,
        details: { categoryName: category.name },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.status(201).json({
        success: true,
        message: 'Catégorie créée avec succès',
        data: category
      });

    } catch (error) {
      console.error('❌ Erreur lors de la création de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la catégorie',
        error: error.message
      });
    }
  }

  /**
   * Mettre à jour une catégorie
   */
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description, icon, color, isActive, displayOrder } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      // Si le nom change, vérifier l'unicité
      if (name && name.trim() !== category.name) {
        const existingCategory = await Category.findOne({
          where: { 
            name: name.trim(),
            id: { [Op.ne]: id }
          }
        });

        if (existingCategory) {
          return res.status(409).json({
            success: false,
            message: 'Une catégorie avec ce nom existe déjà'
          });
        }
      }

      const oldData = { ...category.get({ plain: true }) };

      // Mise à jour
      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (icon !== undefined) updateData.icon = icon;
      if (color !== undefined) updateData.color = color;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

      await category.update(updateData);

      // Log d'audit
      await AuditService.logActivity({
        userId: req.user.id,
        action: 'UPDATE_CATEGORY',
        resourceType: 'Category',
        resourceId: category.id,
        details: { 
          oldData,
          newData: updateData
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json({
        success: true,
        message: 'Catégorie mise à jour avec succès',
        data: category
      });

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la catégorie',
        error: error.message
      });
    }
  }

  /**
   * Supprimer une catégorie
   */
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const { force = false } = req.query;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      // Vérifier s'il y a des produits associés
      const productCount = await Product.count({
        where: { categoryId: id }
      });

      if (productCount > 0 && force !== 'true') {
        return res.status(400).json({
          success: false,
          message: `Cette catégorie contient ${productCount} produit(s). Supprimez d'abord les produits ou utilisez force=true.`,
          productsCount: productCount
        });
      }

      // Si force, mettre à null les categoryId des produits
      if (productCount > 0 && force === 'true') {
        await Product.update(
          { categoryId: null },
          { where: { categoryId: id } }
        );
      }

      const categoryData = { ...category.get({ plain: true }) };

      await category.destroy();

      // Log d'audit
      await AuditService.logActivity({
        userId: req.user.id,
        action: 'DELETE_CATEGORY',
        resourceType: 'Category',
        resourceId: id,
        details: { 
          categoryData,
          productsAffected: productCount,
          forced: force === 'true'
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json({
        success: true,
        message: 'Catégorie supprimée avec succès',
        productsAffected: productCount
      });

    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la catégorie',
        error: error.message
      });
    }
  }

  /**
   * Réorganiser l'ordre d'affichage des catégories
   */
  static async reorderCategories(req, res) {
    try {
      const { categoryIds } = req.body;

      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Un tableau d\'IDs de catégories est requis'
        });
      }

      // Mettre à jour l'ordre
      await Promise.all(
        categoryIds.map((id, index) =>
          Category.update(
            { displayOrder: index + 1 },
            { where: { id } }
          )
        )
      );

      // Log d'audit
      await AuditService.logActivity({
        userId: req.user.id,
        action: 'REORDER_CATEGORIES',
        resourceType: 'Category',
        resourceId: null,
        details: { newOrder: categoryIds },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json({
        success: true,
        message: 'Ordre des catégories mis à jour avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur lors de la réorganisation des catégories:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la réorganisation des catégories',
        error: error.message
      });
    }
  }

  /**
   * Activer/Désactiver une catégorie
   */
  static async toggleCategoryStatus(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      const newStatus = !category.isActive;
      await category.update({ isActive: newStatus });

      // Log d'audit
      await AuditService.logActivity({
        userId: req.user.id,
        action: newStatus ? 'ACTIVATE_CATEGORY' : 'DEACTIVATE_CATEGORY',
        resourceType: 'Category',
        resourceId: id,
        details: { categoryName: category.name, newStatus },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json({
        success: true,
        message: `Catégorie ${newStatus ? 'activée' : 'désactivée'} avec succès`,
        data: category
      });

    } catch (error) {
      console.error('❌ Erreur lors du changement de statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du changement de statut',
        error: error.message
      });
    }
  }
}

module.exports = CategoryController;
