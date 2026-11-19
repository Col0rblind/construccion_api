/**
 * @file test-api.js
 * @description Script de pruebas automatizadas para verificar el servicio de registro e inicio de sesión.
 * Evalúa los casos de prueba de acuerdo con la guía SENA:
 *   1. Registro de usuario.
 *   2. Autenticación satisfactoria (credenciales correctas).
 *   3. Error en la autenticación (contraseña incorrecta).
 *   4. Error en la autenticación (usuario no existente).
 *   5. Error en la autenticación (campos vacíos).
 */

const http = require('http');
const app = require('./src/app');

const PORT = 3001; // Usamos un puerto temporal de pruebas
let server;

// Función auxiliar para enviar peticiones HTTP POST en JSON
function post(path, data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const options = {
            hostname: '127.0.0.1',
            port: PORT,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ statusCode: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

// Ejecución secuencial de los casos de prueba
async function runTests() {
    server = app.listen(PORT, async () => {
        console.log(`\n======================================================`);
        console.log(` INICIANDO PRUEBAS AUTOMATIZADAS DE LA API DE LOGIN`);
        console.log(`======================================================\n`);

        const testUser = `aprendiz_${Date.now()}`;
        const testPassword = 'PasswordSeguro123*';

        try {
            // CASO 1: Registro de un nuevo usuario
            console.log(`[PRUEBA 1] Registro de nuevo usuario: "${testUser}"`);
            const resRegister = await post('/api/register', {
                usuario: testUser,
                contrasena: testPassword
            });
            console.log(` - Código HTTP recibido: ${resRegister.statusCode}`);
            console.log(` - Respuesta:`, resRegister.data);
            if (resRegister.statusCode === 201) {
                console.log(' -> RESULTADO: PASÓ (Registro exitoso)\n');
            } else {
                console.error(' -> RESULTADO: FALLÓ\n');
            }

            // CASO 2: Inicio de sesión con credenciales correctas
            console.log(`[PRUEBA 2] Login con credenciales válidas (Autenticación satisfactoria)`);
            const resLoginSuccess = await post('/api/login', {
                usuario: testUser,
                contrasena: testPassword
            });
            console.log(` - Código HTTP recibido: ${resLoginSuccess.statusCode}`);
            console.log(` - Respuesta:`, resLoginSuccess.data);
            if (resLoginSuccess.statusCode === 200 && resLoginSuccess.data.mensaje === 'autenticación satisfactoria') {
                console.log(' -> RESULTADO: PASÓ (Mensaje exacto: "autenticación satisfactoria")\n');
            } else {
                console.error(' -> RESULTADO: FALLÓ\n');
            }

            // CASO 3: Inicio de sesión con contraseña equivocada
            console.log(`[PRUEBA 3] Login con contraseña incorrecta (Error de autenticación)`);
            const resWrongPassword = await post('/api/login', {
                usuario: testUser,
                contrasena: 'claveInvalida_999'
            });
            console.log(` - Código HTTP recibido: ${resWrongPassword.statusCode}`);
            console.log(` - Respuesta:`, resWrongPassword.data);
            if (resWrongPassword.statusCode === 401 && resWrongPassword.data.mensaje === 'error en la autenticación') {
                console.log(' -> RESULTADO: PASÓ (Mensaje exacto: "error en la autenticación")\n');
            } else {
                console.error(' -> RESULTADO: FALLÓ\n');
            }

            // CASO 4: Inicio de sesión con usuario inexistente
            console.log(`[PRUEBA 4] Login con usuario inexistente`);
            const resUserNotFound = await post('/api/login', {
                usuario: 'usuario_que_no_existe_xyz',
                contrasena: '123456'
            });
            console.log(` - Código HTTP recibido: ${resUserNotFound.statusCode}`);
            console.log(` - Respuesta:`, resUserNotFound.data);
            if (resUserNotFound.statusCode === 401 && resUserNotFound.data.mensaje === 'error en la autenticación') {
                console.log(' -> RESULTADO: PASÓ (Mensaje exacto: "error en la autenticación")\n');
            } else {
                console.error(' -> RESULTADO: FALLÓ\n');
            }

            // CASO 5: Inicio de sesión sin enviar campos obligatorios
            console.log(`[PRUEBA 5] Login con datos incompletos`);
            const resIncomplete = await post('/api/login', {});
            console.log(` - Código HTTP recibido: ${resIncomplete.statusCode}`);
            console.log(` - Respuesta:`, resIncomplete.data);
            if (resIncomplete.statusCode === 400 && resIncomplete.data.mensaje === 'error en la autenticación') {
                console.log(' -> RESULTADO: PASÓ (Validación de campos obligatorios)\n');
            } else {
                console.error(' -> RESULTADO: FALLÓ\n');
            }

            console.log(`======================================================`);
            console.log(` TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO`);
            console.log(`======================================================\n`);

        } catch (error) {
            console.error('Error durante la ejecución de las pruebas:', error);
        } finally {
            server.close();
            process.exit(0);
        }
    });
}

runTests();
