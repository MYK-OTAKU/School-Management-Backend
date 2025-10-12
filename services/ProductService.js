// ================================
// SERVICE PRODUCT - LOGIQUE MÉTIER
// ================================
// Ce service contient toute la logique métier pour la gestion des produits.
// Il est utilisé par le ProductController et peut être réutilisé ailleurs.
//
// Fonctions disponibles:
//   - getAllProducts: Récupère tous les produits avec filtres et pagination
//   - getProductById: Récupère un produit par son ID
//   - createProduct: Crée un nouveau produit
//   - updateProduct: Met à jour un produit existant
//   - deleteProduct: Supprime un produit
//   - updateStock: Met à jour le stock d'un produit

const { Product, Category } = require('../models');
const { AppError, ErrorTypes } = require('../utils/errorHandler');
const { Op } = require('sequelize');

class ProductService {
  static async getAllProducts(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, search, categoryId, isActive, sortBy = 'createdAt', sortOrder = 'DESC' } = { ...filters, ...pagination };

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined && isActive !== null && isActive !== '') {
      // Convertir la string en boolean si nécessaire
      where.isActive = isActive === true || isActive === 'true';
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'icon', 'color']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    return {
      products: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  static async getProductById(productId) {
    const product = await Product.findByPk(productId, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'icon', 'color']
      }]
    });

    if (!product) {
      throw new AppError(ErrorTypes.NOT_FOUND, 'Produit non trouvé');
    }

    return product;
  }

  static async createProduct(productData) {
    const { name, description, price, stock, categoryId, imageUrl, isActive } = productData;

    const existingProduct = await Product.findOne({ where: { name } });

    if (existingProduct) {
      throw new AppError(ErrorTypes.VALIDATION_ERROR, 'Un produit avec ce nom existe déjà');
    }

    // Vérifier que la catégorie existe si fournie
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new AppError(ErrorTypes.VALIDATION_ERROR, 'La catégorie spécifiée n\'existe pas');
      }
    }

    // Normaliser l'URL de l'image
    let normalizedImageUrl = null;
    if (imageUrl) {
      if (typeof imageUrl === 'string' && imageUrl.trim()) {
        normalizedImageUrl = imageUrl.trim();
        // Si c'est un chemin local, s'assurer qu'il commence par /uploads/
        if (!normalizedImageUrl.startsWith('http') && !normalizedImageUrl.startsWith('/uploads/')) {
          normalizedImageUrl = `/uploads/${normalizedImageUrl}`;
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      categoryId,
      imageUrl: normalizedImageUrl,
      isActive: isActive !== undefined ? isActive : true
    });

    // Recharger avec la catégorie
    await product.reload({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'icon', 'color']
      }]
    });

    return product;
  }

  static async updateProduct(productId, productData) {
    const product = await this.getProductById(productId);

    const { name, description, price, stock, categoryId, imageUrl, isActive } = productData;

    if (name && name !== product.name) {
      const existingProduct = await Product.findOne({ where: { name } });
      if (existingProduct) {
        throw new AppError(ErrorTypes.VALIDATION_ERROR, 'Un produit avec ce nom existe déjà');
      }
    }

    // Vérifier que la catégorie existe si fournie
    if (categoryId !== undefined && categoryId !== null) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new AppError(ErrorTypes.VALIDATION_ERROR, 'La catégorie spécifiée n\'existe pas');
      }
    }

    // Normaliser l'URL de l'image
    let normalizedImageUrl = product.imageUrl; // Garder l'ancienne valeur par défaut
    if (imageUrl !== undefined) {
      if (imageUrl === null || imageUrl === '') {
        normalizedImageUrl = null;
      } else if (typeof imageUrl === 'string' && imageUrl.trim()) {
        normalizedImageUrl = imageUrl.trim();
        // Si c'est un chemin local, s'assurer qu'il commence par /uploads/
        if (!normalizedImageUrl.startsWith('http') && !normalizedImageUrl.startsWith('/uploads/')) {
          normalizedImageUrl = `/uploads/${normalizedImageUrl}`;
        }
      }
    }

    await product.update({
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price : product.price,
      stock: stock !== undefined ? stock : product.stock,
      categoryId: categoryId !== undefined ? categoryId : product.categoryId,
      imageUrl: normalizedImageUrl,
      isActive: isActive !== undefined ? isActive : product.isActive
    });

    // Recharger avec la catégorie
    await product.reload({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'icon', 'color']
      }]
    });

    return product;
  }

  static async deleteProduct(productId) {
    const product = await this.getProductById(productId);
    await product.destroy();
    return { message: 'Produit supprimé avec succès' };
  }

  static async updateStock(productId, quantity, operation = 'add') {
    const product = await this.getProductById(productId);

    let newStock;
    if (operation === 'add') {
      newStock = product.stock + quantity;
    } else if (operation === 'subtract') {
      newStock = product.stock - quantity;
      if (newStock < 0) {
        throw new AppError(ErrorTypes.VALIDATION_ERROR, 'Stock insuffisant');
      }
    } else {
      newStock = quantity;
    }

    await product.update({ stock: newStock });
    return product;
  }
}

module.exports = ProductService;
