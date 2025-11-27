# Diagrama de Secuencia - Funcionalidad de Inicio de Sesión (Login)

## Descripción General

Este documento describe paso a paso la creación de objetos en memoria durante el proceso de autenticación (login) en el Sistema de Gestión Académica (SGA), incluyendo todas las clases de Spring Security que participan en el proceso.

---

## Flujo Completo del Login

### 1. **Inicio del Proceso - Petición HTTP**

#### 1.1 Cliente (Frontend - Next.js)
```
Usuario ingresa credenciales → Click en "Iniciar Sesión"
```

**Objeto creado en Frontend:**
- `LoginRequest` (objeto JavaScript)
  ```javascript
  {
    correoElectronico: "coordinador@fis.edu.co",
    contrasena: "password123"
  }
  ```

#### 1.2 Envío de Petición
```
POST http://localhost:8080/api/usuarios/login
Content-Type: application/json
Body: { correoElectronico, contrasena }
```

---

### 2. **Recepción en el Servidor - Spring Boot**

#### 2.1 DispatcherServlet (Spring MVC)
**Clase de Spring:** `org.springframework.web.servlet.DispatcherServlet`

**Objetos creados:**
1. `HttpServletRequest` - Contiene toda la información de la petición HTTP
2. `HttpServletResponse` - Objeto para construir la respuesta

**Proceso:**
```
HttpServletRequest request = new HttpServletRequest();
request.setMethod("POST");
request.setRequestURI("/api/usuarios/login");
request.setBody(jsonBody);
```

#### 2.2 HandlerMapping (Spring MVC)
**Clase de Spring:** `org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping`

**Proceso:**
- Busca qué método del controlador debe manejar esta petición
- Encuentra: `UsuarioController.login(LoginDTO loginDTO)`

**Objeto creado:**
- `HandlerExecutionChain` - Encapsula el handler (método) y los interceptores

---

### 3. **Filtros de Spring Security**

Antes de llegar al controlador, la petición pasa por la cadena de filtros de Spring Security.

#### 3.1 FilterChainProxy
**Clase:** `org.springframework.security.web.FilterChainProxy`

**Proceso:**
- Coordina la ejecución de todos los filtros de seguridad
- Esta petición NO tiene token Bearer (es login inicial)

#### 3.2 CorsFilter
**Clase:** `org.springframework.web.filter.CorsFilter`

**Proceso:**
- Valida CORS (Cross-Origin Resource Sharing)
- Permite peticiones desde http://localhost:3000

#### 3.3 SecurityContextPersistenceFilter
**Clase:** `org.springframework.security.web.context.SecurityContextPersistenceFilter`

**Proceso:**
- Crea un `SecurityContext` vacío
- Lo almacena en el `SecurityContextHolder`

**Objetos creados:**
```java
SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
SecurityContextHolder.setContext(securityContext);
```

#### 3.4 AnonymousAuthenticationFilter
**Clase:** `org.springframework.security.web.authentication.AnonymousAuthenticationFilter`

**Proceso:**
- Como no hay token, crea una autenticación anónima temporal
- **Objeto creado:**
  ```java
  AnonymousAuthenticationToken anonymousAuth = 
    new AnonymousAuthenticationToken(
      "key", 
      "anonymousUser", 
      List.of(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))
    );
  ```

---

### 4. **Controller Layer - UsuarioController**

#### 4.1 Deserialización JSON → LoginDTO
**Clase de Spring:** `com.fasterxml.jackson.databind.ObjectMapper`

**Proceso:**
- El JSON del body se convierte automáticamente en objeto Java
- **Objeto creado:**
  ```java
  LoginDTO loginDTO = new LoginDTO();
  loginDTO.setCorreoElectronico("coordinador@fis.edu.co");
  loginDTO.setContrasena("password123");
  ```

**Clase:** `com.sga.dto.LoginDTO`
```java
public class LoginDTO {
    private String correoElectronico;
    private String contrasena;
    // getters y setters
}
```

#### 4.2 Invocación del Controller
**Clase:** `com.sga.controller.UsuarioController`

