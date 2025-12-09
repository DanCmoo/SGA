# 📧 Configuración del Servicio de Email

## Descripción
El sistema ahora envía automáticamente un email personalizado cuando el administrador crea un nuevo usuario. El email contiene las credenciales de acceso (correo y contraseña temporal) junto con el rol asignado.

---

## ⚙️ Configuración Requerida

### Opción 1: Variables de Entorno (Recomendado para Producción)

Configura las siguientes variables de entorno antes de ejecutar el backend:

```powershell
# Windows PowerShell
$env:MAIL_USERNAME="institucion@fis.edu.co"
$env:MAIL_PASSWORD="tu_contraseña_de_aplicación"
```

```bash
# Linux/Mac
export MAIL_USERNAME="institucion@fis.edu.co"
export MAIL_PASSWORD="tu_contraseña_de_aplicación"
```

### Opción 2: Modificar application.yml (Solo para Desarrollo)

Edita el archivo `src/main/resources/application.yml`:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: institucion@fis.edu.co  # Tu email
    password: tu_contraseña_aquí      # Tu contraseña de aplicación
```

---

## 🔐 Configuración de Gmail

Si usas Gmail, necesitas crear una **contraseña de aplicación**:

### Pasos:

1. **Habilita la verificación en 2 pasos** en tu cuenta de Google
   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en dos pasos"

2. **Genera una contraseña de aplicación**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "SGA Backend"
   - Copia la contraseña generada (16 caracteres sin espacios)

3. **Usa esa contraseña** en la configuración del backend

---

## 📨 Otros Proveedores de Email

### Outlook/Office 365
```yaml
spring:
  mail:
    host: smtp.office365.com
    port: 587
    username: tu_email@outlook.com
    password: tu_contraseña
```

### Yahoo
```yaml
spring:
  mail:
    host: smtp.mail.yahoo.com
    port: 587
    username: tu_email@yahoo.com
    password: tu_contraseña_de_aplicación
```

### SMTP Personalizado
```yaml
spring:
  mail:
    host: smtp.tudominio.com
    port: 587  # o 465 para SSL
    username: noreply@tudominio.com
    password: tu_contraseña
```

---

## 🧪 Probar el Envío de Emails

### 1. Inicia el backend
```powershell
cd backend
mvn spring-boot:run
```

### 2. Crea un usuario desde el frontend o con curl

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:8080/api/admin/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_ADMIN" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "cedula": "1234567890",
    "correoElectronico": "juan.perez@gmail.com",
    "fechaNacimiento": "1990-01-15",
    "rol": "PROFESOR",
    "contrasenaGenerada": "TempPass123!"
  }'
```

### 3. Verifica los logs
Busca en la consola del backend:
```
Usuario creado exitosamente con ID: ...
Email de credenciales enviado a: juan.perez@gmail.com
Email de credenciales enviado exitosamente a: juan.perez@gmail.com
```

### 4. Revisa el email
El usuario recibirá un email con:
- ✉️ Asunto: "Bienvenido al Sistema de Gestión Académica - FIS"
- 📋 Correo de acceso
- 🔑 Contraseña temporal
- 👤 Rol asignado
- 🔗 Enlace directo al login

---

## 🎨 Contenido del Email

El email incluye:

- **Diseño profesional** con los colores institucionales
- **Información clara** de las credenciales
- **Advertencia de seguridad** para cambiar la contraseña
- **Botón de acceso directo** al sistema
- **Información del rol** asignado

---

## 🔧 Solución de Problemas

### ❌ Error: "Authentication failed"
- Verifica que el usuario y contraseña sean correctos
- Si usas Gmail, asegúrate de usar una contraseña de aplicación (no la contraseña normal)
- Confirma que la verificación en 2 pasos esté habilitada

### ❌ Error: "Connection timeout"
- Verifica tu conexión a internet
- Confirma que el puerto (587 o 465) no esté bloqueado por firewall
- Prueba con otro proveedor de email

### ❌ Email no llega
- Revisa la carpeta de SPAM/Correo no deseado
- Verifica que el email del destinatario sea correcto
- Revisa los logs del backend para errores

### ⚠️ El usuario se crea pero el email no se envía
- Esto es normal, el sistema no falla si el email falla
- Revisa los logs para ver el error específico
- El administrador puede comunicar las credenciales manualmente

---

## 📝 Notas Importantes

1. **Asíncrono**: El envío de email es asíncrono, no bloquea la creación del usuario
2. **Sin fallos**: Si el email falla, el usuario se crea igual
3. **Logging**: Todos los intentos de envío se registran en los logs
4. **Seguridad**: Nunca commitear contraseñas en git
5. **Variables de entorno**: Siempre usar variables de entorno en producción

---

## 🔒 Seguridad

- ✅ Las contraseñas están encriptadas en la base de datos
- ✅ El email se envía de forma asíncrona
- ✅ Los errores de email no exponen información sensible
- ✅ Las credenciales SMTP deben estar en variables de entorno
- ✅ Usar contraseñas de aplicación, no contraseñas de cuenta principal

---

## 📞 Soporte

Si tienes problemas con la configuración del email, contacta al equipo de desarrollo.
