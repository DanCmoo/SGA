# 📚 Sistema de Gestión Escolar - Documentación Frontend

## 📋 Descripción General

Sistema web de gestión escolar desarrollado en **Next.js 16** (React 19) con **TypeScript** y **Tailwind CSS**. Esta aplicación frontend proporciona interfaces específicas para cada rol del ecosistema escolar.

### 🎯 Característica Principal: Sistema de Evaluación por Logros

El sistema implementa un **modelo de evaluación por competencias** basado en 4 dimensiones del desarrollo infantil:
- **Psicosocial**: Habilidades de comunicación, trabajo en equipo y empatía
- **Psicomotor**: Coordinación motora y habilidades físicas
- **Cognitivo**: Razonamiento lógico y resolución de problemas
- **Procedimental**: Autonomía y seguimiento de instrucciones

Cada dimensión tiene **3 indicadores específicos** que se evalúan como **cumplido (✓)** o **no cumplido (✗)**. El sistema calcula automáticamente puntuaciones (0-100) por dimensión y una puntuación total promedio.

**Importante**: La evaluación NO es cualitativa (Excelente/Bueno/Regular), sino **booleana** por cada indicador, generando después métricas cuantitativas automáticas.

---

## 🎯 Roles del Sistema

### 1. 👤 **Público General**
- **Ruta**: `/`
- **Funcionalidades**:
  - ✅ Visualización de página principal (Hero)
  - ✅ Acceso a formulario de preinscripción
  - ✅ Navegación a login

### 2. 🔐 **Login / Autenticación**
- **Ruta**: `/login`
- **Funcionalidades**:
  - ✅ Formulario de inicio de sesión
  - ✅ Modal de primer ingreso (registro de datos personales)
  - ✅ Selección de rol en primer ingreso
  - ✅ Redirección automática según rol seleccionado

### 3. 👨‍🏫 **Profesor**
- **Ruta**: `/profesor`
- **Funcionalidades**:
  - ✅ Vista del grupo asignado
  - ✅ Listado de estudiantes del grupo
  - ✅ **Ver información del estudiante** (botón ojo) - Abre modal de perfil
  - ✅ **Ver historial de logros** (botón documento) - Consulta histórico de evaluaciones
  - ✅ **Evaluar logros del estudiante** (botón estrella) - Sistema de evaluación booleana
  - ✅ Cerrar sesión

#### Sistema de Evaluación de Logros (Modal):
El profesor evalúa logros en **4 dimensiones**, cada una con **3 indicadores**:

**Dimensiones:**
1. **Logros Psicosociales** (3 indicadores)
   - Se comunica con otros estudiantes
   - Trabaja en equipo efectivamente
   - Muestra empatía con sus compañeros

2. **Logros Psicomotores** (3 indicadores)
   - Sabe usar las manos con facilidad
   - Tiene buena coordinación motora
   - Realiza actividades físicas correctamente

3. **Logros Cognitivos** (3 indicadores)
   - Usa razonamiento lógico
   - Resuelve problemas de forma creativa
   - Comprende conceptos abstractos

4. **Logros Procedimentales** (3 indicadores)
   - Sabe hacer cosas de forma autónoma
   - Sigue instrucciones correctamente
   - Completa tareas asignadas

**Lógica de Evaluación:**
- Cada indicador se evalúa con: ✓ (Cumplido) o ✗ (No cumplido)
- **Puntuación por dimensión** = (Indicadores cumplidos / Total indicadores) × 100
- **Puntuación total** = Promedio de las 4 dimensiones (0-100)

**Ejemplo:**
```
Logros Psicosociales: 2/3 cumplidos = 67 puntos
Logros Psicomotores: 3/3 cumplidos = 100 puntos
Logros Cognitivos: 1/3 cumplidos = 33 puntos
Logros Procedimentales: 3/3 cumplidos = 100 puntos
---
Puntuación Total: (67+100+33+100)/4 = 75 puntos
```

**Datos Mockeados**:
```javascript
- Profesor: "María González"
- Grupo: "5to Grado A"
- Estudiantes: ["Ana Martínez", "Luis Rodríguez", "José Hernández", ...]
```

