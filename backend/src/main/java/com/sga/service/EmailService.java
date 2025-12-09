package com.sga.service;

public interface EmailService {
    /**
     * Envía un email de bienvenida a un nuevo usuario con sus credenciales
     * 
     * @param destinatario Email del destinatario
     * @param nombreCompleto Nombre completo del usuario
     * @param correoUsuario Email de acceso al sistema
     * @param contrasena Contraseña temporal generada
     * @param rol Rol asignado al usuario
     */
    void enviarCredencialesNuevoUsuario(
        String destinatario, 
        String nombreCompleto, 
        String correoUsuario, 
        String contrasena, 
        String rol
    );
}
