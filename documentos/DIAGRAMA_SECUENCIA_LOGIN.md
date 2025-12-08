# Diagrama de Secuencia - Inicio de Sesión (Login)

## Descripción General

Este documento describe el flujo de autenticación en el Sistema de Gestión Académica (SGA) de forma simplificada, enfocándose en las clases desarrolladas y los componentes principales de Spring Framework necesarios para modelar el diagrama de secuencia.

---

## Actores del Sistema

### 1. **Usuario** (Actor Humano)
Persona que interactúa con el sistema ingresando credenciales.

### 2. **Frontend (Next.js)**
Aplicación React que captura las credenciales y las envía al backend.

### 3. **DispatcherServlet** (Spring MVC)
Componente de Spring que recibe todas las peticiones HTTP y las dirige al controlador correcto.

### 4. **SecurityFilterChain** (Spring Security)
Cadena de filtros de seguridad que valida CORS y autenticación antes de llegar al controlador.

### 5. **UsuarioController** (Desarrollado)
Controlador REST que expone el endpoint `/api/usuarios/login`.

### 6. **UsuarioServiceImpl** (Desarrollado)
Servicio que implementa la lógica de negocio de autenticación.

### 7. **UsuarioRepository** (Spring Data JPA)
Interfaz que permite consultar usuarios en la base de datos.

### 8. **Hibernate/JPA**
ORM que traduce las consultas a SQL y mapea resultados a entidades Java.

### 9. **Database (PostgreSQL)**
Base de datos que almacena usuarios y sus credenciales.

### 10. **BCryptPasswordEncoder** (Spring Security)
Componente que verifica contraseñas hasheadas.

### 11. **JwtService** (Desarrollado)
Servicio personalizado que genera tokens JWT.

---

## Flujo del Diagrama de Secuencia

### **Paso 1: Usuario ingresa credenciales**
```
Usuario → Frontend: Ingresa correo y contraseña
Usuario → Frontend: Click en "Iniciar Sesión"
```

**Datos:**
```javascript
{
  correoElectronico: "coordinador@fis.edu.co",
  contrasena: "password123"
}
```

---

### **Paso 2: Frontend envía petición HTTP**
```
Frontend → DispatcherServlet: POST /api/usuarios/login
                              Body: { correoElectronico, contrasena }
```

**Objeto creado:**
- `LoginDTO` (deserializado automáticamente por Jackson)

---

### **Paso 3: DispatcherServlet procesa la petición**
```
DispatcherServlet → SecurityFilterChain: Valida CORS y autenticación
SecurityFilterChain → DispatcherServlet: Permite petición (login es público)
DispatcherServlet → UsuarioController: Invoca login(LoginDTO)
```

**Nota:** El endpoint `/api/usuarios/login` está configurado como público en `SecurityConfig`.

---

### **Paso 4: UsuarioController delega al servicio**
```
UsuarioController → UsuarioServiceImpl: autenticar(loginDTO)
```

**Clase:** `com.sga.controller.UsuarioController`
```java
@PostMapping("/login")
public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO) {
    LoginResponseDTO response = usuarioService.autenticar(loginDTO);
    return ResponseEntity.ok(response);
}
```

---

### **Paso 5: UsuarioServiceImpl busca el usuario**
```
UsuarioServiceImpl → UsuarioRepository: findByCorreoElectronico(correo)
UsuarioRepository → Hibernate/JPA: Genera SQL query
Hibernate/JPA → Database: SELECT * FROM usuario WHERE correo_electronico = ?
Database → Hibernate/JPA: ResultSet con datos del usuario
Hibernate/JPA → UsuarioRepository: Mapea a entidad Usuario
UsuarioRepository → UsuarioServiceImpl: Optional<Usuario>
```

**Entidades creadas:**
- `Token_Usuario` (con contraseña hasheada y rol)
- `Usuario` (con datos personales)
- `Coordinador` (herencia de Usuario)

**Query SQL generado:**
```sql
SELECT u.*, t.* 
FROM usuario u 
LEFT JOIN token_usuario t ON u.id_token = t.id_token 
WHERE u.correo_electronico = 'coordinador@fis.edu.co'
```

---

### **Paso 6: UsuarioServiceImpl valida contraseña**
```
UsuarioServiceImpl → BCryptPasswordEncoder: matches(contrasenaIngresada, hashAlmacenado)
BCryptPasswordEncoder → UsuarioServiceImpl: true (contraseña correcta)
```

**Proceso interno:**
- Extrae el salt del hash almacenado
- Hashea la contraseña ingresada con el mismo salt
- Compara los dos hashes
- Retorna `true` si coinciden

**Ejemplo:**
```java
passwordEncoder.matches("password123", "$2a$10$Z1234567890...")
// Retorna: true
```

---

### **Paso 7: UsuarioServiceImpl genera token JWT**
```
UsuarioServiceImpl → JwtService: generarToken(usuario)
JwtService → JwtService: Crea claims (rol, nombre, email)
JwtService → JwtService: Firma token con secret key
JwtService → UsuarioServiceImpl: String token
```