### 4. 🎓 **Coordinador**
- **Ruta**: `/coordinador`
- **Funcionalidades**:
  - ✅ Gestión de estudiantes preinscritos
  - ✅ **Aceptar/Rechazar preinscripciones**
  - ✅ Vista de listado con filtros (pendientes/procesados)
  - ✅ Navegación a creación de grupos
  - ✅ Notificaciones toast para acciones

**Ruta**: `/coordinador/crear-grupos`
- **Funcionalidades**:
  - ✅ Selector de grado (Parvulos, Caminadores, Pre-Jardin)
  - ✅ Selector de grupo (A, B, C)
  - ✅ Asignación de profesor
  - ✅ Selección múltiple de estudiantes disponibles
  - ✅ Creación de grupos con estudiantes seleccionados
  - ✅ Validación de estudiantes seleccionados

### 5. 👔 **Directivo**
- **Ruta**: `/directivo`
- **Funcionalidades**:
  - ✅ Vista jerárquica de grados y grupos
  - ✅ Navegación expandible por grado
  - ✅ Listado de grupos por grado
  - ✅ Acceso a vista detallada de cada grupo

**Ruta**: `/directivo/grupo/[groupId]`
- **Funcionalidades**:
  - ✅ Vista detallada del grupo seleccionado
  - ✅ Información del profesor asignado
  - ✅ Listado completo de estudiantes
  - ✅ **Ver/Editar perfil del estudiante** (botón ojo) - Hoja de vida
  - ✅ **Ver historial de logros** (botón documento) - Consulta evaluaciones
  - ✅ Breadcrumbs de navegación

#### Modal de Perfil del Estudiante (Hoja de Vida):
Permite al directivo ver y editar información del estudiante:
- **Nombre del estudiante** (solo lectura)
- **Acudiente asignado** (solo lectura)
- **Datos Médicos**: Lista editable de condiciones médicas (ej: "miopia", "asma")
- **Observaciones de Aprendizaje**: Lista editable de observaciones (ej: "se distrae", "necesita refuerzo en matemáticas")
- Botones para agregar nuevos datos médicos u observaciones
- Botón "Guardar Cambios" para persistir la información

**Datos Mockeados**:
```javascript
Grados: [
  { id: "parvulos", grupos: ["parvulos-a", "parvulos-b", "parvulos-c"] },
  { id: "caminadores", grupos: ["caminadores-a", "caminadores-b", "caminadores-c"] },
  { id: "pre-jardin", grupos: ["pre-jardin-a", "pre-jardin-b", "pre-jardin-c"] }
]
```

### 6. 👪 **Acudiente**
- **Ruta**: `/acudiente`
- **Funcionalidades**:
  - ✅ Vista de estudiantes a cargo
  - ✅ **Ver historial de logros** (botón documento) - Modal con evaluaciones detalladas
  - ✅ **Descargar reporte PDF** (botón descarga) - Genera reporte completo
  - ✅ Estados de carga y vacío
  - ✅ Notificaciones de descarga exitosa

#### Modal de Historial de Logros (Solo Lectura):
El acudiente puede ver el historial de evaluaciones de su hijo:
- **Rango de fechas**: Fecha inicio y fecha fin del período evaluado
- **4 Categorías de logros** con sus indicadores y puntuaciones:
  - Logros Psicosociales (lista de indicadores + puntuación 0-100)
  - Logros Psicomotores (lista de indicadores + puntuación 0-100)
  - Logros Cognitivos (lista de indicadores + puntuación 0-100)
  - Logros Procedimentales (lista de indicadores + puntuación 0-100)
- **Puntuación Total**: Promedio de las 4 categorías
- **Botón Descargar**: Genera PDF con toda la información

**Datos Mockeados**:
```javascript
- Acudiente: "Laura Sofía Perez Perez"
- Estudiantes: [
    { id: 1, name: "Vanessa Rodriguez", grade: "5to Grado" },
    { id: 2, name: "Sebastian Bedoya", grade: "3er Grado" }
  ]
- Histórico ejemplo:
  - Fecha inicio: "2024-01-15"
  - Fecha fin: "2024-03-15"
  - Psicosociales: 85/100
  - Psicomotores: 90/100
  - Cognitivos: 78/100
  - Procedimentales: 88/100
  - Total: 85/100
```

