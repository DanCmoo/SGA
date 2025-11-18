package com.sga.controller;

import com.sga.dto.CredencialesDTO;
import com.sga.dto.RegistroDTO;
import com.sga.dto.TokenDTO;
import com.sga.dto.UsuarioDTO;
import com.sga.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controlador REST para la gestión de autenticación y datos de usuario.
 * Expone endpoints para inicio de sesión y actualización de datos personales.
 */
@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@Slf4j
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * Endpoint para autenticación de usuarios.
     * Valida las credenciales (correo y contraseña) y retorna un token JWT.
     * 
     * @param credenciales DTO con correo electrónico y contraseña
     * @return TokenDTO con el token de autenticación y datos del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<TokenDTO> autenticar(@RequestBody CredencialesDTO credenciales) {
        log.info("POST /usuarios/login - Intento de autenticación");
        TokenDTO token = usuarioService.autenticar(credenciales);
        return ResponseEntity.ok(token);
    }

    /**
     * Endpoint para que los usuarios completen sus datos personales por primera vez.
     * Utilizado cuando un administrador crea una cuenta y el usuario debe completar su perfil.
     * 
     * @param id UUID del usuario
     * @param datos DTO con los datos personales (nombre, apellido, cédula, fecha de nacimiento)
     * @return UsuarioDTO con los datos actualizados
     */
    @PutMapping("/{id}/datos-iniciales")
    public ResponseEntity<UsuarioDTO> ingresarDatosPersonales(
            @PathVariable UUID id,
            @RequestBody RegistroDTO datos) {
        log.info("PUT /usuarios/{}/datos-iniciales - Actualización de datos personales", id);
        UsuarioDTO usuario = usuarioService.ingresarDatosPersonales(id, datos);
        return ResponseEntity.ok(usuario);
    }

    /**
     * Endpoint para verificar el estado del servidor.
     * No requiere autenticación.
     * 
     * @return Mensaje de confirmación
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Servidor funcionando correctamente");
    }
}
