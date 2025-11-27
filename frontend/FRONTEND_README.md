# Frontend - Sistema de Gestión Académica

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
# o
pnpm install
# o
yarn install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
# o
pnpm dev
# o
yarn dev
```

El frontend estará disponible en: http://localhost:3000

## 🔐 Sistema de Autenticación

### Credenciales de Prueba

| Correo Electrónico | Contraseña | Rol |
|-------------------|-----------|-----|
| admin@fis.edu.co | password123 | ADMINISTRADOR |
| coordinador@fis.edu.co | password123 | COORDINADOR |
| director@fis.edu.co | password123 | DIRECTOR |
| profesor1@fis.edu.co | password123 | PROFESOR |
| profesor2@fis.edu.co | password123 | PROFESOR |
| acudiente1@gmail.com | password123 | ACUDIENTE |
| acudiente2@gmail.com | password123 | ACUDIENTE |

### Flujo de Autenticación

1. **Login**: Usuario ingresa correo y contraseña en `/login`
2. **Validación**: El sistema valida credenciales con el backend
3. **Token JWT**: Si es válido, se recibe un token JWT (válido por 24 horas)
4. **Almacenamiento**: Token y datos del usuario se guardan en `localStorage`
5. **Primera vez**: Si el usuario no tiene datos personales completos, se muestra modal
6. **Actualización**: Usuario completa nombre, apellido, cédula y fecha de nacimiento
7. **Redirección**: Sistema redirige según el rol del usuario

### Rutas por Rol

- **ADMINISTRADOR** → `/administrador`
- **COORDINADOR** → `/coordinador`
- **DIRECTOR** → `/directivo`
- **PROFESOR** → `/profesor`
- **ACUDIENTE** → `/acudiente`

## 📁 Estructura del Proyecto

```
frontend/
├── app/                      # Páginas Next.js (App Router)
│   ├── login/               # Página de inicio de sesión
│   ├── administrador/       # Dashboard administrador
│   ├── coordinador/         # Dashboard coordinador
│   ├── directivo/           # Dashboard director
│   ├── profesor/            # Dashboard profesor
│   ├── acudiente/           # Dashboard acudiente
│   └── layout.tsx           # Layout principal con AuthProvider
├── components/              # Componentes reutilizables
│   ├── login-form.tsx       # Formulario de login
│   ├── first-time-modal.tsx # Modal para datos personales
│   └── ui/                  # Componentes UI (shadcn)
├── contexts/                # Contextos de React
│   └── auth-context.tsx     # Contexto de autenticación
├── lib/                     # Utilidades y servicios
│   ├── api.ts              # Cliente HTTP
│   ├── services/           # Servicios de API
│   │   └── auth.service.ts # Servicio de autenticación
│   └── types/              # Tipos TypeScript
│       └── auth.ts         # Tipos de autenticación
├── middleware.ts           # Middleware de Next.js (protección de rutas)
└── .env.local             # Variables de entorno
```

## 🔧 Componentes Principales

### AuthProvider (`contexts/auth-context.tsx`)

Proveedor de contexto que maneja el estado de autenticación global:

```tsx
const { user, isAuthenticated, login, logout, actualizarDatos } = useAuth()
```

**Propiedades:**
- `user`: Datos del usuario actual (UsuarioDTO | null)
- `isAuthenticated`: Boolean indicando si hay sesión activa
- `isLoading`: Estado de carga
- `login(credenciales)`: Función para iniciar sesión
- `logout()`: Función para cerrar sesión
- `actualizarDatos(datos)`: Actualizar datos personales
- `error`: Mensaje de error si existe
- `clearError()`: Limpiar errores

### LoginForm (`components/login-form.tsx`)

Formulario de inicio de sesión con validación y manejo de errores.

**Funcionalidad:**
- Validación de campos requeridos
- Integración con backend via `AuthService`
- Manejo de errores con mensajes amigables
- Estados de carga visual
- Detección de primera vez (datos incompletos)

### FirstTimeModal (`components/first-time-modal.tsx`)

Modal para completar datos personales en el primer inicio de sesión.

**Validaciones:**
- Nombre y apellido obligatorios
- Cédula: 6-10 dígitos numéricos
- Fecha de nacimiento: No puede ser futura
- Todos los campos son requeridos

## 🌐 Servicios API

### AuthService (`lib/services/auth.service.ts`)

```typescript
// Login
const response = await AuthService.login({
  correoElectronico: 'admin@fis.edu.co',
  contrasena: 'password123'
})