### 7. ⚙️ **Administrador** (NUEVO)
- **Ruta**: `/administrador`
- **Funcionalidades**:
  - ✅ **Crear nuevos usuarios** del sistema
  - ✅ Formulario de creación con validación:
    - Nombre completo
    - Correo electrónico
    - Rol (Profesor, Coordinador, Acudiente, Directivo, Administrador)
  - ✅ Listado completo de usuarios registrados
  - ✅ Visualización de usuarios con badges de rol coloreados
  - ✅ Contador de total de usuarios
  - ✅ Formulario colapsable (mostrar/ocultar)
  - ✅ Notificaciones de éxito/error
  - ❌ ~~Eliminar usuarios~~ (funcionalidad removida)

---

## 🎨 Componentes Compartidos

### Modales
- ✅ **PreinscriptionModal**: Formulario de preinscripción pública
- ✅ **FirstTimeModal**: Registro de datos personales + selección de rol en primer ingreso
- ✅ **AchievementsModal**: Evaluación de logros con sistema booleano (Profesor)
  - 4 dimensiones × 3 indicadores cada una
  - Evaluación ✓/✗ por indicador
  - Cálculo automático de puntuación por dimensión y total
- ✅ **AchievementsHistoryModal**: Ver historial de evaluaciones (Profesor/Directivo)
  - Solo lectura del histórico
  - Muestra todas las dimensiones con puntuaciones
- ✅ **GuardianAchievementsModal**: Vista de logros para acudientes (Acudiente)
  - Igual que AchievementsHistoryModal pero con botón de descarga PDF
- ✅ **StudentProfileModal**: Hoja de vida del estudiante (Directivo)
  - Edición de datos médicos
  - Edición de observaciones de aprendizaje

### UI Components
- ✅ **Navigation**: Barra de navegación principal
- ✅ **Hero**: Sección hero de la página principal
- ✅ **Toast**: Sistema de notificaciones
- ✅ **Breadcrumbs**: Navegación de migas de pan
- ✅ **EmptyState**: Estado vacío para listas
- ✅ **LoadingSkeleton**: Esqueleto de carga
- ✅ **Button, Card, Input, Label, Select**: Componentes base de Radix UI

---

## 📊 Estructura de Datos Esperada del Backend

### 🔐 **Autenticación**

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "usuario@colegio.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "nombre": "María González",
    "email": "maria@colegio.com",
    "rol": "profesor",
    "primerIngreso": false
  }
}
```

#### POST `/api/auth/register-first-time`
**Request:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "cedula": "1234567890",
  "fechaNacimiento": "1990-05-15",
  "correo": "juan@email.com",
  "telefono": "3001234567",
  "direccion": "Calle 123 #45-67",
  "rol": "profesor"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "rol": "profesor"
  }
}
```

---

### 👨‍🏫 **Profesor**

#### GET `/api/profesor/grupo`
**Response:**
```json
{
  "profesor": {
    "id": 1,
    "nombre": "María González",
    "email": "maria@colegio.com"
  },
  "grupo": {
    "id": 1,
    "nombre": "5to Grado A",
    "grado": "5to"
  },
  "estudiantes": [
    {
      "id": 1,
      "nombre": "Ana Martínez",
      "documento": "TI 1234567",
      "edad": 10
    }
  ]
}
```

#### GET `/api/estudiante/:id/perfil`
**Response:**
```json
{
  "id": 1,
  "nombre": "Ana Martínez",
  "documento": "TI 1234567",
  "fechaNacimiento": "2014-03-15",
  "edad": 10,
  "grado": "5to",
  "grupo": "A",
  "acudiente": {
    "nombre": "Laura Martínez",
    "telefono": "3001234567",
    "email": "laura@email.com"
  },
  "datosMedicos": ["miopia", "asma"],
  "observacionesAprendizaje": ["se distrae", "necesita refuerzo en matemáticas"]
}
```

#### PUT `/api/estudiante/:id/perfil`
**Request:**
```json
{
  "datosMedicos": ["miopia", "asma", "alergia al polen"],
  "observacionesAprendizaje": ["se distrae", "necesita refuerzo en matemáticas", "excelente en lectura"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "estudiante": {
    "id": 1,
    "nombre": "Ana Martínez",
    "datosMedicos": ["miopia", "asma", "alergia al polen"],
    "observacionesAprendizaje": ["se distrae", "necesita refuerzo en matemáticas", "excelente en lectura"]
  }
}
```

