/**
 * @file authRoutes.js
 * @description Definición de rutas y endpoints para el servicio de autenticación.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta de información del estado del servicio
router.get('/', authController.getStatus);

// Ruta para el registro de nuevos usuarios
// Soporta tanto /register como /auth/register
router.post('/register', authController.register);
router.post('/auth/register', authController.register);

// Ruta para el inicio de sesión (Login)
// Soporta tanto /login como /auth/login
router.post('/login', authController.login);
router.post('/auth/login', authController.login);

module.exports = router;
