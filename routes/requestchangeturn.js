const express = require('express');
const router = express.Router();
const requestChangeTurnController = require('../controllers/requestChangeTurnController');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todas las solicitudes de cambio de turno con detalles
router.get('/details', authMiddleware, async (req, res) => {
  try {
    console.log("Entro a details")
    const requests = await requestChangeTurnController.getAllRequestsWithDetails();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las solicitudes de cambio de turno con detalles' });
  }
});

// Obtener todas las solicitudes de cambio de turno
router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await requestChangeTurnController.getAllRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las solicitudes de cambio de turno' });
  }
});

// Obtener una solicitud de cambio de turno por su ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await requestChangeTurnController.getRequestById(requestId);
    if (!request) {
      res.status(404).json({ error: 'Solicitud de cambio de turno no encontrada' });
    } else {
      res.json(request);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la solicitud de cambio de turno' });
  }
});

// Crear una nueva solicitud de cambio de turno
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newRequest = req.body; // Asegúrate de enviar los datos correctamente en el cuerpo de la solicitud
    const result = await requestChangeTurnController.createRequest(newRequest);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar una nueva solicitud de cambio de turno' });
  }
});

// Actualizar una solicitud de cambio de turno existente
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.id;
    const updatedRequest = req.body; // Asegúrate de enviar los datos correctamente en el cuerpo de la solicitud
    const result = await requestChangeTurnController.updateRequest(requestId, updatedRequest);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la solicitud de cambio de turno' });
  }
});

// Eliminar una solicitud de cambio de turno
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.id;
    const result = await requestChangeTurnController.deleteRequest(requestId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la solicitud de cambio de turno' });
  }
});

// Aprobar una solicitud de cambio de turno
router.put('/approve/:id', authMiddleware, async (req, res) => {
    try {
      const requestId = req.params.id;
      const result = await requestChangeTurnController.approveRequest(requestId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error al aprobar la solicitud de cambio de turno' });
    }
  });
  
  // Denegar una solicitud de cambio de turno
  router.put('/deny/:id', authMiddleware, async (req, res) => {
    try {
      const requestId = req.params.id;
      const result = await requestChangeTurnController.denyRequest(requestId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error al denegar la solicitud de cambio de turno' });
    }
  });



module.exports = router;