#### POST `/api/estudiante/:id/evaluacion-logros`
**Request:**
```json
{
  "estudianteId": 1,
  "profesorId": 1,
  "fecha": "2025-11-01",
  "evaluacion": {
    "psicosociales": [
      { "indicador": "Se comunica con otros estudiantes", "cumplido": true },
      { "indicador": "Trabaja en equipo efectivamente", "cumplido": true },
      { "indicador": "Muestra empatía con sus compañeros", "cumplido": false }
    ],
    "psicomotores": [
      { "indicador": "Sabe usar las manos con facilidad", "cumplido": true },
      { "indicador": "Tiene buena coordinación motora", "cumplido": true },
      { "indicador": "Realiza actividades físicas correctamente", "cumplido": true }
    ],
    "cognitivos": [
      { "indicador": "Usa razonamiento lógico", "cumplido": false },
      { "indicador": "Resuelve problemas de forma creativa", "cumplido": true },
      { "indicador": "Comprende conceptos abstractos", "cumplido": false }
    ],
    "procedimentales": [
      { "indicador": "Sabe hacer cosas de forma autónoma", "cumplido": true },
      { "indicador": "Sigue instrucciones correctamente", "cumplido": true },
      { "indicador": "Completa tareas asignadas", "cumplido": true }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "evaluacion": {
    "id": 1,
    "estudianteId": 1,
    "profesorId": 1,
    "fecha": "2025-11-01",
    "puntuaciones": {
      "psicosociales": 67,
      "psicomotores": 100,
      "cognitivos": 33,
      "procedimentales": 100,
      "total": 75
    }
  }
}
```

**Nota Importante**: La calificación es **booleana** (true/false) por cada indicador. El backend debe calcular:
- Puntuación por dimensión = (indicadores cumplidos / total indicadores) × 100
- Puntuación total = promedio de las 4 dimensiones

#### GET `/api/estudiante/:id/historial-evaluaciones`
**Query Params:** `?fechaInicio=2024-01-15&fechaFin=2024-03-15`

**Response:**
```json
{
  "estudiante": {
    "id": 1,
    "nombre": "Ana Martínez"
  },
  "periodo": {
    "fechaInicio": "2024-01-15",
    "fechaFin": "2024-03-15"
  },
  "evaluaciones": {
    "psicosociales": {
      "indicadores": [
        "Se comunica con otros estudiantes",
        "Trabaja en equipo efectivamente",
        "Muestra empatía con sus compañeros"
      ],
      "puntuacion": 85
    },
    "psicomotores": {
      "indicadores": [
        "Sabe usar las manos con facilidad",
        "Tiene buena coordinación motora",
        "Realiza actividades físicas correctamente"
      ],
      "puntuacion": 90
    },
    "cognitivos": {
      "indicadores": [
        "Usa razonamiento lógico",
        "Resuelve problemas de forma creativa",
        "Comprende conceptos abstractos"
      ],
      "puntuacion": 78
    },
    "procedimentales": {
      "indicadores": [
        "Sabe hacer cosas de forma autónoma",
        "Sigue instrucciones correctamente",
        "Completa tareas asignadas"
      ],
      "puntuacion": 88
    }
  },
  "puntuacionTotal": 85,
  "cantidadEvaluaciones": 12
}
```

---

### 🎓 **Coordinador**

#### GET `/api/coordinador/preinscripciones`
**Response:**
```json
{
  "preinscripciones": [
    {
      "id": 1,
      "estudiante": {
        "nombre": "Ana Perez",
        "fechaNacimiento": "2020-05-15",
        "documento": "TI 1234567"
      },
      "acudiente": {
        "nombre": "Laura Perez",
        "telefono": "3001234567",
        "email": "laura@email.com"
      },
      "gradoSolicitado": "Parvulos",
      "estado": "pendiente",
      "fechaSolicitud": "2025-10-15"
    }
  ]
}
```

#### PUT `/api/coordinador/preinscripcion/:id/aceptar`
**Response:**
```json
{
  "success": true,
  "message": "Preinscripción aceptada",
  "estudiante": {
    "id": 1,
    "nombre": "Ana Perez",
    "estado": "aceptado"
  }
}
```

