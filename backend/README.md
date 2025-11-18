# SGA Backend - Sistema de Gestión Académica

Backend desarrollado con Spring Boot 3.2.0 y Java 17 para el Sistema de Gestión Académica.

## Tecnologías

- **Spring Boot 3.2.0**
- **Java 17**
- **Spring Security** con JWT
- **Spring Data JPA**
- **PostgreSQL**
- **Maven**
- **Lombok**

## Estructura del Proyecto

```
backend/
├── src/
│   └── main/
│       ├── java/com/sga/
│       │   ├── config/          # Configuraciones de seguridad
│       │   ├── controller/      # Controladores REST
│       │   ├── dto/             # Data Transfer Objects
│       │   ├── model/           # Entidades JPA
│       │   ├── repository/      # Repositorios
│       │   ├── security/        # JWT y filtros de seguridad
│       │   └── service/         # Servicios de negocio
│       └── resources/
│           └── application.properties
└── pom.xml
```

## Roles de Usuario

- **ADMINISTRADOR**: Gestión completa del sistema
- **COORDINADOR**: Gestión de grupos y coordinación académica
- **DIRECTIVO**: Visualización y supervisión
- **PROFESOR**: Gestión de clases y evaluaciones
- **ACUDIENTE**: Acceso a información de estudiantes

## Configuración

1. **Base de datos PostgreSQL**: Crear una base de datos llamada `sga_db`

2. **Configurar credenciales** en `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/sga_db
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_contraseña
   ```

3. **Cambiar la clave secreta JWT** en producción:
   ```properties
   jwt.secret=tu-clave-secreta-segura
   ```

## Ejecución

```bash
# Compilar el proyecto
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

La API estará disponible en: `http://localhost:8080/api`

## Endpoints

### Autenticación

- **POST** `/api/auth/register` - Registrar nuevo usuario
- **POST** `/api/auth/login` - Iniciar sesión

### Usuarios

- **GET** `/api/users/me` - Obtener usuario actual
- **GET** `/api/users/admin` - Endpoint de administrador
- **GET** `/api/users/coordinador` - Endpoint de coordinador
- **GET** `/api/users/directivo` - Endpoint de directivo
- **GET** `/api/users/profesor` - Endpoint de profesor
- **GET** `/api/users/acudiente` - Endpoint de acudiente

## Autenticación JWT

Todas las peticiones (excepto `/auth/**`) requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

## Desarrollo

Para desarrollo, las tablas se crean automáticamente con `spring.jpa.hibernate.ddl-auto=update`.

Para producción, se recomienda usar migraciones con Flyway o Liquibase.
