const express = require('express');
const router = express.Router();
const phasesController = require('../controllers/phasesController');

// Rutas para fases
router.post('/', phasesController.createPhase); // Crear una nueva fase
router.get('/', phasesController.getPhases); // Obtener todas las fases
router.get('/:id', phasesController.getPhaseById); // Obtener una fase por ID
router.put('/:id', phasesController.updatePhase); // Actualizar una fase
router.delete('/:id', phasesController.deletePhase); // Eliminar una fase

module.exports = router;