#### PUT `/api/coordinador/preinscripcion/:id/rechazar`
**Response:**
```json
{
  "success": true,
  "message": "Preinscripción rechazada",
  "preinscripcionId": 1,
  "estado": "rechazado"
}
```

#### GET `/api/coordinador/estudiantes-disponibles`
**Response:**
```json
{
  "estudiantes": [
    {
      "id": 1,
      "nombre": "Laura",
      "edad": 4,
      "documento": "TI 1234567",
      "grupoActual": null
    }
  ]
}
```

#### GET `/api/coordinador/profesores`
**Response:**
```json
{
  "profesores": [
    {
      "id": 1,
      "nombre": "Santiago Ramírez",
      "email": "santiago@colegio.com",
      "gruposAsignados": ["5to A"]
    }
  ]
}
```

#### POST `/api/coordinador/grupos`
**Request:**
```json
{
  "grado": "Parvulos",
  "grupo": "A",
  "profesorId": 1,
  "estudiantesIds": [1, 2, 3, 4]
}
```

**Response:**
```json
{
  "success": true,
  "grupo": {
    "id": 1,
    "nombre": "Parvulos A",
    "grado": "Parvulos",
    "grupo": "A",
    "profesorId": 1,
    "cantidadEstudiantes": 4
  }
}
```

---

### 👔 **Directivo**

#### GET `/api/directivo/grados-grupos`
**Response:**
```json
{
  "grados": [
    {
      "id": 1,
      "nombre": "PARVULOS",
      "grupos": [
        {
          "id": 1,
          "nombre": "parvulos a",
          "codigo": "parvulos-a",
          "cantidadEstudiantes": 15,
          "profesor": {
            "id": 1,
            "nombre": "María Fernanda González"
          }
        }
      ]
    }
  ]
}
```

#### GET `/api/directivo/grupo/:groupId`
**Response:**
```json
{
  "grupo": {
    "id": 1,
    "nombre": "Parvulos A",
    "codigo": "parvulos-a",
    "grado": "PARVULOS"
  },
  "profesor": {
    "id": 1,
    "nombre": "María Fernanda González",
    "email": "maria@colegio.com"
  },
  "estudiantes": [
    {
      "id": 1,
      "nombre": "Ana María López",
      "documento": "TI 1234567",
      "edad": 5
    }
  ]
}
```

---

### 👪 **Acudiente**

#### GET `/api/acudiente/estudiantes`
**Response:**
```json
{
  "acudiente": {
    "id": 1,
    "nombre": "Laura Sofía Perez Perez",
    "email": "laura@email.com"
  },
  "estudiantes": [
    {
      "id": 1,
      "nombre": "Vanessa Rodriguez",
      "grado": "5to Grado",
      "grupo": "A",
      "profesor": "María González",
      "ultimaEvaluacion": {
        "fecha": "2024-03-15",
        "puntuacionTotal": 85
      }
    },
    {
      "id": 2,
      "nombre": "Sebastian Bedoya",
      "grado": "3er Grado",
      "grupo": "B",
      "profesor": "Carlos Pérez",
      "ultimaEvaluacion": {
        "fecha": "2024-03-10",
        "puntuacionTotal": 92
      }
    }
  ]
}
```

#### GET `/api/acudiente/estudiante/:id/historial-evaluaciones`
**Query Params:** `?fechaInicio=2024-01-15&fechaFin=2024-03-15`

**Response:** (Mismo formato que el endpoint del profesor)
```json
{
  "estudiante": {
    "id": 1,
    "nombre": "Vanessa Rodriguez"
  },
  "periodo": {
    "fechaInicio": "2024-01-15",
    "fechaFin": "2024-03-15"
  },
  "evaluaciones": {
    "psicosociales": {
      "indicadores": ["Se comunica con otros estudiantes", "..."],
      "puntuacion": 85
    },
    "psicomotores": {
      "indicadores": ["Sabe usar las manos con facilidad", "..."],
      "puntuacion": 90
    },
    "cognitivos": {
      "indicadores": ["Usa razonamiento lógico", "..."],
      "puntuacion": 78
    },
    "procedimentales": {
      "indicadores": ["Sabe hacer cosas de forma autónoma", "..."],
      "puntuacion": 88
    }
  },
  "puntuacionTotal": 85,
  "cantidadEvaluaciones": 12
}
```

