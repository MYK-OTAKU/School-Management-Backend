// ================================
// SERVICE ORDER - LOGIQUE MÉTIER DES COMMANDES
// ================================
// Ce service contient la logique métier pour la gestion des commandes.
// Il gère les relations avec les produits via OrderItems.
//
// Fonctions disponibles:
//   - getAllOrders: Récupère toutes les commandes avec pagination
//   - getOrderById: Récupère une commande avec ses items
//   - createOrder: Crée une nouvelle commande avec produits
//   - updateOrderStatus: Met à jour le statut d'une commande
//   - deleteOrder: Supprime une commande
//   - getUserOrders: Récupère les commandes d'un utilisateur

const { Order, OrderItem, Product, User } = require('../models');
const { AppError, ErrorTypes } = require('../utils/errorHandler');
const { Op } = require('sequelize');
const ProductService = require('./ProductService');

class OrderService {
  static generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  static async getAllOrders(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, status, userId } = { ...filters, ...pagination };

    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'category']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return {
      orders: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  static async getOrderById(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    if (!order) {
      throw new AppError(ErrorTypes.NOT_FOUND, 'Commande non trouvée');
    }

    return order;
  }

  static async createOrder(userId, orderData) {
    const { items, notes } = orderData;

    if (!items || items.length === 0) {
      throw new AppError(ErrorTypes.VALIDATION_ERROR, 'La commande doit contenir au moins un produit');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await ProductService.getProductById(item.productId);

      if (product.stock < item.quantity) {
        throw new AppError(
          ErrorTypes.VALIDATION_ERROR,
          `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}`
        );
      }

      const subtotal = parseFloat(product.price) * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: subtotal
      });
    }

    const orderNumber = this.generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      userId,
      status: 'pending',
      totalAmount,
      notes
    });

    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      });

      await ProductService.updateStock(item.productId, item.quantity, 'subtract');
    }

    return this.getOrderById(order.id);
  }

  static async updateOrderStatus(orderId, newStatus) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(newStatus)) {
      throw new AppError(ErrorTypes.VALIDATION_ERROR, 'Statut invalide');
    }

    const order = await this.getOrderById(orderId);

    if (order.status === 'cancelled' && newStatus !== 'cancelled') {
      throw new AppError(ErrorTypes.VALIDATION_ERROR, 'Impossible de modifier une commande annulée');
    }

    if (newStatus === 'cancelled' && order.status !== 'pending') {
      throw new AppError(ErrorTypes.VALIDATION_ERROR, 'Seules les commandes en attente peuvent être annulées');
    }

    if (newStatus === 'cancelled') {
      for (const item of order.items) {
        await ProductService.updateStock(item.productId, item.quantity, 'add');
      }
    }

    await order.update({ status: newStatus });

    return this.getOrderById(orderId);
  }

  static async deleteOrder(orderId) {
    const order = await this.getOrderById(orderId);

    if (order.status !== 'cancelled' && order.status !== 'pending') {
      throw new AppError(
        ErrorTypes.VALIDATION_ERROR,
        'Seules les commandes annulées ou en attente peuvent être supprimées'
      );
    }

    await OrderItem.destroy({ where: { orderId } });
    await order.destroy();

    return { message: 'Commande supprimée avec succès' };
  }

  static async getUserOrders(userId, filters = {}) {
    return this.getAllOrders({ ...filters, userId });
  }
}

module.exports = OrderService;
