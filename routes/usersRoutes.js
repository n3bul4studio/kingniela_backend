const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Rutas para usuarios
router.post('/', usersController.createUser); // Crear un nuevo usuario
router.get('/', usersController.getUsers); // Obtener todos los usuarios
router.get('/:id', usersController.getUserById); // Obtener un usuario por ID
router.put('/:id', usersController.updateUser); // Actualizar un usuario
router.delete('/:id', usersController.deleteUser); // Eliminar un usuario

module.exports = router;