#### GET `/api/acudiente/estudiante/:id/reporte-pdf`
**Query Params:** `?fechaInicio=2024-01-15&fechaFin=2024-03-15`

**Response:** (Archivo PDF generado)
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="reporte_vanessa_rodriguez_2024-01-15_2024-03-15.pdf"

El PDF debe incluir:
- Encabezado con logo e información del colegio
- Datos del estudiante (nombre, grado, grupo, profesor)
- Información del acudiente
- Período de evaluación
- Tabla con las 4 dimensiones y sus indicadores
- Puntuaciones por dimensión (gráfico de barras recomendado)
- Puntuación total promedio
- Observaciones generales (opcional)
- Firma digital del colegio
```

---

### ⚙️ **Administrador**

#### GET `/api/admin/usuarios`
**Response:**
```json
{
  "usuarios": [
    {
      "id": 1,
      "nombre": "María González",
      "email": "maria@colegio.com",
      "rol": "profesor",
      "activo": true,
      "fechaCreacion": "2025-01-15"
    },
    {
      "id": 2,
      "nombre": "Carlos Pérez",
      "email": "carlos@colegio.com",
      "rol": "coordinador",
      "activo": true,
      "fechaCreacion": "2025-02-10"
    }
  ],
  "total": 2
}
```

#### POST `/api/admin/usuarios`
**Request:**
```json
{
  "nombre": "Ana López",
  "email": "ana@colegio.com",
  "rol": "acudiente",
  "password": "password_temporal_123"
}
```

**Response:**
```json
{
  "success": true,
  "usuario": {
    "id": 3,
    "nombre": "Ana López",
    "email": "ana@colegio.com",
    "rol": "acudiente",
    "activo": true,
    "passwordTemporal": true
  },
  "message": "Usuario creado exitosamente. Se ha enviado un correo con la contraseña temporal."
}
```

---

### 📝 **Preinscripción Pública**

#### POST `/api/preinscripcion`
**Request:**
```json
{
  "acudiente": {
    "nombre": "Laura Pérez",
    "identificacion": "1234567890",
    "telefono": "3001234567",
    "email": "laura@email.com"
  },
  "estudiante": {
    "nombre": "Ana Pérez",
    "fechaNacimiento": "2020-05-15",
    "gradoACursar": "Parvulos",
    "documento": "TI 1234567"
  }
}
```

**Response:**
```json
{
  "success": true,
  "preinscripcion": {
    "id": 1,
    "numeroSolicitud": "PRE-2025-001",
    "estado": "pendiente",
    "fechaSolicitud": "2025-11-01"
  },
  "message": "Preinscripción registrada exitosamente. Recibirá una notificación por correo."
}
```

---

## 🔑 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Público** | - Ver página principal<br>- Preinscribirse (formulario público) |
| **Profesor** | - Ver su grupo y estudiantes asignados<br>- **Evaluar logros** (sistema booleano ✓/✗)<br>- Ver historial de evaluaciones de sus estudiantes<br>- Ver perfil básico de estudiantes |
| **Coordinador** | - Gestionar preinscripciones (aceptar/rechazar)<br>- Crear grupos académicos<br>- Asignar profesores a grupos<br>- Seleccionar estudiantes para grupos |
| **Directivo** | - Ver todos los grados y grupos<br>- Ver información de todos los estudiantes<br>- **Editar hoja de vida** (datos médicos, observaciones)<br>- Ver historial de evaluaciones de cualquier estudiante |
| **Acudiente** | - Ver sus estudiantes a cargo<br>- Ver historial de evaluaciones (solo lectura)<br>- Descargar reportes en PDF |
| **Administrador** | - Crear usuarios del sistema<br>- Ver listado completo de usuarios<br>- Asignar roles |

---

## 📊 Sistema de Evaluación de Logros

### Estructura de Evaluación
El sistema utiliza **4 dimensiones de desarrollo** con **3 indicadores** cada una:

#### 1. Dimensión Psicosocial
- Se comunica con otros estudiantes
- Trabaja en equipo efectivamente  
- Muestra empatía con sus compañeros

#### 2. Dimensión Psicomotora
- Sabe usar las manos con facilidad
- Tiene buena coordinación motora
- Realiza actividades físicas correctamente

#### 3. Dimensión Cognitiva
- Usa razonamiento lógico
- Resuelve problemas de forma creativa
- Comprende conceptos abstractos

#### 4. Dimensión Procedimental
- Sabe hacer cosas de forma autónoma
- Sigue instrucciones correctamente
- Completa tareas asignadas

### Cálculo de Puntuaciones
```javascript
// Cada indicador se evalúa como booleano
indicador.cumplido = true  // ✓ Cumplido
indicador.cumplido = false // ✗ No cumplido

