const express = require('express');
const router = express.Router();
const betsController = require('../controllers/betsController');

// Rutas para apuestas
router.post('/', betsController.createBet); // Crear una nueva apuesta
router.get('/', betsController.getBets); // Obtener todas las apuestas
router.get('/:id', betsController.getBetById); // Obtener una apuesta por ID
router.put('/:id', betsController.updateBet); // Actualizar una apuesta
router.delete('/:id', betsController.deleteBet); // Eliminar una apuesta

module.exports = router;
