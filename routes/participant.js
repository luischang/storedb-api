const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
      const participants = await participantController.getAllParticipants();
      res.json(participants);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los participantes' });
    }
  });

  // Agregar un nuevo participante
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newParticipant = req.body;
    const result = await participantController.createParticipant(newParticipant);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar un nuevo participante' });
  }
});

// Actualizar un participante existente
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const participantId = req.params.id;
    const updatedParticipant = req.body;
    const result = await participantController.updateParticipant(participantId, updatedParticipant);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el participante' });
  }
});

// Eliminar un participante
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const participantId = req.params.id;
    const result = await participantController.deleteParticipant(participantId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el participante' });
  }
});

  module.exports = router;
