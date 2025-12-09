package com.sga.service.impl;

import com.sga.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${email.from}")
    private String emailFrom;

    @Value("${email.from-name}")
    private String emailFromName;

    @Override
    @Async
    public void enviarCredencialesNuevoUsuario(
            String destinatario,
            String nombreCompleto,
            String correoUsuario,
            String contrasena,
            String rol) {
        
        try {
            log.info("Iniciando envío de email a: {}", destinatario);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailFrom, emailFromName);
            helper.setTo(destinatario);
            helper.setSubject("Bienvenido al Sistema de Gestión Académica - FIS");

            String contenidoHtml = construirEmailBienvenida(nombreCompleto, correoUsuario, contrasena, rol);
            helper.setText(contenidoHtml, true);

            log.info("Email preparado, enviando...");
            mailSender.send(message);
            log.info("Email de credenciales enviado exitosamente a: {}", destinatario);

        } catch (MessagingException e) {
            log.error("Error de mensajería al enviar email a {}: {}", destinatario, e.getMessage(), e);
            log.error("Causa raíz: {}", e.getCause() != null ? e.getCause().getMessage() : "No disponible");
        } catch (UnsupportedOperationException e) {
            log.error("Operación no soportada al enviar email: {}", e.getMessage(), e);
            log.error("Verificar configuración de encoding y formato de email");
        } catch (IllegalArgumentException e) {
            log.error("Argumento inválido al construir email: {}", e.getMessage(), e);
            log.error("Parámetros - Destinatario: {}, Nombre: {}, Correo: {}, Rol: {}", 
                     destinatario, nombreCompleto, correoUsuario, rol);
        } catch (Exception e) {
            log.error("Error inesperado al enviar email a {}: {} - Tipo: {}", 
                     destinatario, e.getMessage(), e.getClass().getSimpleName(), e);
            log.error("Stack trace completo:", e);
        }
    }

    private String construirEmailBienvenida(String nombreCompleto, String correoUsuario, String contrasena, String rol) {
        String rolFormateado = formatearRol(rol);
        
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f5f5f0;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(37, 52, 64, 0.15);
                    }
                    .header {
                        background: linear-gradient(135deg, #253440 0%%, #5D4E3C 100%%);
                        padding: 40px 30px;
                        text-align: center;
                        color: white;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 600;
                    }
                    .header p {
                        margin: 10px 0 0 0;
                        font-size: 16px;
                        color: #E8DCC8;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #253440;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 16px;
                        color: #5D4E3C;
                        line-height: 1.6;
                        margin-bottom: 30px;
                    }
                    .credentials-box {
                        background: linear-gradient(135deg, #F5F0E8 0%%, #E8DCC8 100%%);
                        border-left: 4px solid #B8734C;
                        padding: 25px;
                        border-radius: 8px;
                        margin: 25px 0;
                    }
                    .credential-item {
                        margin: 15px 0;
                    }
                    .credential-label {
                        font-weight: 600;
                        color: #632024;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .credential-value {
                        font-size: 18px;
                        color: #253440;
                        font-weight: 700;
                        padding: 10px;
                        background-color: white;
                        border-radius: 6px;
                        display: inline-block;
                        font-family: 'Courier New', monospace;
                    }
                    .role-badge {
                        display: inline-block;
                        background: linear-gradient(135deg, #632024 0%%, #8B2E34 100%%);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-weight: 600;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .warning {
                        background-color: #FFF8DC;
                        border-left: 4px solid #D4A574;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 6px;
                    }
                    .warning p {
                        margin: 0;
                        color: #8B6F47;
                        font-size: 14px;
                    }
                    .footer {
                        background-color: #F5F0E8;
                        padding: 30px;
                        text-align: center;
                        border-top: 3px solid #B8734C;
                    }
                    .footer p {
                        margin: 5px 0;
                        color: #5D4E3C;
                        font-size: 14px;
                    }
                    .link-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #253440 0%%, #5D4E3C 100%%);
                        color: white;
                        padding: 14px 32px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 20px 0;
                        transition: transform 0.2s;
                        box-shadow: 0 4px 12px rgba(37, 52, 64, 0.3);
                    }
                    .link-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 16px rgba(37, 52, 64, 0.4);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎓 Bienvenido al Sistema</h1>
                        <p>Fundación Institución Salesiana - FIS</p>
                    </div>
                    
                    <div class="content">
                        <p class="greeting">Hola <strong>%s</strong>,</p>
                        
                        <p class="message">
                            ¡Te damos la bienvenida al Sistema de Gestión Académica de la Fundación Institución Salesiana!
                            Se ha creado una cuenta para ti con el siguiente rol:
                        </p>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <span class="role-badge">%s</span>
                        </div>
                        
                        <div class="credentials-box">
                            <h3 style="margin-top: 0; color: #253440;">📋 Tus Credenciales de Acceso</h3>
                            
                            <div class="credential-item">
                                <span class="credential-label">📧 Correo Electrónico</span>
                                <div class="credential-value">%s</div>
                            </div>
                            
                            <div class="credential-item">
                                <span class="credential-label">🔑 Contraseña Temporal</span>
                                <div class="credential-value">%s</div>
                            </div>
                        </div>
                        
                        <div class="warning">
                            <p>
                                ⚠️ <strong>Importante:</strong> Por tu seguridad, te recomendamos cambiar esta contraseña 
                                temporal en tu primer inicio de sesión.
                            </p>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="http://localhost:3000/login" class="link-button">
                                🚀 Acceder al Sistema
                            </a>
                        </div>
                        
                        <p class="message">
                            Si tienes alguna duda o necesitas ayuda, no dudes en contactar con el equipo de soporte técnico.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>Sistema de Gestión Académica</strong></p>
                        <p>Fundación Institución Salesiana - FIS</p>
                        <p style="font-size: 12px; color: #8B7355; margin-top: 10px;">
                            Este es un correo automático, por favor no responder.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(nombreCompleto, rolFormateado, correoUsuario, contrasena);
    }

    private String formatearRol(String rol) {
        return switch (rol.toUpperCase()) {
            case "PROFESOR" -> "Profesor";
            case "COORDINADOR" -> "Coordinador";
            case "DIRECTOR", "DIRECTIVO" -> "Director";
            case "ADMINISTRADOR" -> "Administrador";
            case "ACUDIENTE" -> "Acudiente";
            default -> rol;
        };
    }
}
