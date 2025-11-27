# 🚀 INICIO RÁPIDO

## ⚡ 3 Pasos para Iniciar

### 1️⃣ Iniciar Backend
```bash
cd backend
mvn spring-boot:run
```
✅ Verificar: http://localhost:8080/usuarios/health

### 2️⃣ Iniciar Frontend
```bash
cd frontend
npm install          # Solo la primera vez
npm run dev
```
✅ Verificar: http://localhost:3000

### 3️⃣ Probar Login
🌐 Abrir: http://localhost:3000/login

📧 **Usuario**: admin@fis.edu.co  
🔑 **Contraseña**: password123

---

## 📋 Usuarios de Prueba

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| **Administrador** | admin@fis.edu.co | password123 |
| **Coordinador** | coordinador@fis.edu.co | password123 |
| **Director** | director@fis.edu.co | password123 |
| **Profesor** | profesor1@fis.edu.co | password123 |
| **Acudiente** | acudiente1@gmail.com | password123 |

---

## 🛠️ Setup Automático (Windows)

```powershell
cd frontend
.\setup-frontend.ps1
npm run dev
```

---

## 📚 Documentación Completa

- **General**: `frontend/FRONTEND_README.md`
- **Implementación**: `frontend/IMPLEMENTACION_LOGIN.md`
- **Backend**: `backend/LOGIN_GUIDE.md`
- **Resumen**: `frontend/RESUMEN_CAMBIOS.md`

---

## ❓ Problemas Comunes

### Backend no responde
```bash
# Verificar que esté corriendo
curl http://localhost:8080/usuarios/health
```

### Error CORS
Verificar en `backend/src/main/java/com/sga/config/SecurityConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
```

### Frontend no conecta
Verificar `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## ✅ Todo Listo!

El sistema está completamente funcional. Usa las credenciales de prueba para explorar cada rol.

🎉 **Disfruta del Sistema de Gestión Académica**