// Logout
AuthService.logout()

// Obtener usuario actual
const user = AuthService.getCurrentUser()

// Actualizar datos personales
const updatedUser = await AuthService.actualizarDatosPersonales(userId, {
  nombre: 'Juan',
  apellido: 'Pérez',
  cedula: '1234567890',
  fechaNacimiento: '1990-01-01'
})

// Verificar autenticación
const isAuth = AuthService.isAuthenticated()

// Health check
const status = await AuthService.checkHealth()
```

### Cliente API (`lib/api.ts`)

Cliente HTTP configurado para comunicación con el backend:

```typescript
import { api } from '@/lib/api'

// GET
const data = await api.get<ResponseType>('/endpoint')

// POST
const result = await api.post<ResponseType>('/endpoint', { data })

// PUT
const updated = await api.put<ResponseType>('/endpoint', { data })

// DELETE
await api.delete('/endpoint')
```

**Características:**
- Headers automáticos (Content-Type: application/json)
- Manejo de errores centralizado
- Clase `ApiException` para errores tipados
- Funciones helper para tokens (getAuthToken, setAuthToken, removeAuthToken)

## 🛡️ Protección de Rutas

El archivo `middleware.ts` protege rutas automáticamente:

- Rutas públicas: `/login`, `/`
- Rutas protegidas: Requieren token JWT válido
- Redirección automática a `/login` si no está autenticado

## 🎨 Estilos y UI

El proyecto usa:
- **Tailwind CSS**: Framework de utilidades CSS
- **shadcn/ui**: Componentes UI accesibles y personalizables
- **Radix UI**: Primitivas headless para componentes

### Paleta de Colores

```css
--navy: Azul marino (#1E3A5F)
--beige: Beige claro (#D5BB93)
--brown: Café (#8B4513)
--coral: Coral (#FF6B6B)
--burgundy: Borgoña (#800020)
```

## 🧪 Testing

### Probar Login

1. Iniciar backend: `cd backend && mvn spring-boot:run`
2. Iniciar frontend: `npm run dev`
3. Navegar a http://localhost:3000/login
4. Usar credenciales de prueba (ver tabla arriba)
5. Verificar redirección según rol

### Probar Primera Vez

1. Usar usuario sin datos completos (backend debe retornar usuario con campos null)
2. Modal debe aparecer automáticamente
3. Completar formulario con datos válidos
4. Verificar actualización en backend
5. Confirmar redirección correcta

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Iniciar servidor de producción
npm run start

# Linting
npm run lint
```

## 🐛 Solución de Problemas

### Error de conexión con backend

**Problema:** "Error de comunicación con el servidor"

**Solución:**
1. Verificar que el backend esté corriendo en puerto 8080
2. Confirmar variable `NEXT_PUBLIC_API_URL` en `.env.local`
3. Revisar CORS en `SecurityConfig.java` del backend

### Token expirado

**Problema:** Sesión expira después de 24 horas

**Solución:**
1. El usuario debe hacer login nuevamente
2. El sistema redirige automáticamente a `/login`

### Datos no se actualizan

**Problema:** Modal de primera vez no actualiza datos

**Solución:**
1. Verificar formato de cédula (solo dígitos, 6-10 caracteres)
2. Verificar fecha de nacimiento (no futura)
3. Revisar consola del navegador para errores específicos
4. Verificar endpoint `/usuarios/{id}/datos-iniciales` en backend

## 🔄 Próximos Pasos

- [ ] Implementar refresh de tokens
- [ ] Agregar remember me
- [ ] Implementar recuperación de contraseña
- [ ] Agregar autenticación de dos factores
- [ ] Implementar roles y permisos granulares
- [ ] Añadir internacionalización (i18n)
- [ ] Crear tests unitarios y de integración

## 📞 Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.
