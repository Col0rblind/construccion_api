/**
 * @file userModel.js
 * @description Modelo de datos y gestión de persistencia de usuarios.
 * Maneja la lectura y escritura en archivo JSON y encriptación de contraseñas con bcryptjs.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

class UserModel {
    constructor() {
        this.filePath = config.usersFilePath;
        this._ensureStorageExists();
    }

    /**
     * Verifica que el directorio y el archivo de usuarios existan.
     * Si no existen, los crea automáticamente con un arreglo vacío.
     */
    _ensureStorageExists() {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
        }
    }

    /**
     * Obtiene todos los usuarios registrados desde el archivo de persistencia.
     * @returns {Array} Lista de usuarios
     */
    getAllUsers() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo de usuarios:', error.message);
            return [];
        }
    }

    /**
     * Busca un usuario por su nombre de usuario.
     * @param {string} username - Nombre de usuario a buscar
     * @returns {Object|null} Objeto usuario o null si no se encuentra
     */
    findByUsername(username) {
        const users = this.getAllUsers();
        // Búsqueda insensible a mayúsculas/minúsculas para evitar duplicados ambiguos
        return users.find(u => u.usuario.toLowerCase() === username.trim().toLowerCase()) || null;
    }

    /**
     * Registra un nuevo usuario con la contraseña encriptada.
     * @param {string} username - Nombre del usuario
     * @param {string} plainPassword - Contraseña en texto plano
     * @returns {Promise<Object>} Usuario creado (sin exponer contraseña sensible en la respuesta)
     */
    async createUser(username, plainPassword) {
        const users = this.getAllUsers();

        // Generar sal y hash de la contraseña usando bcrypt (10 rondas de hashing)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        // Crear la entidad del usuario
        const newUser = {
            id: Date.now(),
            usuario: username.trim(),
            password: hashedPassword,
            fechaCreacion: new Date().toISOString()
        };

        // Guardar en la colección y persistir en el archivo JSON
        users.push(newUser);
        fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf-8');

        // Retornar información pública del usuario (sin el hash de la contraseña)
        return {
            id: newUser.id,
            usuario: newUser.usuario,
            fechaCreacion: newUser.fechaCreacion
        };
    }

    /**
     * Compara una contraseña en texto plano contra el hash almacenado.
     * @param {string} plainPassword - Contraseña ingresada
     * @param {string} hashedPassword - Hash almacenado en la base de datos
     * @returns {Promise<boolean>} true si coincide, false en caso contrario
     */
    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = new UserModel();
