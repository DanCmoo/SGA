# Diagrama de Secuencia: Desplegar Contenidos Web (CORREGIDO)

## 1. Lista de Objetos de Interfaz a Crear

Para el caso de uso "Desplegar Contenidos Web":

1. **:RootLayout** - Componente raíz del layout que envuelve toda la app
2. **:AuthProvider** - Proveedor del contexto de autenticación  
3. **:HomePage** - Página principal (landing page)
4. **:Navigation** - Barra de navegación
5. **:Hero** - Componente hero con contenido institucional

**NOTA IMPORTANTE:** Navigation y Hero NO crean objetos separados para botones o cards. Todo el contenido es JSX inline dentro de cada componente.

---

## 2. Archivos Relevantes

**Archivos principales analizados:**
- `frontend/middleware.ts` - Middleware de Next.js que gestiona la ruta
- `frontend/app/layout.tsx` - Layout raíz que envuelve toda la aplicación
- `frontend/app/page.tsx` - Página de inicio (landing)
- `frontend/components/navigation.tsx` - Componente de navegación
- `frontend/components/hero.tsx` - Componente hero con información institucional
- `frontend/contexts/auth-context.tsx` - Contexto de autenticación

---

## 3. Categorización de Clases y Componentes

### **Categoría 1: Componentes de Layout y Estructura**

#### **RootLayout**
- **Archivo:** `frontend/app/layout.tsx`
- **Extiende de:** Función Component de Next.js (export default function)
- **Tipo:** Layout Component (Server Component por defecto)
- **Propiedades/Atributos utilizados:**
  - `children: React.ReactNode` - Contenido hijo a renderizar
- **Métodos/Hooks utilizados:**
  - Ninguno (solo retorna JSX)
- **Responsabilidad:** Envolver toda la aplicación con estructura HTML base (`<html>`, `<body>`) y proveedores globales (AuthProvider, Analytics)

#### **HomePage**
- **Archivo:** `frontend/app/page.tsx`
- **Extiende de:** Función Component de Next.js (export default function)
- **Tipo:** Page Component (Server Component por defecto)
- **Propiedades/Atributos utilizados:**
  - Ninguno
- **Métodos/Hooks utilizados:**
  - Ninguno (solo retorna JSX)
- **Responsabilidad:** Página de inicio que integra Navigation y Hero en un contenedor

---

### **Categoría 2: Componentes de Interfaz (Client Components)**

#### **Navigation**
- **Archivo:** `frontend/components/navigation.tsx`
- **Extiende de:** Función Component de React (export function)
- **Tipo:** UI Component - Navigation Bar (Client Component con "use client")
- **Propiedades/Atributos utilizados:**
  - `isModalOpen: boolean` - Estado local para controlar modal de preinscripción
  - `setIsModalOpen: Dispatch<SetStateAction<boolean>>` - Función setter del estado
- **Métodos/Hooks utilizados:**
  - `useState(false)` - Hook para inicializar estado del modal
- **Contenido JSX renderizado inline:**
  - `<nav>` - Elemento de navegación principal
  - `<svg>` - Logo institucional (inline)
  - `<span>` - Texto "Colegio Excelencia" (inline)
  - `<Link href="/login">` - Link a página de login estilizado como botón (inline)
  - `<button onClick={() => setIsModalOpen(true)}>` - Botón para abrir modal (inline)
  - `<PreinscriptionModal>` - Componente de modal (condicional según isModalOpen)
- **Responsabilidad:** Renderizar barra de navegación completa con todos sus elementos visuales e interactivos en JSX inline

#### **Hero**
- **Archivo:** `frontend/components/hero.tsx`
- **Extiende de:** Función Component de React (export function)
- **Tipo:** UI Component - Content Display (Server Component por defecto)
- **Propiedades/Atributos utilizados:**
  - Ninguno
- **Métodos/Hooks utilizados:**
  - `Array.map()` - Método para iterar sobre array de valores (8 elementos: "Respeto", "Responsabilidad", etc.)
  - `Array.map()` - Método para iterar sobre array de estadísticas (4 elementos con value y label)
- **Contenido JSX renderizado inline:**
  - `<main>` - Contenedor principal
  - Header con `<h1>` título y `<p>` subtítulo (inline)
  - **Sección Misión**: `<div>` con `<svg>` icono, `<h2>` título y `<p>` texto (inline)
  - **Sección Visión**: `<div>` con `<svg>` icono, `<h2>` título y `<p>` texto (inline)
  - **Sección Valores**: `<div>` con título + array.map() que genera 8 `<div>` con texto (inline)
  - **Sección Estadísticas**: `<div>` con array.map() que genera 4 `<div>` con números y labels (inline)
- **Responsabilidad:** Renderizar todo el contenido institucional visual en un solo componente con JSX inline

---

### **Categoría 3: Contextos y Proveedores de Estado**