**Método ejecutado:**
```java
@PostMapping("/login")
public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO) {
    LoginResponseDTO response = usuarioService.autenticar(loginDTO);
    return ResponseEntity.ok(response);
}
```

**Objetos en memoria:**
- `UsuarioController` (inyectado por Spring como Singleton)
- `LoginDTO loginDTO` (parámetro del método)

---

### 5. **Service Layer - UsuarioServiceImpl**

#### 5.1 Llamada al Servicio
**Clase:** `com.sga.service.impl.UsuarioServiceImpl`

**Método ejecutado:**
```java
@Override
@Transactional
public LoginResponseDTO autenticar(LoginDTO loginDTO) {
    // Paso 1: Buscar usuario
    Usuario usuario = usuarioRepository.findByCorreoElectronico(
        loginDTO.getCorreoElectronico()
    ).orElseThrow(() -> new ResourceNotFoundException(
        "Usuario no encontrado con correo: " + loginDTO.getCorreoElectronico()
    ));
    
    // Paso 2: Verificar contraseña
    if (!passwordEncoder.matches(
        loginDTO.getContrasena(), 
        usuario.getTokenUsuario().getContrasena()
    )) {
        throw new BadCredentialsException("Contraseña incorrecta");
    }
    
    // Paso 3: Generar token JWT
    String token = jwtService.generarToken(usuario);
    
    // Paso 4: Crear respuesta
    return LoginResponseDTO.builder()
        .token(token)
        .usuario(convertirAUsuarioDTO(usuario))
        .build();
}
```

**Objetos inyectados (ya existen en memoria como Singletons):**
- `UsuarioRepository usuarioRepository`
- `PasswordEncoder passwordEncoder`
- `JwtService jwtService`

---

### 6. **Repository Layer - Consulta a Base de Datos**

#### 6.1 UsuarioRepository
**Clase:** `com.sga.repository.UsuarioRepository` (Interface)
**Implementación:** Spring Data JPA genera la implementación en runtime

**Método ejecutado:**
```java
Optional<Usuario> findByCorreoElectronico(String correoElectronico);
```

#### 6.2 EntityManager (JPA/Hibernate)
**Clases de Spring/Hibernate:**
- `org.springframework.orm.jpa.EntityManagerFactoryUtils`
- `org.hibernate.internal.SessionImpl`

**Proceso:**
1. **Obtiene conexión del pool:**
   ```java
   HikariDataSource dataSource; // Pool de conexiones
   Connection connection = dataSource.getConnection();
   ```

2. **Crea PreparedStatement:**
   ```java
   PreparedStatement ps = connection.prepareStatement(
     "SELECT u.*, t.* FROM usuario u " +
     "LEFT JOIN token_usuario t ON u.id_token = t.id_token " +
     "WHERE u.correo_electronico = ?"
   );
   ps.setString(1, "coordinador@fis.edu.co");
   ```

3. **Ejecuta query:**
   ```java
   ResultSet rs = ps.executeQuery();
   ```

4. **Mapea ResultSet → Entidades JPA:**

**Objetos creados en orden:**

##### a) Token_Usuario
```java
Token_Usuario token = new Token_Usuario();
token.setIdToken(UUID.fromString("c1111111-1111-1111-1111-111111111111"));
token.setContrasena("$2a$10$Z123..."); // Hash BCrypt
token.setRol("COORDINADOR");
```

##### b) Usuario
```java
Usuario usuario = new Usuario();
usuario.setIdUsuario(UUID.fromString("c1111111-1111-1111-1111-111111111111"));
usuario.setNombre("María");
usuario.setNombre2(null);
usuario.setApellido("González");
usuario.setApellido2(null);
usuario.setCedula("1000000002");
usuario.setCorreoElectronico("coordinador@fis.edu.co");
usuario.setFechaNacimiento(LocalDate.of(1985, 5, 15));
usuario.setTokenUsuario(token); // Relación
```

##### c) Coordinador (Herencia)
```java
Coordinador coordinador = new Coordinador();
coordinador.setIdUsuario(usuario.getIdUsuario());
coordinador.setIdCoordinador(UUID.randomUUID());
coordinador.setNombre(usuario.getNombre());
// ... copia todos los campos de Usuario (herencia)
```

