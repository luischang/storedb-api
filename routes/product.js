// routes/product.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints para gestionar los productos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       '200':
 *         description: Lista de todos los productos
 *       '500':
 *         description: Error al obtener los productos
 */
router.get('/', async (req, res) => {
  try {
    const products = await productController.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Producto encontrado
 *       '404':
 *         description: Producto no encontrado
 *       '500':
 *         description: Error al obtener el producto
 */
router.get('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productController.getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       description: Datos del nuevo producto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Description:
 *                 type: string
 *               ImageUrl:
 *                 type: string
 *               Stock:
 *                 type: integer
 *               Price:
 *                 type: number
 *               Discount:
 *                 type: integer
 *               CategoryId:
 *                 type: integer
 *             example:
 *               Description: Laptop
 *               ImageUrl: laptop.jpg
 *               Stock: 50
 *               Price: 1000.99
 *               Discount: 10
 *               CategoryId: 1
 *     responses:
 *       '201':
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del nuevo producto creado
 *             example:
 *               id: 1
 *       '500':
 *         description: Error al crear el producto
 */
router.post('/', async (req, res) => {
  try {
    const newProductId = await productController.createProduct(req.body);
    res.status(201).json({ id: newProductId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nuevos datos del producto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Description:
 *                 type: string
 *               ImageUrl:
 *                 type: string
 *               Stock:
 *                 type: integer
 *               Price:
 *                 type: number
 *               Discount:
 *                 type: integer
 *               CategoryId:
 *                 type: integer
 *             example:
 *               Description: Laptop actualizada
 *               ImageUrl: laptop_actualizada.jpg
 *               Stock: 60
 *               Price: 900.99
 *               Discount: 15
 *               CategoryId: 2
 *     responses:
 *       '200':
 *         description: Producto actualizado exitosamente
 *       '404':
 *         description: Producto no encontrado
 *       '500':
 *         description: Error al actualizar el producto
 */
router.put('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const updated = await productController.updateProduct(productId, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Producto actualizado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Producto eliminado exitosamente (eliminación lógica)
 *       '404':
 *         description: Producto no encontrado
 *       '500':
 *         description: Error al eliminar el producto
 */
router.delete('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const deleted = await productController.deleteProduct(productId);
    if (!deleted) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Producto eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
