// routes/category.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints para gestionar las categorías de productos
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categories]
 *     responses:
 *       '200':
 *         description: Lista de todas las categorías
 *       '500':
 *         description: Error al obtener las categorías
 */
router.get('/', async (req, res) => {
    console.log("XXXX")
  try {
    const categories = await categoryController.getAllCategories();
    console.log("XXXX")
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Categoría encontrada
 *       '404':
 *         description: Categoría no encontrada
 *       '500':
 *         description: Error al obtener la categoría
 */
router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await categoryController.getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
    } else {
      res.json(category);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});

/**
 * @swagger
 * /categories/{id}/products:
 *   get:
 *     summary: Obtener una categoría por su ID con los productos asociados
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Categoría encontrada con los productos asociados
 *       '404':
 *         description: Categoría no encontrada
 *       '500':
 *         description: Error al obtener la categoría
 */
router.get('/:id/products', async (req, res) => {
    const categoryId = req.params.id;
    try {
      const categoryWithProducts = await categoryController.getCategoryWithProducts(categoryId);
      if (!categoryWithProducts) {
        res.status(404).json({ error: 'Categoría no encontrada' });
      } else {
        res.json(categoryWithProducts);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la categoría' });
    }
  });

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categories]
 *     requestBody:
 *       description: Datos de la nueva categoría
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Description:
 *                 type: string
 *               IsActive:
 *                 type: boolean
 *             example:
 *               Description: Electrónicos
 *               IsActive: true
 *     responses:
 *       '201':
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la nueva categoría creada
 *             example:
 *               id: 1
 *       '500':
 *         description: Error al crear la categoría
 */
router.post('/', async (req, res) => {
  try {
    const newCategoryId = await categoryController.createCategory(req.body);
    res.status(201).json({ id: newCategoryId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nueva descripción de la categoría
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Description:
 *                 type: string
 *             example:
 *               Description: Ropa
 *     responses:
 *       '200':
 *         description: Categoría actualizada exitosamente
 *       '404':
 *         description: Categoría no encontrada
 *       '500':
 *         description: Error al actualizar la categoría
 */
router.put('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
      const updated = await categoryController.updateCategory(categoryId, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Categoría no encontrada' });
      } else {
        res.json({ message: 'Categoría actualizada exitosamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
  });

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Categoría eliminada exitosamente (eliminación lógica)
 *       '404':
 *         description: Categoría no encontrada
 *       '500':
 *         description: Error al eliminar la categoría
 */
router.delete('/:id', async (req, res) => {
  const categoryId = req.params.id;
  try {
    const deleted = await categoryController.deleteCategory(categoryId);
    if (!deleted) {
      res.status(404).json({ error: 'Categoría no encontrada' });
    } else {
      res.json({ message: 'Categoría eliminada exitosamente (eliminación lógica)' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