**Nota:** Hibernate usa estrategia `JOINED` para la herencia, por lo que hace JOIN con la tabla `coordinador`.

---

### 7. **Validación de Contraseña - BCryptPasswordEncoder**

#### 7.1 PasswordEncoder
**Clase de Spring:** `org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder`

**Método ejecutado:**
```java
boolean matches = passwordEncoder.matches(
    "password123",                    // Contraseña en texto plano
    "$2a$10$Z1234567890..."          // Hash almacenado en BD
);
```

**Proceso interno:**
1. Toma el salt del hash almacenado
2. Aplica BCrypt a la contraseña ingresada con ese salt
3. Compara los hashes
4. Retorna `true` si coinciden

**Objetos creados internamente:**
- `BCrypt` - Clase interna que hace el hashing
- Arrays de bytes para comparación

---

### 8. **Generación de Token JWT - JwtService**

#### 8.1 Preparación de Claims
**Clase:** `com.sga.security.JwtService`

**Método ejecutado:**
```java
public String generarToken(Usuario usuario) {
    // Crear claims (datos que irán en el token)
    Map<String, Object> claims = new HashMap<>();
    claims.put("rol", usuario.getTokenUsuario().getRol());
    claims.put("nombre", usuario.getNombre() + " " + usuario.getApellido());
    claims.put("email", usuario.getCorreoElectronico());
    
    // Generar token
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(usuario.getCorreoElectronico())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

**Objetos creados:**

##### a) Claims
```java
Map<String, Object> claims = new HashMap<>();
claims = {
    "rol": "COORDINADOR",
    "nombre": "María González",
    "email": "coordinador@fis.edu.co"
}
```

##### b) JwtBuilder (de io.jsonwebtoken)
**Clase:** `io.jsonwebtoken.impl.DefaultJwtBuilder`

```java
JwtBuilder builder = Jwts.builder();
builder.setClaims(claims);
builder.setSubject("coordinador@fis.edu.co");
builder.setIssuedAt(new Date()); // Fecha actual
builder.setExpiration(new Date(System.currentTimeMillis() + 86400000)); // 24h
```

##### c) SigningKey
```java
Key signingKey = Keys.hmacShaKeyFor(
    secret.getBytes(StandardCharsets.UTF_8)
);
```
- `secret`: String de 256 bits configurado en `application.yml`

##### d) Token JWT (String)
```java
String token = builder.compact();
// Resultado: "eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJDT09S..."
```

**Estructura del token JWT:**
```
Header.Payload.Signature