**Clase:** `com.sga.security.JwtService`
```java
public String generarToken(Usuario usuario) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("rol", usuario.getTokenUsuario().getRol());
    claims.put("nombre", usuario.getNombre() + " " + usuario.getApellido());
    claims.put("email", usuario.getCorreoElectronico());
    
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(usuario.getCorreoElectronico())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

**Token generado:**
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJDT09SRElOQURPUiIsIm5vbWJyZSI6Ik1hcsOtYSBHb27gem1sZXoiLCJlbWFpbCI6ImNvb3JkaW5hZG9yQGZpcy5lZHUuY28iLCJzdWIiOiJjb29yZGluYWRvckBmaXMuZWR1LmNvIiwiaWF0IjoxNzMyNzM1MjAwLCJleHAiOjE3MzI4MjE2MDB9.signature
```

---

### **Paso 8: UsuarioServiceImpl construye la respuesta**
```
UsuarioServiceImpl → UsuarioServiceImpl: convertirAUsuarioDTO(usuario)
UsuarioServiceImpl → UsuarioServiceImpl: Crea LoginResponseDTO
UsuarioServiceImpl → UsuarioController: LoginResponseDTO
```

**DTO creado:**
```java
LoginResponseDTO {
    token: "eyJhbGci...",
    usuario: {
        idUsuario: "c1111111-1111-1111-1111-111111111111",
        nombre: "María",
        apellido: "González",
        cedula: "1000000002",
        correoElectronico: "coordinador@fis.edu.co",
        fechaNacimiento: "1985-05-15",
        rol: "COORDINADOR"
    }
}
```

---

### **Paso 9: UsuarioController retorna respuesta HTTP**
```
UsuarioController → DispatcherServlet: ResponseEntity.ok(response)
DispatcherServlet → Jackson (ObjectMapper): Serializa a JSON
Jackson → DispatcherServlet: JSON String
DispatcherServlet → Frontend: HTTP 200 OK + JSON
```

**JSON enviado:**
```json
{
  "token": "eyJhbGci...",
  "usuario": {
    "idUsuario": "c1111111-1111-1111-1111-111111111111",
    "nombre": "María",
    "apellido": "González",
    "cedula": "1000000002",
    "correoElectronico": "coordinador@fis.edu.co",
    "fechaNacimiento": "1985-05-15",
    "rol": "COORDINADOR"
  }
}
```

---

### **Paso 10: Frontend procesa y almacena**
```
Frontend → Frontend: Parsea JSON response
Frontend → localStorage: Guarda token y datos de usuario
Frontend → Frontend: Actualiza estado de autenticación
Frontend → Frontend: Redirige según rol
```

**Almacenamiento:**
```javascript
localStorage.setItem('auth_token', response.token);
localStorage.setItem('user_data', JSON.stringify(response.usuario));
```

**Redirección:**
```javascript
if (usuario.rol === 'COORDINADOR') {
  router.push('/coordinador');
}
```

---

## Diagrama Simplificado (Texto UML)

```
Usuario -> Frontend: Ingresa credenciales
Frontend -> DispatcherServlet: POST /api/usuarios/login (LoginDTO)
DispatcherServlet -> SecurityFilterChain: Valida petición
SecurityFilterChain -> DispatcherServlet: Permite (público)
DispatcherServlet -> UsuarioController: login(LoginDTO)
UsuarioController -> UsuarioServiceImpl: autenticar(LoginDTO)
UsuarioServiceImpl -> UsuarioRepository: findByCorreoElectronico(correo)
UsuarioRepository -> Hibernate: Genera query
Hibernate -> Database: SELECT usuario WHERE correo = ?
Database -> Hibernate: ResultSet
Hibernate -> UsuarioRepository: Usuario entity
UsuarioRepository -> UsuarioServiceImpl: Optional<Usuario>
UsuarioServiceImpl -> BCryptPasswordEncoder: matches(password, hash)
BCryptPasswordEncoder -> UsuarioServiceImpl: true
UsuarioServiceImpl -> JwtService: generarToken(usuario)
JwtService -> UsuarioServiceImpl: String token
UsuarioServiceImpl -> UsuarioController: LoginResponseDTO
UsuarioController -> DispatcherServlet: ResponseEntity<LoginResponseDTO>
DispatcherServlet -> Jackson: Serializa a JSON
Jackson -> DispatcherServlet: JSON String
DispatcherServlet -> Frontend: HTTP 200 OK + JSON
Frontend -> localStorage: Guarda token y usuario
Frontend -> Usuario: Redirige a dashboard
```

---

## Clases Desarrolladas (Nuestro Código)

### **Capa Controller**
1. **UsuarioController**
   - Ruta: `src/main/java/com/sga/controller/UsuarioController.java`
   - Método: `login(LoginDTO)` → `ResponseEntity<LoginResponseDTO>`

