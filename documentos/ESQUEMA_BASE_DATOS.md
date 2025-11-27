# Esquema de Base de Datos - Sistema de Gestión Académica (SGA)

## Descripción General
Base de datos PostgreSQL para el sistema de gestión académica del Colegio FIS.

---

## Tablas del Sistema

### 1. **token_usuario**
Almacena las credenciales de autenticación de los usuarios.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_token | UUID | PRIMARY KEY | Identificador único del token |
| contrasena | VARCHAR(255) | NOT NULL | Hash BCrypt de la contraseña |
| rol | VARCHAR(255) | NOT NULL | Rol del usuario (ADMINISTRADOR, COORDINADOR, DIRECTOR, PROFESOR, ACUDIENTE) |

---

### 2. **usuario**
Tabla base para todos los usuarios del sistema (herencia).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_usuario | UUID | PRIMARY KEY | Identificador único del usuario |
| nombre | VARCHAR(255) | NOT NULL | Nombre del usuario |
| apellido | VARCHAR(255) | NOT NULL | Apellido del usuario |
| cedula | VARCHAR(10) | NOT NULL, UNIQUE | Número de cédula |
| correo_electronico | VARCHAR(255) | NOT NULL, UNIQUE | Correo electrónico |
| fecha_nacimiento | DATE | NOT NULL | Fecha de nacimiento |
| id_token | UUID | UNIQUE, FK → token_usuario | Referencia al token de autenticación |

**Relaciones:**
- `id_token` → `token_usuario.id_token` (ONE-TO-ONE)

---

### 3. **administrador**
Usuarios con rol de administrador del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_usuario | UUID | PRIMARY KEY, FK → usuario | Identificador del usuario |
| id_administrador | UUID | UNIQUE | Identificador único del administrador |

**Relaciones:**
- `id_usuario` → `usuario.id_usuario` (ONE-TO-ONE, herencia)

---

### 4. **coordinador**
Usuarios con rol de coordinador académico.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_usuario | UUID | PRIMARY KEY, FK → usuario | Identificador del usuario |
| id_coordinador | UUID | UNIQUE | Identificador único del coordinador |

**Relaciones:**
- `id_usuario` → `usuario.id_usuario` (ONE-TO-ONE, herencia)

---

### 5. **director**
Usuarios con rol de director (directivo).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_usuario | UUID | PRIMARY KEY, FK → usuario | Identificador del usuario |
| id_director | UUID | UNIQUE | Identificador único del director |

**Relaciones:**
- `id_usuario` → `usuario.id_usuario` (ONE-TO-ONE, herencia)

---

### 6. **profesor**
Usuarios con rol de profesor.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_usuario | UUID | PRIMARY KEY, FK → usuario | Identificador del usuario |
| id_profesor | UUID | UNIQUE | Identificador único del profesor |
| grupo_asignado | VARCHAR(255) | NULLABLE | Grupo asignado al profesor |

**Relaciones:**
- `id_usuario` → `usuario.id_usuario` (ONE-TO-ONE, herencia)

---

### 7. **acudiente**
Usuarios con rol de acudiente (padres/tutores).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_usuario | UUID | PRIMARY KEY, FK → usuario | Identificador del usuario |
| id_acudiente | UUID | UNIQUE | Identificador único del acudiente |
| estado | BOOLEAN | NOT NULL | Estado activo/inactivo del acudiente |

**Relaciones:**
- `id_usuario` → `usuario.id_usuario` (ONE-TO-ONE, herencia)

---

### 8. **hoja_de_vida_estudiante**
Información médica y académica del estudiante.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_hoja_de_vida | UUID | PRIMARY KEY | Identificador único de la hoja de vida |
| detalles_medicos | TEXT | NULLABLE | Información médica relevante |
| observaciones_aprendizaje | TEXT | NULLABLE | Observaciones sobre el proceso de aprendizaje |

---

### 9. **grado**
Niveles educativos del colegio (Pre-jardín, Jardín, Transición, 1°-5°).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_grado | UUID | PRIMARY KEY | Identificador único del grado |
| nombre_grado | VARCHAR(255) | NOT NULL | Nombre del grado (ej: "Primero", "Segundo") |

---

### 10. **grupo**
Grupos o cursos dentro de cada grado.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_grupo | UUID | PRIMARY KEY | Identificador único del grupo |
| nombre_grupo | VARCHAR(255) | NOT NULL | Nombre del grupo (ej: "1A", "2B") |
| id_grado | UUID | NOT NULL, FK → grado | Grado al que pertenece el grupo |
| id_director_grupo | UUID | NULLABLE, FK → profesor | Profesor director del grupo |

**Relaciones:**
- `id_grado` → `grado.id_grado` (MANY-TO-ONE)
- `id_director_grupo` → `profesor.id_usuario` (MANY-TO-ONE)

---

### 11. **estudiante**
Estudiantes matriculados en el colegio.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_estudiante | UUID | PRIMARY KEY | Identificador único del estudiante |
| nombre | VARCHAR(255) | NOT NULL | Nombre del estudiante |
| apellido | VARCHAR(255) | NOT NULL | Apellido del estudiante |
| numero_documento | VARCHAR(255) | NOT NULL, UNIQUE | Número de documento de identidad |
| estado | BOOLEAN | NOT NULL | Estado activo/inactivo |
| id_acudiente | UUID | NULLABLE, FK → acudiente | Acudiente responsable |
| id_grupo | UUID | NULLABLE, FK → grupo | Grupo al que pertenece |
| id_hoja_de_vida | UUID | UNIQUE, FK → hoja_de_vida_estudiante | Hoja de vida del estudiante |

