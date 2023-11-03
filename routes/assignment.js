const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Leer todas las asignaciones
router.get('/', authMiddleware, async (req, res) => {
  try {
    const assignments = await assignmentController.getAllAssignments();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asignaciones' });
  }
});

// Leer todas las asignaciones por MonthNum y/o YearNum
router.get('/filter', authMiddleware, async (req, res) => {
    const { monthNum, yearNum } = req.query;
    console.log("estoy en filter")
    try {
      const assignments = await assignmentController.getAssignmentsByMonthAndYear(monthNum, yearNum);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las asignaciones filtradas' });
    }
  });

// Leer una asignación por su ID
router.get('/:id', authMiddleware, async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const assignment = await assignmentController.getAssignmentById(assignmentId);
    if (assignment === null) {
      res.status(404).json({ error: 'Asignación no encontrada 1' });
    } else {
      res.json(assignment);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la asignación' });
  }
});

// Crear una nueva asignación
router.post('/', authMiddleware, async (req, res) => {
  const newAssignment = req.body;
  try {
    const assignmentId = await assignmentController.createAssignment(newAssignment);
    res.json({ message: 'Asignación creada con éxito', assignmentId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la asignación' });
  }
});

// Actualizar una asignación existente por su ID
router.put('/:id', authMiddleware, async (req, res) => {
  const assignmentId = req.params.id;
  const updatedAssignment = req.body;
  try {
    const success = await assignmentController.updateAssignment(assignmentId, updatedAssignment);
    if (success) {
      res.json({ message: 'Asignación actualizada con éxito' });
    } else {
      res.status(404).json({ error: 'Asignación no encontrada 2' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la asignación' });
  }
});

// Eliminar una asignación por su ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const success = await assignmentController.deleteAssignment(assignmentId);
    if (success) {
      res.json({ message: 'Asignación eliminada con éxito' });
    } else {
      res.status(404).json({ error: 'Asignación no encontrada 3' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la asignación' });
  }
});



module.exports = router;