### **Capa Service**
2. **UsuarioServiceImpl**
   - Ruta: `src/main/java/com/sga/service/impl/UsuarioServiceImpl.java`
   - Método: `autenticar(LoginDTO)` → `LoginResponseDTO`
   - Método: `convertirAUsuarioDTO(Usuario)` → `UsuarioDTO`

3. **JwtService**
   - Ruta: `src/main/java/com/sga/security/JwtService.java`
   - Método: `generarToken(Usuario)` → `String`

### **Capa Repository**
4. **UsuarioRepository**
   - Ruta: `src/main/java/com/sga/repository/UsuarioRepository.java`
   - Método: `findByCorreoElectronico(String)` → `Optional<Usuario>`

### **Capa Entity**
5. **Usuario**
   - Ruta: `src/main/java/com/sga/entity/Usuario.java`
   - Campos: id, nombre, apellido, cedula, correo, fechaNacimiento, token

6. **Token_Usuario**
   - Ruta: `src/main/java/com/sga/entity/Token_Usuario.java`
   - Campos: id, contrasena (hash), rol

7. **Coordinador** (hereda de Usuario)
   - Ruta: `src/main/java/com/sga/entity/Coordinador.java`

### **DTOs**
8. **LoginDTO**
   - Ruta: `src/main/java/com/sga/dto/LoginDTO.java`
   - Campos: correoElectronico, contrasena

9. **LoginResponseDTO**
   - Ruta: `src/main/java/com/sga/dto/LoginResponseDTO.java`
   - Campos: token, usuario (UsuarioDTO)

10. **UsuarioDTO**
    - Ruta: `src/main/java/com/sga/dto/UsuarioDTO.java`
    - Campos: idUsuario, nombre, apellido, cedula, correo, fechaNacimiento, rol

### **Configuración**
11. **SecurityConfig**
    - Ruta: `src/main/java/com/sga/security/SecurityConfig.java`
    - Configura endpoints públicos y protegidos

---

## Componentes de Spring Framework

### **Spring MVC**
- **DispatcherServlet**: Punto de entrada de todas las peticiones HTTP
- **Jackson ObjectMapper**: Serializa/deserializa JSON automáticamente

### **Spring Security**
- **SecurityFilterChain**: Cadena de filtros de seguridad (CORS, autenticación, autorización)
- **BCryptPasswordEncoder**: Encoder para verificar contraseñas hasheadas

### **Spring Data JPA**
- **JpaRepository**: Interfaz base que genera implementaciones de repositorios
- **Hibernate**: ORM que traduce operaciones Java a SQL

### **Spring Boot**
- **@Transactional**: Maneja transacciones de base de datos automáticamente
- **Dependency Injection**: Inyecta automáticamente UsuarioRepository, BCryptPasswordEncoder, JwtService

---

## Notas para el Diagrama

### **Puntos Clave:**
1. **LoginDTO** es deserializado automáticamente por Jackson (no necesitas mostrarlo explícitamente)
2. **@Transactional** maneja la transacción de BD (puedes omitir o incluir como nota)
3. **Spring Data JPA** genera la implementación de `UsuarioRepository` en runtime
4. **Hibernate** traduce `findByCorreoElectronico()` a SQL automáticamente
5. **BCryptPasswordEncoder** es un bean de Spring Security configurado en SecurityConfig

### **Simplificaciones Recomendadas:**
- Agrupa **SecurityFilterChain** en un solo actor (no separar cada filtro)
- Agrupa **Hibernate/JPA** como un solo componente
- Omite **ObjectMapper** si quieres simplificar más (asume serialización automática)
- Puedes omitir **DispatcherServlet** y empezar directamente en **UsuarioController** si el diagrama es muy complejo

### **Alternativa Ultra-Simplificada:**
```
Usuario → Frontend → UsuarioController → UsuarioServiceImpl
UsuarioServiceImpl → UsuarioRepository → Database
UsuarioServiceImpl → BCryptPasswordEncoder (valida contraseña)
UsuarioServiceImpl → JwtService (genera token)
UsuarioServiceImpl → UsuarioController → Frontend → Usuario
```

---

## Resumen Ejecutivo

**Flujo en 5 pasos:**
1. **Frontend** envía credenciales al **UsuarioController**
2. **UsuarioServiceImpl** busca usuario en **Database** via **UsuarioRepository**
3. **UsuarioServiceImpl** valida contraseña con **BCryptPasswordEncoder**
4. **UsuarioServiceImpl** genera token JWT con **JwtService**
5. **Frontend** recibe token y redirige al dashboard

**Componentes principales a diagramar:**
- Usuario (actor)
- Frontend (Next.js)
- UsuarioController
- UsuarioServiceImpl
- UsuarioRepository
- Database (PostgreSQL)
- BCryptPasswordEncoder
- JwtService

---

Este documento simplificado te permite crear un diagrama de secuencia claro y fácil de entender, enfocándose en la lógica del negocio sin perderse en detalles de bajo nivel del framework.
