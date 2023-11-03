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

  module.exports = router;
