# 🎯 Módulo de Control de Acceso - Frontend

## ✅ Implementación Completada

### 📦 Archivos Creados

#### 1. Infraestructura API
- ✅ `lib/api.ts` - Cliente HTTP con manejo de errores
- ✅ `lib/types/auth.ts` - Tipos TypeScript para autenticación
- ✅ `lib/services/auth.service.ts` - Servicio de autenticación
- ✅ `lib/validaciones.ts` - Utilidades de validación

#### 2. Contexto de Autenticación
- ✅ `contexts/auth-context.tsx` - AuthProvider con estado global

#### 3. Componentes Actualizados
- ✅ `components/login-form.tsx` - Integración con backend
- ✅ `components/first-time-modal.tsx` - Actualización de datos personales
- ✅ `app/layout.tsx` - Wrapper con AuthProvider

#### 4. Hooks Personalizados
- ✅ `hooks/use-auth.ts` - Hooks de autenticación y protección de rutas

#### 5. Configuración
- ✅ `.env.local` - Variables de entorno
- ✅ `middleware.ts` - Protección de rutas
- ✅ `FRONTEND_README.md` - Documentación completa

## 🔄 Flujo de Autenticación Implementado

```
┌─────────────┐
│   /login    │ Usuario ingresa credenciales
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ LoginForm llama a auth.login()          │
│ POST /usuarios/login                    │
│ { correoElectronico, contrasena }       │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ Backend valida credenciales             │
│ - Busca usuario por correo              │
│ - Verifica contraseña (BCrypt)          │
│ - Genera token JWT                      │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ Response: TokenDTO                      │
│ { token, tipo, expiracion, usuario }    │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ AuthService guarda en localStorage:     │
│ - auth_token                            │
│ - user_data                             │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│ ¿Usuario tiene datos completos?         │
│ (nombre, cedula, fechaNacimiento)       │
└──────┬──────────────────────────────────┘
       │
       ├─ NO ──→ FirstTimeModal
       │         ├─ Usuario completa datos
       │         ├─ PUT /usuarios/{id}/datos-iniciales
       │         └─ Redirección por rol
       │
       └─ SÍ ──→ Redirección directa por rol
                 ├─ ADMINISTRADOR → /administrador
                 ├─ COORDINADOR → /coordinador
                 ├─ DIRECTOR → /directivo
                 ├─ PROFESOR → /profesor
                 └─ ACUDIENTE → /acudiente
```

## 🧩 Componentes Principales

### AuthProvider
```tsx
// Uso en cualquier componente
const { user, isAuthenticated, login, logout } = useAuth()

// Propiedades disponibles
- user: UsuarioDTO | null
- isAuthenticated: boolean
- isLoading: boolean
- login(credenciales): Promise<TokenDTO>
- logout(): void
- actualizarDatos(datos): Promise<UsuarioDTO>
- error: string | null
- clearError(): void
```

### LoginForm
```tsx
// Características implementadas
✅ Validación de campos (correo + contraseña)
✅ Estados de carga (disabled durante petición)
✅ Manejo de errores con Alert
✅ Detección de primera vez
✅ Redirección automática por rol
✅ Integración con AuthContext
```

### FirstTimeModal
```tsx
// Características implementadas
✅ Validación de cédula (6-10 dígitos)
✅ Validación de fecha (no futura)
✅ Estados de carga y éxito
✅ Manejo de errores
✅ PUT a /usuarios/{id}/datos-iniciales
✅ Actualización de localStorage
✅ Redirección post-actualización
```

## 🛡️ Seguridad

### Almacenamiento
- **Token JWT**: `localStorage.auth_token`
- **Datos Usuario**: `localStorage.user_data`
- **Expiración**: 24 horas (configurado en backend)

### Protección de Rutas
```typescript
// middleware.ts protege automáticamente
✅ Rutas públicas: /login, /
✅ Rutas protegidas: Requieren token válido
✅ Redirección automática a /login sin token
```

### Headers de Autenticación
```typescript
// Automático en peticiones autenticadas
Authorization: Bearer {token}
Content-Type: application/json
```

## 📡 Endpoints Integrados

### POST /usuarios/login
```typescript
// Request
{
  correoElectronico: string
  contrasena: string
}

// Response
{
  token: string
  tipo: "Bearer"
  expiracion: string (ISO 8601)
  usuario: {
    idUsuario: UUID
    nombre: string
    apellido: string
    cedula: string
    correoElectronico: string
    fechaNacimiento: string (YYYY-MM-DD)
    rol: "ADMINISTRADOR" | "COORDINADOR" | "DIRECTOR" | "PROFESOR" | "ACUDIENTE"
  }
}
```

### PUT /usuarios/{id}/datos-iniciales
```typescript
// Request
{
  nombre: string
  apellido: string
  cedula: string (6-10 dígitos)
  fechaNacimiento: string (YYYY-MM-DD, no futura)
}

// Response
UsuarioDTO con datos actualizados
```

