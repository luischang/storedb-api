const express = require('express');
const router = express.Router();
const turnTypeController = require('../controllers/turnTypeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
      const turnTypes = await turnTypeController.getAllTurnTypes();
      res.json(turnTypes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los tipos de turnos' });
    }
  });

  module.exports = router;