// Puntuación por dimensión (0-100)
puntuacionDimension = (indicadoresCumplidos / totalIndicadores) × 100

// Ejemplo: 2 de 3 cumplidos = (2/3) × 100 = 67 puntos

// Puntuación total (0-100)
puntuacionTotal = (sumaDimensiones / 4)

// Ejemplo: (67 + 100 + 33 + 100) / 4 = 75 puntos
```

### Flujo de Evaluación
1. **Profesor** evalúa al estudiante marcando ✓ o ✗ en cada indicador
2. Sistema calcula automáticamente las puntuaciones
3. Se guarda la evaluación con fecha y profesor que evaluó
4. **Historial** se puede consultar por rango de fechas
5. **Acudiente** y **Directivo** pueden ver el historial (solo lectura)
6. **Acudiente** puede descargar reporte PDF con todas las evaluaciones

---

## 🛠️ Tecnologías Utilizadas

### Core
- **Next.js 16.0.0** (App Router)
- **React 19.2.0**
- **TypeScript 5**
- **Tailwind CSS 4.1.9**

### UI Components
- **Radix UI** (componentes accesibles)
- **Lucide React** (iconos)
- **Sonner** (toasts)
- **React Hook Form** (formularios)
- **Zod** (validación)

### Estilo y Animaciones
- **tailwindcss-animate**
- **class-variance-authority**
- **clsx** y **tailwind-merge**

---

## 📦 Instalación y Ejecución

### Requisitos
- Node.js 18+
- npm o pnpm

### Instalación
```bash
# Clonar repositorio
git clone <repo-url>

# Instalar dependencias
npm install --legacy-peer-deps

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

### Variables de Entorno (Recomendadas)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Sistema Escolar
```

---

## 🚀 Próximas Integraciones con Backend

### Endpoints Prioritarios (Para Empalme)
1. ✅ **Autenticación JWT**
   - POST `/api/auth/login`
   - POST `/api/auth/register-first-time`
   
2. ✅ **Sistema de Evaluación de Logros** (Crítico)
   - POST `/api/estudiante/:id/evaluacion-logros` (Profesor evalúa)
   - GET `/api/estudiante/:id/historial-evaluaciones` (Consulta historial)
   
3. ✅ **Gestión de Usuarios** (Administrador)
   - GET `/api/admin/usuarios`
   - POST `/api/admin/usuarios`
   
4. ✅ **Preinscripciones** (Coordinador)
   - GET `/api/coordinador/preinscripciones`
   - PUT `/api/coordinador/preinscripcion/:id/aceptar`
   - PUT `/api/coordinador/preinscripcion/:id/rechazar`
   - POST `/api/preinscripcion` (público)
   
5. ✅ **Gestión de Grupos** (Coordinador)
   - GET `/api/coordinador/estudiantes-disponibles`
   - GET `/api/coordinador/profesores`
   - POST `/api/coordinador/grupos`
   
6. ✅ **Perfil de Estudiantes** (Directivo)
   - GET `/api/estudiante/:id/perfil`
   - PUT `/api/estudiante/:id/perfil` (editar datos médicos y observaciones)
   
7. ✅ **Reportes PDF** (Acudiente)
   - GET `/api/acudiente/estudiante/:id/reporte-pdf`




## 🎨 Paleta de Colores

```css
/* Principales */
--navy: #253440
--brown: #6F4D38
--beige: #D5BB93
--coral: #F67891
--burgundy: #632024

/* Grises */
--gray-50 a --gray-900

/* Estados */
--success: green-600
--error: red-600
--warning: orange-600
--info: blue-600
```
