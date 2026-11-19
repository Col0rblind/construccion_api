# API REST de Autenticación y Login (SENA)

**Programa de Formación:** Análisis y Desarrollo de Software (ADSO)  
**Actividad de Aprendizaje:** GA7-220501096-AA5 - Construcción API  
**Evidencia:** Servicio Web para Registro e Inicio de Sesión  

---

## 📌 Descripción del Proyecto

Este proyecto implementa una API RESTful desarrollada con **Node.js** y **Express** para la gestión de usuarios, cumpliendo estrictamente con los requerimientos de la guía de aprendizaje:

1. **Servicio de Registro:** Permite crear nuevos usuarios garantizando almacenamiento seguro mediante el hashing de contraseñas con **bcryptjs** (10 rondas de salt).
2. **Servicio de Inicio de Sesión (Login):** Valida las credenciales recibidas (`usuario` y `contrasena`):
   - Si la autenticación es correcta, devuelve el mensaje: **`"autenticación satisfactoria"`**.
   - En caso contrario (usuario inexistente, contraseña errónea o datos incompletos), devuelve el mensaje: **`"error en la autenticación"`**.
3. **Código comentado:** Todos los módulos, controladores, modelos y rutas contienen comentarios detallados en español explicando su funcionamiento.
4. **Control de Versiones:** Proyecto gestionado con **Git**, siguiendo un flujo estructurado de commits semánticos.

---

## 📁 Estructura del Proyecto

```text
Construcción API/
├── .gitignore               # Archivos excluidos del control de versiones
├── package.json             # Metadatos del proyecto y dependencias
├── README.md                # Documentación técnica y guía de uso
├── test-api.js              # Suite de pruebas automatizadas
├── data/
│   └── users.json           # Almacenamiento persistente de usuarios
└── src/
    ├── app.js               # Servidor principal y configuración de Express
    ├── config/
    │   └── config.js        # Configuración de puerto y rutas
    ├── controllers/
    │   └── authController.js# Lógica de registro y autenticación
    ├── models/
    │   └── userModel.js     # Modelo de persistencia y encriptación bcrypt
    └── routes/
        └── authRoutes.js    # Definición de rutas y endpoints
```

---

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- Git para el control de versiones

---

## 🚀 Instalación y Ejecución

1. **Clonar o ubicarse en el directorio del proyecto:**
   ```bash
   cd "Construcción API"
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor en modo producción:**
   ```bash
   npm start
   ```
   El servidor estará escuchando en `http://localhost:3000`.

4. **Ejecutar pruebas automatizadas:**
   ```bash
   npm test
   ```

---

## 📖 Documentación de Endpoints

### 1. Estado del Servicio
- **URL:** `GET http://localhost:3000/api/`
- **Descripción:** Verifica que la API se encuentre operativa.
- **Respuesta (200 OK):**
  ```json
  {
    "nombre": "API de Autenticación y Login - SENA",
    "version": "1.0.0",
    "estado": "En línea",
    "endpoints": {
      "registro": "POST /api/register",
      "login": "POST /api/login"
    }
  }
  ```

---

### 2. Registro de Usuario
- **URL:** `POST http://localhost:3000/api/register`
- **Headers:** `Content-Type: application/json`
- **Cuerpo de la petición (JSON):**
  ```json
  {
    "usuario": "isaac_sena",
    "contrasena": "MiClaveSegura123"
  }
  ```
  *(Nota: también acepta `"username"` y `"password"`).*

- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "status": "success",
    "mensaje": "Usuario registrado exitosamente.",
    "datos": {
      "id": 1795120130585,
      "usuario": "isaac_sena",
      "fechaCreacion": "2026-11-19T20:28:50.585Z"
    }
  }
  ```

- **Respuesta de Error si el usuario ya existe (409 Conflict):**
  ```json
  {
    "status": "error",
    "mensaje": "El usuario 'isaac_sena' ya se encuentra registrado."
  }
  ```

---

### 3. Inicio de Sesión (Login)
- **URL:** `POST http://localhost:3000/api/login`
- **Headers:** `Content-Type: application/json`
- **Cuerpo de la petición (JSON):**
  ```json
  {
    "usuario": "isaac_sena",
    "contrasena": "MiClaveSegura123"
  }
  ```

- **Respuesta Exitosa - Autenticación Correcta (200 OK):**
  ```json
  {
    "status": "success",
    "mensaje": "autenticación satisfactoria",
    "usuario": "isaac_sena"
  }
  ```

- **Respuesta de Error - Credenciales Incorrectas o Usuario Inexistente (401 Unauthorized):**
  ```json
  {
    "status": "error",
    "mensaje": "error en la autenticación"
  }
  ```

---

## 🧪 Pruebas con cURL y PowerShell

### Registrar un usuario (PowerShell):
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/register" -Method Post -ContentType "application/json" -Body '{"usuario": "aprendiz1", "contrasena": "clave123"}'
```

### Iniciar sesión con éxito (PowerShell):
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/login" -Method Post -ContentType "application/json" -Body '{"usuario": "aprendiz1", "contrasena": "clave123"}'
```

### Iniciar sesión con clave incorrecta (PowerShell):
```powershell
try {
  Invoke-RestMethod -Uri "http://localhost:3000/api/login" -Method Post -ContentType "application/json" -Body '{"usuario": "aprendiz1", "contrasena": "claveErronea"}'
} catch {
  $_.Exception.Response.GetResponseStream() | ForEach-Object { (New-Object System.IO.StreamReader($_)).ReadToEnd() }
}
```

---

## 🛡️ Seguridad Implementada

- **Cifrado unidireccional con Salt:** Las contraseñas nunca se almacenan en texto plano; se utiliza `bcryptjs` con costo de cómputo 10.
- **Manejo de CORS:** Permite integración con clientes web y frontend (React, Angular, Vue, aplicaciones móviles o Postman).
- **Control de entrada:** Validación de campos obligatorios y longitud mínima de seguridad.
