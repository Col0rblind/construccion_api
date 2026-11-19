/**
 * @file config.js
 * @description Archivo de configuración central de la aplicación.
 * Define el puerto del servidor y rutas de almacenamiento.
 */

const path = require('path');

// Configuración general del servicio
const config = {
    // Puerto en el que se ejecutará el servidor Express
    port: process.env.PORT || 3000,
    
    // Ruta donde se almacenará el archivo JSON con los datos de usuarios
    usersFilePath: path.join(__dirname, '..', '..', 'data', 'users.json')
};

module.exports = config;
