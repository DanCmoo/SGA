# Diagrama de Secuencia: Desplegar IGU (CORREGIDO)

## 1. Lista de Objetos de Interfaz a Crear

Para el caso de uso "Desplegar IGU" - Componentes visuales interactivos:

1. **:Navigation** - Barra de navegación con elementos interactivos
2. **:Hero** - Sección hero con contenido visual

**NOTA CRÍTICA:** NO existen objetos separados como ButtonLogin, ButtonPreinscripcion, CardMision, CardVision, CardValores, SeccionEstadisticas. Estos son SOLO JSX inline dentro de Navigation y Hero.

---

## 2. Archivos Relevantes

**Archivos principales analizados:**
- `frontend/components/navigation.tsx` - Barra de navegación con elementos inline
- `frontend/components/hero.tsx` - Componente hero con elementos visuales inline
- `frontend/app/page.tsx` - Página que integra los componentes

---

## 3. Categorización de Clases y Componentes

### **Categoría Única: Componentes de Interfaz Visual**

#### **Navigation**
- **Archivo:** `frontend/components/navigation.tsx`
- **Extiende de:** Función Component de React (export function)
- **Tipo:** UI Component - Navigation Bar (Client Component con "use client")
- **Propiedades/Atributos utilizados:**
  - `isModalOpen: boolean` - Estado local para modal
  - `setIsModalOpen: Dispatch<SetStateAction<boolean>>` - Setter del estado
- **Métodos/Hooks utilizados:**
  - `useState(false)` - Hook para estado del modal
- **Elementos JSX inline renderizados:**
  - **Logo SVG** (líneas 15-17): `<svg>` con path institucional
  - **Texto institucional** (línea 20): `<span>Colegio Excelencia</span>`
  - **Link Login** (líneas 24-29): `<Link href="/login">Login</Link>` - Component de Next.js
  - **Botón Preinscripción** (líneas 30-36): `<button onClick={() => setIsModalOpen(true)}>Preinscríbete</button>`
  - **Modal** (línea 41): `<PreinscriptionModal isOpen={isModalOpen} onClose={...} />`
- **Responsabilidad:** Renderizar barra de navegación completa con todos sus elementos como JSX inline

#### **Hero**
- **Archivo:** `frontend/components/hero.tsx`
- **Extiende de:** Función Component de React (export function)
- **Tipo:** UI Component - Content Display (Server Component por defecto)
- **Propiedades/Atributos utilizados:**
  - Ninguno
- **Métodos/Hooks utilizados:**
  - `Array.map()` - Para iterar valores (línea 80)
  - `Array.map()` - Para iterar estadísticas (línea 105)
- **Elementos JSX inline renderizados:**
  - **Header** (líneas 6-11): `<div>` con `<h1>` y `<p>` de título institucional
  - **Tarjeta Misión** (líneas 17-30): `<div>` con icono SVG, `<h2>` y `<p>` descriptivo
  - **Tarjeta Visión** (líneas 33-51): `<div>` con icono SVG, `<h2>` y `<p>` descriptivo  
  - **Sección Valores** (líneas 54-82):
    - `<svg>` icono de estrella
    - `<h2>Nuestros Valores</h2>`
    - `<div className="grid">` con `valores.map((valor) => <div key={valor}>{valor}</div>)` generando 8 tarjetas
  - **Sección Estadísticas** (líneas 85-110):
    - `<div className="grid">` con `stats.map((stat, index) => <div key={index}>...</div>)` generando 4 cards
- **Responsabilidad:** Renderizar todo el contenido institucional visual en un componente con JSX inline y operaciones map()

---

## 4. Flujo de Secuencia Detallado (CORREGIDO)

**Paso a paso del diagrama basado en código REAL:**

1. **HomePage → Navigation**: HomePage incluye `<Navigation />` en su JSX

2. **Navigation → useState()**: Navigation ejecuta `const [isModalOpen, setIsModalOpen] = useState(false)` (**creación de objeto estado - línea de vida**)

3. **Navigation → Renderizado general**: Navigation renderiza todos sus elementos visuales (logo SVG, texto institucional, botón login, botón preinscripción, modal)

4. **HomePage → Hero**: HomePage incluye `<Hero />` en su JSX

5. **Hero → Renderizado general**: Hero renderiza todo el contenido institucional (header, misión, visión, 8 valores con map(), 4 estadísticas con map())

**Notas CRÍTICAS:**
- **Solo Navigation crea un objeto:** el estado `isModalOpen` con useState (línea de vida en UML)
- **Hero no crea objetos ni usa clases importantes:** solo retorna JSX con operaciones map()
- **NO hay objetos separados** para ButtonLogin, ButtonPreinscripcion, CardMision, etc. - todo es JSX inline
- El diagrama se simplifica mostrando solo la creación del estado y renderizados generales

---

## 5. Diagrama de Secuencia en PlantUML

**Archivo:** `documentos/diagramas-secuencia/diagrama-secuencia-desplegar-igu-CORRECTED.puml`

**CORRECCIONES APLICADAS:**
1. Eliminados todos los objetos ficticios (ButtonLogin, ButtonPreinscripcion, CardMision, etc.)
2. Solo quedan Navigation y Hero como objetos reales
3. Las flechas recursivas muestran hooks reales (useState) y operaciones reales (map)
4. No hay métodos inventados como renderizar(), renderizarIconoSVG(), etc.

---

## 6. Resumen

**Caso de uso:** Desplegar IGU (Interfaz Gráfica de Usuario)  
**Alcance:** Renderizado de componentes visuales de la página inicial

**Objetos creados:** 2 componentes (Navigation, Hero)  
**Clases usadas:** Función Components de React con JSX inline

**Diferencia con "Desplegar Contenidos Web":**
- "Desplegar Contenidos Web" incluye todo el ciclo: Next.js → RootLayout → AuthProvider → HomePage → Navigation + Hero
- "Desplegar IGU" se enfoca SOLO en Navigation y Hero y cómo renderizan sus elementos visuales inline

**Realidad del código:**
- Navigation y Hero son componentes funcionales simples
- Todo su contenido es JSX inline en el return
- Usan hooks básicos (useState) y métodos de array (map)
- NO crean objetos separados para cada elemento visual
