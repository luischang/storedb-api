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

  // Agregar un nuevo tipo de turno
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newTurnType = req.body; // Asegúrate de enviar los datos correctamente en el cuerpo de la solicitud
    const result = await turnTypeController.createTurnType(newTurnType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar un nuevo tipo de turno' });
  }
});

// Actualizar un tipo de turno existente
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const turnTypeId = req.params.id;
    const updatedTurnType = req.body; // Asegúrate de enviar los datos correctamente en el cuerpo de la solicitud
    const result = await turnTypeController.updateTurnType(turnTypeId, updatedTurnType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el tipo de turno' });
  }
});

// Eliminar un tipo de turno
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const turnTypeId = req.params.id;
    const result = await turnTypeController.deleteTurnType(turnTypeId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tipo de turno' });
  }
});

  module.exports = router;