**Relaciones:**
- `id_acudiente` → `acudiente.id_usuario` (MANY-TO-ONE)
- `id_grupo` → `grupo.id_grupo` (MANY-TO-ONE)
- `id_hoja_de_vida` → `hoja_de_vida_estudiante.id_hoja_de_vida` (ONE-TO-ONE)

---

### 12. **periodo_academico**
Períodos de evaluación (4 períodos por año).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_periodo_academico | UUID | PRIMARY KEY | Identificador único del período |
| fecha_inicio | DATE | NOT NULL | Fecha de inicio del período |
| fecha_fin | DATE | NOT NULL | Fecha de fin del período |

---

### 13. **categoria_logro**
Categorías de evaluación por grado (EMOCIONAL, COMUNICATIVA, CORPORAL, COGNITIVA, ESPIRITUAL, ETICA).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_categoria | UUID | PRIMARY KEY | Identificador único de la categoría |
| nombre | VARCHAR(255) | NOT NULL | Nombre de la categoría |
| id_grado | UUID | NULLABLE, FK → grado | Grado al que pertenece la categoría |

**Relaciones:**
- `id_grado` → `grado.id_grado` (MANY-TO-ONE)

---

### 14. **logro**
Logros específicos dentro de cada categoría.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_logro | UUID | PRIMARY KEY | Identificador único del logro |
| descripcion | TEXT | NOT NULL | Descripción del logro |
| id_categoria | UUID | NOT NULL, FK → categoria_logro | Categoría a la que pertenece |

**Relaciones:**
- `id_categoria` → `categoria_logro.id_categoria` (MANY-TO-ONE)

---

### 15. **boletin**
Boletín de calificaciones de un estudiante en un período.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_boletin | UUID | PRIMARY KEY | Identificador único del boletín |
| id_estudiante | UUID | NOT NULL, FK → estudiante | Estudiante al que pertenece |
| id_periodo | UUID | NOT NULL, FK → periodo_academico | Período académico |

**Relaciones:**
- `id_estudiante` → `estudiante.id_estudiante` (MANY-TO-ONE)
- `id_periodo` → `periodo_academico.id_periodo_academico` (MANY-TO-ONE)

---

### 16. **evaluacion_categoria_logro**
Evaluación de una categoría de logro en un boletín.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id_evaluacion | UUID | PRIMARY KEY | Identificador único de la evaluación |
| id_boletin | UUID | NULLABLE, FK → boletin | Boletín al que pertenece |
| id_categoria | UUID | NOT NULL, FK → categoria_logro | Categoría evaluada |
| id_periodo | UUID | NOT NULL, FK → periodo_academico | Período académico |
| calificacion_logro | VARCHAR(255) | NOT NULL | Calificación (Superior, Alto, Básico, Bajo) |
| fecha_evaluacion | DATE | NOT NULL | Fecha de la evaluación |

**Relaciones:**
- `id_boletin` → `boletin.id_boletin` (MANY-TO-ONE)
- `id_categoria` → `categoria_logro.id_categoria` (MANY-TO-ONE)
- `id_periodo` → `periodo_academico.id_periodo_academico` (MANY-TO-ONE)

---

## Diagrama de Relaciones

```
token_usuario (1) ←── (1) usuario (1) ──→ (1) [administrador | coordinador | director | profesor | acudiente]
                                                                     │
                                                                     └─→ estudiante
                                                                           │
                                                                           ├─→ hoja_de_vida_estudiante
                                                                           ├─→ grupo ──→ grado
                                                                           └─→ boletin ──→ periodo_academico
                                                                                 │
                                                                                 └─→ evaluacion_categoria_logro
                                                                                       │
                                                                                       └─→ categoria_logro ──→ logro
```

---

## Extensiones Utilizadas

- **pgcrypto**: Para funciones criptográficas (generación de hashes BCrypt)

---

## Notas Importantes

1. **Herencia de Usuario**: Las tablas `administrador`, `coordinador`, `director`, `profesor` y `acudiente` heredan de `usuario` usando estrategia JOINED en JPA.

2. **UUIDs**: Todos los identificadores primarios son de tipo UUID para garantizar unicidad global.

3. **Cascada**: Las eliminaciones en tablas padres pueden afectar tablas hijas debido a las restricciones de clave foránea.

4. **Roles**: Los roles válidos en `token_usuario.rol` son:
   - ADMINISTRADOR
   - COORDINADOR
   - DIRECTOR
   - PROFESOR
   - ACUDIENTE

5. **Calificaciones**: Las calificaciones válidas en `evaluacion_categoria_logro.calificacion_logro` son:
   - Superior
   - Alto
   - Básico
   - Bajo

---

## Archivo SQL del Esquema

El esquema completo de la base de datos está disponible en:
`/documentos/schema-database.sql`

**Estado Actual**: Base de datos vacía (todos los registros eliminados el 23/11/2025)