Header (Base64):
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (Base64):
{
  "rol": "COORDINADOR",
  "nombre": "María González",
  "email": "coordinador@fis.edu.co",
  "sub": "coordinador@fis.edu.co",
  "iat": 1732735200,
  "exp": 1732821600
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

---

### 9. **Conversión Usuario → UsuarioDTO**

#### 9.1 Método de Conversión
**Clase:** `com.sga.service.impl.UsuarioServiceImpl`

```java
private UsuarioDTO convertirAUsuarioDTO(Usuario usuario) {
    return UsuarioDTO.builder()
        .idUsuario(usuario.getIdUsuario())
        .nombre(usuario.getNombre())
        .nombre2(usuario.getNombre2())
        .apellido(usuario.getApellido())
        .apellido2(usuario.getApellido2())
        .cedula(usuario.getCedula())
        .correoElectronico(usuario.getCorreoElectronico())
        .fechaNacimiento(usuario.getFechaNacimiento())
        .rol(usuario.getTokenUsuario().getRol())
        .build();
}
```

**Objeto creado:**
```java
UsuarioDTO usuarioDTO = UsuarioDTO.builder()
    .idUsuario(UUID.fromString("c1111111-1111-1111-1111-111111111111"))
    .nombre("María")
    .nombre2(null)
    .apellido("González")
    .apellido2(null)
    .cedula("1000000002")
    .correoElectronico("coordinador@fis.edu.co")
    .fechaNacimiento(LocalDate.of(1985, 5, 15))
    .rol("COORDINADOR")
    .build();
```

---

### 10. **Construcción de la Respuesta - LoginResponseDTO**

#### 10.1 Creación del DTO de Respuesta
**Clase:** `com.sga.dto.LoginResponseDTO`

```java
LoginResponseDTO response = LoginResponseDTO.builder()
    .token("eyJhbGciOiJIUzI1NiJ9...")
    .usuario(usuarioDTO)
    .build();
```

**Objeto final:**
```java
LoginResponseDTO {
    token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJDT09SRElOQURPUiIsIm5vbWJ...",
    usuario: {
        idUsuario: "c1111111-1111-1111-1111-111111111111",
        nombre: "María",
        nombre2: null,
        apellido: "González",
        apellido2: null,
        cedula: "1000000002",
        correoElectronico: "coordinador@fis.edu.co",
        fechaNacimiento: "1985-05-15",
        rol: "COORDINADOR"
    }
}
```

---

### 11. **Serialización de la Respuesta - JSON**

#### 11.1 ResponseEntity
**Clase de Spring:** `org.springframework.http.ResponseEntity`

```java
ResponseEntity<LoginResponseDTO> responseEntity = 
    ResponseEntity.ok(response);
```

**Objeto creado:**
```java
ResponseEntity {
    status: 200 (HttpStatus.OK),
    headers: {
        "Content-Type": "application/json"
    },
    body: response
}
```

#### 11.2 Conversión a JSON
**Clase de Spring:** `com.fasterxml.jackson.databind.ObjectMapper`

**Proceso:**
```java
ObjectMapper objectMapper = new ObjectMapper();
String json = objectMapper.writeValueAsString(response);
```

**JSON resultante:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJDT09SRElOQURPUiIsIm5vbWJ...",
  "usuario": {
    "idUsuario": "c1111111-1111-1111-1111-111111111111",
    "nombre": "María",
    "nombre2": null,
    "apellido": "González",
    "apellido2": null,
    "cedula": "1000000002",
    "correoElectronico": "coordinador@fis.edu.co",
    "fechaNacimiento": "1985-05-15",
    "rol": "COORDINADOR"
  }
}
```

---

### 12. **Respuesta HTTP al Cliente**

#### 12.1 HttpServletResponse
**Clase de Spring:** `javax.servlet.http.HttpServletResponse`

```java
HttpServletResponse response = ...;
response.setStatus(200);
response.setHeader("Content-Type", "application/json");
response.getWriter().write(json);
```

#### 12.2 Envío al Cliente
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 456

{
  "token": "eyJhbGci...",
  "usuario": { ... }
}
```

---

### 13. **Procesamiento en el Frontend**

#### 13.1 Recepción de la Respuesta
**Código Frontend:**
```typescript
const response = await fetch('http://localhost:8080/api/usuarios/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ correoElectronico, contrasena })
});

const data: LoginResponseDTO = await response.json();
```

**Objetos creados en Frontend:**
```javascript
const loginResponse = {
  token: "eyJhbGci...",
  usuario: {
    idUsuario: "c1111111-1111-1111-1111-111111111111",
    nombre: "María",
    apellido: "González",
    rol: "COORDINADOR",
    // ...
  }
}
```

#### 13.2 Almacenamiento
```typescript
// Guardar en localStorage
localStorage.setItem('auth_token', data.token);
localStorage.setItem('user_data', JSON.stringify(data.usuario));

// Actualizar contexto de autenticación
setUser(data.usuario);
setToken(data.token);
setIsAuthenticated(true);
```

#### 13.3 Redirección
```typescript
// Redirigir según el rol
if (data.usuario.rol === 'COORDINADOR') {
  router.push('/coordinador');
} else if (data.usuario.rol === 'ADMINISTRADOR') {
  router.push('/administrador');
}
// etc...
```

---

## Resumen de Objetos Creados (En Orden)

### Frontend:
1. `LoginRequest` (JavaScript Object)
2. `fetch` Request
3. `Response` Object
4. `LoginResponseDTO` (parsed JSON)

### Backend - Capa Web:
5. `HttpServletRequest`
6. `HttpServletResponse`
7. `HandlerExecutionChain`
8. `SecurityContext`
9. `AnonymousAuthenticationToken`
10. `LoginDTO`