#### **AuthProvider**
- **Archivo:** `frontend/contexts/auth-context.tsx`
- **Extiende de:** Función Component de React (export function)
- **Tipo:** Context Provider (Client Component con "use client")
- **Propiedades/Atributos utilizados:**
  - `children: React.ReactNode` - Componentes hijos a envolver
  - `user: UsuarioDTO | null` - Estado del usuario autenticado (useState)
  - `token: string | null` - Estado del token JWT (useState)
  - `isLoading: boolean` - Estado de carga (useState)
  - `error: string | null` - Estado de errores (useState)
- **Métodos/Hooks utilizados:**
  - `useState<UsuarioDTO | null>(null)` - Hook para estado de usuario
  - `useState<string | null>(null)` - Hook para estado de token
  - `useState<boolean>(true)` - Hook para estado de carga
  - `useState<string | null>(null)` - Hook para estado de error
  - `useEffect()` - Hook para cargar usuario y token de localStorage al montar
  - `useRouter()` - Hook de Next.js para navegación programática
  - `createContext<AuthContextType>()` - Crea el contexto de autenticación
  - `useContext(AuthContext)` - Consume el contexto (en hook useAuth)
- **Métodos propios definidos en el componente:**
  - `login(credenciales: CredencialesDTO): Promise<TokenDTO>` - Función async para autenticar usuario llamando a AuthService.login()
  - `logout(): void` - Función para limpiar estado y llamar AuthService.logout()
  - `actualizarDatos(datos: RegistroDTO): Promise<UsuarioDTO>` - Función async para actualizar datos del usuario
  - `clearError(): void` - Función para limpiar el estado de error
- **Responsabilidad:** Proveer contexto de autenticación global, manejar estado de sesión y exponer métodos de auth a toda la aplicación

---

## 4. Flujo de Secuencia Detallado

**Paso a paso del diagrama (basado en código real):**

1. **Usuario → Next.js Framework**: El usuario ingresa la URL "/" en el navegador

2. **Next.js → Middleware**: Next.js ejecuta el middleware interno que valida si la ruta es pública (línea `publicPaths.some(path => pathname.startsWith(path))`)

3. **Next.js → RootLayout**: Next.js invoca el componente RootLayout pasando children

4. **RootLayout → AuthProvider**: RootLayout crea y renderiza AuthProvider envolviendo {children}

5. **AuthProvider → useEffect()**: AuthProvider ejecuta useEffect al montar para cargar usuario y token del localStorage

6. **AuthProvider → Context.Provider**: AuthProvider retorna `<AuthContext.Provider>` con el value que contiene estado y métodos

7. **RootLayout → {children}**: El children (que es HomePage) se renderiza dentro de AuthProvider

8. **HomePage → Navigation**: HomePage renderiza el componente Navigation

9. **Navigation → useState()**: Navigation ejecuta `useState(false)` para inicializar isModalOpen

10. **Navigation → return JSX**: Navigation retorna JSX con `<nav>`, logo SVG, texto, `<Link>`, `<button>` y `<PreinscriptionModal>` todo inline

11. **HomePage → Hero**: HomePage renderiza el componente Hero

12. **Hero → return JSX**: Hero retorna JSX con header, secciones de misión, visión, valores.map() y stats.map() todo inline

13. **Next.js → Usuario**: La página HTML completa se envía al navegador del usuario

**Notas importantes:**
- **NO** se crean objetos separados para botones, cards o secciones - todo es JSX inline
- Navigation y Hero son **componentes funcionales** que retornan JSX directamente
- Las "llamadas a sí mismo" en el diagrama deben representar ejecución de hooks (useState, useEffect) no métodos personalizados
- AuthProvider SÍ tiene métodos reales definidos: login(), logout(), actualizarDatos(), clearError()

---

## 5. Diagrama de Secuencia en PlantUML

**Archivo:** `documentos/diagramas-secuencia/diagrama-secuencia-desplegar-contenidos-web.puml`

**CORRECCIONES NECESARIAS AL DIAGRAMA:**
1. Eliminar objetos ButtonLogin, ButtonPreinscripcion, CardMision, CardVision, etc.
2. Las flechas recursivas deben mostrar hooks (useState, useEffect) no métodos inventados
3. Navigation y Hero solo ejecutan hooks y retornan JSX

---

## 6. Resumen

**Caso de uso:** Desplegar Contenidos Web  
**Alcance:** Desde que el usuario ingresa la URL hasta que ve la página inicial con información institucional  

**Objetos creados:** 5 componentes principales (RootLayout, AuthProvider, HomePage, Navigation, Hero)  
**Clases usadas:** Función Components de React/Next.js

**Importante:** Navigation y Hero NO crean sub-objetos. Todo su contenido es JSX inline con operaciones de map() para generar elementos dinámicamente.
