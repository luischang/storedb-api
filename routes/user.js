// routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo usuario con los datos proporcionados.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *                 description: Nombre del usuario.
 *               LastName:
 *                 type: string
 *                 description: Apellido del usuario.
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento del usuario en formato YYYY-MM-DD.
 *               Country:
 *                 type: string
 *                 description: País del usuario.
 *               Address:
 *                 type: string
 *                 description: Dirección del usuario.
 *               Email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *               Password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente. Devuelve el ID del nuevo usuario.
 *       '500':
 *         description: Error al crear el usuario.
 */
router.post('/', async (req, res) => {
  try {
    const newUserId = await userController.createUser(req.body);
    res.status(201).json({ id: newUserId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Obtiene una lista de todos los usuarios registrados.
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida exitosamente.
 *       '500':
 *         description: Error al obtener la lista de usuarios.
 */
router.get('/', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     description: Obtiene los detalles de un usuario específico según su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Detalles del usuario obtenidos exitosamente.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error al obtener el usuario.
 */
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userController.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     description: Actualiza los datos de un usuario específico según su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *                 description: Nombre del usuario.
 *               LastName:
 *                 type: string
 *                 description: Apellido del usuario.
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento del usuario en formato YYYY-MM-DD.
 *               Country:
 *                 type: string
 *                 description: País del usuario.
 *               Address:
 *                 type: string
 *                 description: Dirección del usuario.
 *               Email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error al actualizar el usuario.
 */
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const updated = await userController.updateUser(userId, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario actualizado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Elimina un usuario específico según su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error al eliminar el usuario.
 */
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deleted = await userController.deleteUser(userId);
    if (!deleted) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