### Backend - Capa de Servicio:
11. `Connection` (HikariCP)
12. `PreparedStatement`
13. `ResultSet`
14. `Token_Usuario` (Entity)
15. `Usuario` (Entity)
16. `Coordinador` (Entity - Herencia)
17. `Map<String, Object>` (JWT Claims)
18. `JwtBuilder`
19. `Key` (Signing Key)
20. `String` (Token JWT)
21. `UsuarioDTO`
22. `LoginResponseDTO`

### Backend - Capa de Respuesta:
23. `ResponseEntity<LoginResponseDTO>`
24. `ObjectMapper`
25. JSON String

---

## Clases de Spring Involucradas

### Spring MVC:
- `DispatcherServlet`
- `RequestMappingHandlerMapping`
- `HandlerExecutionChain`
- `RequestMappingHandlerAdapter`
- `HttpMessageConverter` (JSON)

### Spring Security:
- `FilterChainProxy`
- `SecurityContextPersistenceFilter`
- `CorsFilter`
- `AnonymousAuthenticationFilter`
- `SecurityContext`
- `SecurityContextHolder`
- `BCryptPasswordEncoder`

### Spring Data JPA:
- `JpaRepository` (proxy generado)
- `SimpleJpaRepository` (implementación)
- `EntityManager`
- `EntityManagerFactory`

### Hibernate (JPA Provider):
- `SessionImpl`
- `StatementPreparator`
- `ResultSetProcessor`
- `EntityLoader`

### Jackson (JSON):
- `ObjectMapper`
- `JsonGenerator`
- `JsonParser`

### HikariCP (Connection Pool):
- `HikariDataSource`
- `HikariPool`
- `PoolEntry`

### JWT (io.jsonwebtoken):
- `Jwts`
- `JwtBuilder`
- `DefaultJwtBuilder`
- `JwtParser`

---

## Diagrama de Secuencia - Actores Principales

Para tu diagrama de secuencia, considera estos actores:

1. **Usuario** (Actor humano)
2. **Frontend (Browser/Next.js)**
3. **DispatcherServlet**
4. **FilterChainProxy** (Spring Security)
5. **UsuarioController**
6. **UsuarioServiceImpl**
7. **UsuarioRepository**
8. **EntityManager (Hibernate)**
9. **Database (PostgreSQL)**
10. **PasswordEncoder**
11. **JwtService**

---

## Notas Importantes para el Diagrama

### Transacciones:
- La anotación `@Transactional` en `UsuarioServiceImpl.autenticar()` crea un proxy que:
  1. Inicia una transacción antes de ejecutar el método
  2. Hace commit si todo es exitoso
  3. Hace rollback si hay excepción

**Clases involucradas:**
- `TransactionInterceptor`
- `PlatformTransactionManager`
- `JpaTransactionManager`

### Inyección de Dependencias:
- Todos los servicios (`UsuarioService`, `JwtService`, `PasswordEncoder`) son **Singletons**
- Spring los crea al inicio de la aplicación
- Se inyectan mediante constructor (Lombok `@RequiredArgsConstructor`)

### Manejo de Excepciones:
- `ResourceNotFoundException` → 404 Not Found
- `BadCredentialsException` → 401 Unauthorized
- Son capturadas por `@ControllerAdvice` (GlobalExceptionHandler)

---

## Flujo Simplificado para Diagrama

```
Usuario → Frontend → HTTP Request → DispatcherServlet
    ↓
FilterChainProxy (Security Filters)
    ↓
UsuarioController.login(LoginDTO)
    ↓
UsuarioServiceImpl.autenticar(LoginDTO)
    ↓
UsuarioRepository.findByCorreoElectronico()
    ↓
EntityManager → Database Query → ResultSet
    ↓
Hibernate mapea → Usuario entity
    ↓
PasswordEncoder.matches() → validación
    ↓
JwtService.generarToken() → Token JWT
    ↓
LoginResponseDTO (token + usuario)
    ↓
ObjectMapper → JSON
    ↓
HttpServletResponse → Frontend
    ↓
localStorage + Redirección
```

---

Este documento debe darte toda la información necesaria para crear un diagrama de secuencia completo y preciso del proceso de login, incluyendo todas las clases internas de Spring que participan.
