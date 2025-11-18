# Guía de Inicio de Sesión - Sistema FIS

## 🔐 Autenticación

### Endpoint de Login

**POST** `/usuarios/login`

**Request Body:**
```json
{
  "correoElectronico": "admin@fis.edu.co",
  "contrasena": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "Bearer",
  "expiracion": "2025-11-19T10:30:00",
  "usuario": {
    "idUsuario": "a1111111-1111-1111-1111-111111111111",
    "nombre": "Admin",
    "apellido": "Sistema",
    "cedula": "1000000001",
    "correoElectronico": "admin@fis.edu.co",
    "fechaNacimiento": "1990-01-01",
    "rol": "ADMINISTRADOR"
  }
}
```

### Usuarios de Prueba

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| `admin@fis.edu.co` | `password123` | ADMINISTRADOR |
| `coordinador@fis.edu.co` | `password123` | COORDINADOR |
| `director@fis.edu.co` | `password123` | DIRECTOR |
| `profesor1@fis.edu.co` | `password123` | PROFESOR |
| `profesor2@fis.edu.co` | `password123` | PROFESOR |
| `acudiente1@gmail.com` | `password123` | ACUDIENTE |
| `acudiente2@gmail.com` | `password123` | ACUDIENTE |

## 🛠️ Pruebas con cURL

### Login exitoso
```bash
curl -X POST http://localhost:8080/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correoElectronico": "admin@fis.edu.co",
    "contrasena": "password123"
  }'
```

### Login con credenciales incorrectas
```bash
curl -X POST http://localhost:8080/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correoElectronico": "admin@fis.edu.co",
    "contrasena": "incorrecta"
  }'
```

**Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-11-18T10:30:00",
  "status": 401,
  "error": "Credenciales inválidas",
  "mensaje": "El correo electrónico o la contraseña son incorrectos",
  "path": "/usuarios/login"
}
```

### Login con usuario inexistente
```bash
curl -X POST http://localhost:8080/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correoElectronico": "noexiste@fis.edu.co",
    "contrasena": "password123"
  }'
```

**Response (404 Not Found):**
```json
{
  "timestamp": "2025-11-18T10:30:00",
  "status": 404,
  "error": "Usuario no encontrado",
  "mensaje": "No existe una cuenta asociada a este correo electrónico",
  "path": "/usuarios/login"
}
```

## 🔑 Uso del Token

Una vez obtenido el token, debe incluirse en el header `Authorization` de todas las peticiones protegidas:

```bash
curl -X GET http://localhost:8080/admin/usuarios/{id} \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

## 📝 Actualizar Datos Personales

**PUT** `/usuarios/{id}/datos-iniciales`

```bash
curl -X PUT http://localhost:8080/usuarios/{id}/datos-iniciales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "cedula": "1234567890",
    "fechaNacimiento": "1995-05-15"
  }'
```

## ⚠️ Validaciones

### Correo Electrónico
- No puede estar vacío
- Debe existir en el sistema

### Contraseña
- No puede estar vacía
- Debe coincidir con la almacenada (hash BCrypt)

### Cédula
- Entre 6 y 10 dígitos numéricos
- Única en el sistema

### Fecha de Nacimiento
- No puede ser futura
- Es obligatoria

## 🗄️ Inicialización de Base de Datos

Para cargar los datos de prueba, ejecuta el script SQL:

```bash
psql -U postgres -d sga_db -f backend/src/main/resources/data-init.sql
```

O configura en `application.yml`:

```yaml
spring:
  sql:
    init:
      mode: always
      data-locations: classpath:data-init.sql
```

## 🔄 Flujo de Autenticación

1. **Usuario envía credenciales** → POST `/usuarios/login`
2. **Sistema valida correo** → Busca en BD
3. **Sistema valida contraseña** → Compara hash BCrypt
4. **Sistema genera JWT** → Token válido por 24 horas
5. **Usuario recibe token** → Lo usa para peticiones autenticadas
6. **Filtro JWT valida** → En cada petición protegida

## 📊 Modelo de Dominio

Según el documento, el sistema implementa:

- **Herencia JOINED TABLE** para Usuario y sus subclases
- **Relación 1:1** entre Usuario y Token_Usuario
- **UUID** como identificadores únicos
- **Patrón Data Mapper** con repositorios externos
