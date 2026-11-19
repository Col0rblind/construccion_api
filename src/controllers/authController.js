/**
 * @file authController.js
 * @description Controlador de autenticación para el registro y el inicio de sesión.
 * Cumple con los requerimientos de la guía:
 *  - Recibe usuario y contraseña.
 *  - Valida credenciales.
 *  - Devuelve "autenticación satisfactoria" en caso de éxito.
 *  - Devuelve "error en la autenticación" en caso contrario.
 *  - Código debidamente documentado con comentarios explicativos.
 */

const userModel = require('../models/userModel');

/**
 * Normaliza los parámetros recibidos en el cuerpo de la petición.
 * Permite recibir campos en español ('usuario', 'contrasena', 'contraseña')
 * o en inglés ('username', 'password') para mayor compatibilidad.
 * @param {Object} body - Objeto req.body
 * @returns {Object} { usuario, contrasena }
 */
function extractCredentials(body) {
    const usuario = body.usuario || body.username;
    const contrasena = body.contrasena || body.contraseña || body.password;
    return { usuario, contrasena };
}

/**
 * Controlador para el registro de un nuevo usuario.
 * Endpoint: POST /api/register (o /api/auth/register)
 * 
 * Flujo:
 *  1. Valida que se hayan proporcionado usuario y contraseña.
 *  2. Verifica que el usuario no exista previamente.
 *  3. Hashea la contraseña y guarda el registro.
 *  4. Retorna respuesta de confirmación de registro.
 */
exports.register = async (req, res) => {
    try {
        const { usuario, contrasena } = extractCredentials(req.body);

        // Validación 1: Campos requeridos
        if (!usuario || !contrasena) {
            return res.status(400).json({
                status: 'error',
                mensaje: 'Debe ingresar un usuario y una contraseña para el registro.'
            });
        }

        // Validación 2: Longitud mínima de contraseña
        if (String(contrasena).length < 4) {
            return res.status(400).json({
                status: 'error',
                mensaje: 'La contraseña debe tener al menos 4 caracteres.'
            });
        }

        // Validación 3: Existencia previa del usuario
        const existingUser = userModel.findByUsername(usuario);
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                mensaje: `El usuario '${usuario}' ya se encuentra registrado.`
            });
        }

        // Creación del usuario con contraseña encriptada
        const newUser = await userModel.createUser(usuario, String(contrasena));

        // Respuesta exitosa de registro
        return res.status(201).json({
            status: 'success',
            mensaje: 'Usuario registrado exitosamente.',
            datos: {
                id: newUser.id,
                usuario: newUser.usuario,
                fechaCreacion: newUser.fechaCreacion
            }
        });

    } catch (error) {
        console.error('Error durante el registro:', error);
        return res.status(500).json({
            status: 'error',
            mensaje: 'Ocurrió un error interno en el servidor durante el registro.'
        });
    }
};

/**
 * Controlador para el inicio de sesión (Login).
 * Endpoint: POST /api/login (o /api/auth/login)
 * 
 * Requerimiento específico:
 *  "El servicio recibirá un usuario y una contraseña, si la autenticación es correcta
 *   saldrá un mensaje de autenticación satisfactoria, en caso contrario, debe devolver
 *   error en la autenticación."
 */
exports.login = async (req, res) => {
    try {
        const { usuario, contrasena } = extractCredentials(req.body);

        // Si faltan credenciales en la petición, devolver error en la autenticación
        if (!usuario || !contrasena) {
            return res.status(400).json({
                status: 'error',
                mensaje: 'error en la autenticación',
                detalle: 'Se requiere proporcionar usuario y contraseña.'
            });
        }

        // Buscar el usuario en la base de datos / almacenamiento
        const user = userModel.findByUsername(usuario);

        // Si el usuario no existe, retornar mensaje de error requerido
        if (!user) {
            return res.status(401).json({
                status: 'error',
                mensaje: 'error en la autenticación'
            });
        }

        // Comparar la contraseña ingresada con el hash almacenado mediante bcrypt
        const isMatch = await userModel.comparePassword(String(contrasena), user.password);

        // Si la contraseña no coincide, retornar mensaje de error requerido
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                mensaje: 'error en la autenticación'
            });
        }

        // Si las credenciales son válidas, devolver mensaje exacto requerido
        return res.status(200).json({
            status: 'success',
            mensaje: 'autenticación satisfactoria',
            usuario: user.usuario
        });

    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        return res.status(500).json({
            status: 'error',
            mensaje: 'error en la autenticación',
            error: error.message
        });
    }
};

/**
 * Controlador informativo para verificar el estado de la API.
 * Endpoint: GET /api/
 */
exports.getStatus = (req, res) => {
    return res.status(200).json({
        nombre: 'API de Autenticación y Login - SENA',
        version: '1.0.0',
        estado: 'En línea',
        endpoints: {
            registro: 'POST /api/register',
            login: 'POST /api/login'
        }
    });
};
