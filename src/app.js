/**
 * @file app.js
 * @description Punto de entrada principal del servidor web API.
 * Configura los middlewares (CORS, JSON Parser) y monta las rutas de autenticación.
 */

const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');

// Inicializar la aplicación Express
const app = express();

// Middlewares globales
// CORS para permitir peticiones desde cualquier origen (navegadores, Postman, etc.)
app.use(cors());

// Parseo automático del cuerpo de peticiones en formato JSON
app.use(express.json());

// Parseo de peticiones URL-encoded (formularios HTML estándar)
app.use(express.urlencoded({ extended: true }));

// Montar las rutas de autenticación bajo el prefijo /api y también en la raíz para conveniencia
app.use('/api', authRoutes);
app.use('/', authRoutes);

// Manejador para rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        mensaje: `La ruta '${req.originalUrl}' no existe en este servidor.`
    });
});

// Middleware de manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error no controlado en la aplicación:', err);
    res.status(500).json({
        status: 'error',
        mensaje: 'Ocurrió un error inesperado en el servidor.'
    });
});

// Iniciar el servidor si este archivo se ejecuta directamente
if (require.main === module) {
    app.listen(config.port, () => {
        console.log('====================================================');
        console.log(` Servidor de API iniciado exitosamente`);
        console.log(` Puerto: http://localhost:${config.port}`);
        console.log(` Endpoints disponibles:`);
        console.log(`  - POST /api/register  (Registro de usuario)`);
        console.log(`  - POST /api/login     (Inicio de sesión)`);
        console.log('====================================================');
    });
}

module.exports = app;