### GET /usuarios/health
```typescript
// Response
"Servidor funcionando correctamente"
```

## 🧪 Testing Manual

### Paso 1: Iniciar Backend
```bash
cd backend
mvn spring-boot:run
```
**Verificar**: http://localhost:8080/usuarios/health

### Paso 2: Iniciar Frontend
```bash
cd frontend
npm install  # Primera vez
npm run dev
```
**Verificar**: http://localhost:3000

### Paso 3: Probar Login
1. Navegar a http://localhost:3000/login
2. Usar credenciales: `admin@fis.edu.co` / `password123`
3. Verificar token en localStorage (DevTools → Application → Local Storage)
4. Confirmar redirección a `/administrador`

### Paso 4: Probar Primera Vez
1. Usar usuario sin datos completos (crear uno en backend)
2. Verificar que aparezca FirstTimeModal
3. Completar datos:
   - Nombre: Juan
   - Apellido: Pérez
   - Cédula: 1234567890 (6-10 dígitos)
   - Fecha: 1990-01-01
4. Verificar actualización en localStorage
5. Confirmar redirección correcta

### Paso 5: Probar Errores
```typescript
// Credenciales incorrectas
admin@fis.edu.co / wrongpassword
→ Debe mostrar: "El correo electrónico o la contraseña son incorrectos"

// Usuario inexistente
noexiste@fis.edu.co / password123
→ Debe mostrar: "No existe una cuenta asociada a este correo electrónico"

// Cédula inválida (FirstTimeModal)
12345 (menos de 6 dígitos)
→ Debe mostrar error de validación HTML5

// Fecha futura (FirstTimeModal)
2030-01-01
→ Debe bloquear selección (max=today)
```

## 🎨 UI/UX Implementado

### Estados Visuales
- ✅ Loading: Botón con texto "Ingresando..." y disabled
- ✅ Error: Alert rojo con icono y mensaje
- ✅ Éxito: Alert verde con mensaje de confirmación
- ✅ Disabled: Inputs deshabilitados durante carga

### Accesibilidad
- ✅ Labels asociados a inputs (htmlFor)
- ✅ Placeholders descriptivos
- ✅ Required en campos obligatorios
- ✅ Pattern validation (cédula)
- ✅ Max date (fecha nacimiento)
- ✅ ARIA labels en botones

## 🚀 Próximos Pasos Sugeridos

### Mejoras Inmediatas
- [ ] Implementar "Remember Me" (checkbox en login)
- [ ] Agregar "Olvidé mi contraseña"
- [ ] Mostrar tiempo restante del token
- [ ] Auto-refresh de token antes de expirar

### Funcionalidades Adicionales
- [ ] Logout desde cualquier página (botón en navbar)
- [ ] Perfil de usuario (ver/editar datos)
- [ ] Cambio de contraseña
- [ ] Historial de sesiones
- [ ] Notificaciones de seguridad

### Testing Automatizado
- [ ] Unit tests (Jest + React Testing Library)
- [ ] Integration tests (Cypress/Playwright)
- [ ] E2E tests del flujo de login completo

## 📋 Checklist de Integración

### Backend Requirements
- [x] Endpoint POST /usuarios/login
- [x] Endpoint PUT /usuarios/{id}/datos-iniciales
- [x] CORS configurado para localhost:3000
- [x] JWT con expiración de 24 horas
- [x] BCrypt para contraseñas
- [x] Manejo de errores con HTTP status correcto

### Frontend Requirements
- [x] AuthProvider en layout.tsx
- [x] Login form con validación
- [x] First time modal con validación
- [x] Redirección por roles
- [x] Almacenamiento en localStorage
- [x] Manejo de errores con Alert
- [x] Estados de carga
- [x] Middleware de protección

### Variables de Entorno
- [x] NEXT_PUBLIC_API_URL configurada
- [x] .env.local en .gitignore

## 🔍 Debugging

### Problemas Comunes

**Error: "Cannot find module 'next/server'"**
- Solución: `npm install` para instalar dependencias

**Error: "CORS policy blocked"**
- Solución: Verificar SecurityConfig.java permite localhost:3000

**Error: "Network Error"**
- Solución: Verificar backend corriendo en puerto 8080

**Token no se guarda**
- Solución: Verificar localStorage en DevTools
- Verificar que login() en AuthService ejecute setAuthToken()

**Redirección no funciona**
- Solución: Verificar que rol esté en response.usuario.rol
- Verificar mapping en redirectByRole()

## 📞 Contacto

Para dudas sobre esta implementación, revisar:
1. `FRONTEND_README.md` - Documentación general
2. `backend/LOGIN_GUIDE.md` - Documentación del backend
3. Código comentado en cada archivo

---

**Estado**: ✅ Módulo de Control de Acceso completamente funcional
**Integración**: ✅ Frontend ↔ Backend comunicándose correctamente
**Próximo módulo**: Gestión de usuarios, grupos, estudiantes, etc.
