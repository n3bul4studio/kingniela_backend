const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const scoresController = require('../controllers/scoresController');

router.use((req, res, next) => {

    try {
        const token = req.headers.authorization;
        const data = jwt.decode(token, process.env.SECRET_KEY);
        console.log("🚀 ~ router.use ~ data:", data)
        
        req.userId = data.userId;
    } catch (error) {
        return res.status(403).json({ error: 'No token' });
    }

    next();
})


// Rutas especiales para puntajes
router.get('/lead-global/:bet_id', scoresController.getLeadGlobal); // Obtener el ranking global por bet_id
router.get('/all-index', scoresController.getAllIndex); // Obtener todos los índices de puntajes
router.get('/user-predictions', scoresController.predictionByUserId); // Obtener predicciones por usr_id
router.get('/user-predictions-end', scoresController.predictionsEndByUserId); // Obtener predicciones por usr_id
router.get('/news', scoresController.getNewScores); // Obtener predicciones por usr_id
router.get('/lead-by-phase/:bet_id/:phs_id', scoresController.getLeadByPhase); // Obtener el ranking por fase usando bet_id y phs_id
router.post('/user-prediction', scoresController.createScoreFromUser); // Crear un nuevo puntaje

// Rutas para puntajes
router.post('/', scoresController.createScore); // Crear un nuevo puntaje
router.get('/', scoresController.getScores); // Obtener todos los puntajes
router.get('/:id', scoresController.getScoreById); // Obtener un puntaje por ID
router.put('/:id', scoresController.updateScore); // Actualizar un puntaje
router.delete('/:id', scoresController.deleteScore); // Eliminar un puntaje

module.exports = router;
