package com.sga.service.impl;

import com.sga.dto.CredencialesDTO;
import com.sga.dto.RegistroDTO;
import com.sga.dto.TokenDTO;
import com.sga.dto.UsuarioDTO;
import com.sga.exception.CredencialesInvalidasException;
import com.sga.exception.UsuarioNoEncontradoException;
import com.sga.model.Usuario;
import com.sga.repository.UsuarioRepository;
import com.sga.security.JwtService;
import com.sga.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional(readOnly = true)
    public TokenDTO autenticar(CredencialesDTO credenciales) {
        log.info("Intento de autenticación para el usuario: {}", credenciales.getCorreoElectronico());
        
        // Validar que las credenciales no estén vacías
        if (credenciales.getCorreoElectronico() == null || credenciales.getCorreoElectronico().trim().isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio");
        }
        
        if (credenciales.getContrasena() == null || credenciales.getContrasena().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        // Buscar usuario por correo electrónico
        Usuario usuario = usuarioRepository.findByCorreoElectronico(credenciales.getCorreoElectronico())
                .orElseThrow(() -> {
                    log.warn("Usuario no encontrado: {}", credenciales.getCorreoElectronico());
                    return new UsuarioNoEncontradoException(
                        "No existe una cuenta asociada a este correo electrónico"
                    );
                });

        // Verificar que el usuario tenga token de autenticación
        if (usuario.getTokenUsuario() == null) {
            log.error("Usuario sin token de autenticación: {}", usuario.getIdUsuario());
            throw new IllegalStateException("El usuario no tiene credenciales configuradas");
        }

        // Validar contraseña
        if (!passwordEncoder.matches(credenciales.getContrasena(), usuario.getTokenUsuario().getContrasena())) {
            log.warn("Contraseña incorrecta para el usuario: {}", credenciales.getCorreoElectronico());
            throw new CredencialesInvalidasException("La contraseña es incorrecta");
        }

        // Generar token JWT
        CustomUserDetails userDetails = new CustomUserDetails(usuario);
        String token = jwtService.generateToken(userDetails);
        
        log.info("Autenticación exitosa para el usuario: {} con rol: {}", 
                usuario.getCorreoElectronico(), usuario.getTokenUsuario().getRol());

        // Construir DTO del usuario
        UsuarioDTO usuarioDTO = convertirAUsuarioDTO(usuario);

        // Retornar token de autenticación
        return TokenDTO.builder()
                .token(token)
                .tipo("Bearer")
                .expiracion(LocalDateTime.now().plusDays(1))
                .usuario(usuarioDTO)
                .build();
    }

    @Override
    @Transactional
    public UsuarioDTO ingresarDatosPersonales(UUID idUsuario, RegistroDTO datos) {
        log.info("Actualizando datos personales para el usuario: {}", idUsuario);
        
        // Validar datos de entrada
        validarDatosPersonales(datos);
        
        // Buscar usuario
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException(
                    "No se encontró el usuario con ID: " + idUsuario
                ));

        // Verificar que la cédula no esté en uso por otro usuario
        if (datos.getCedula() != null && !datos.getCedula().equals(usuario.getCedula())) {
            if (usuarioRepository.existsByCedula(datos.getCedula())) {
                throw new IllegalArgumentException("La cédula ya está registrada en el sistema");
            }
        }

        // Actualizar datos personales
        usuario.setNombre(datos.getNombre());
        usuario.setApellido(datos.getApellido());
        usuario.setCedula(datos.getCedula());
        usuario.setFechaNacimiento(datos.getFechaNacimiento());

        usuario = usuarioRepository.save(usuario);
        
        log.info("Datos personales actualizados exitosamente para: {} {}", 
                usuario.getNombre(), usuario.getApellido());

        return convertirAUsuarioDTO(usuario);
    }

    /**
     * Valida los datos personales del usuario
     */
    private void validarDatosPersonales(RegistroDTO datos) {
        if (datos.getNombre() == null || datos.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        
        if (datos.getApellido() == null || datos.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        
        if (datos.getCedula() == null || datos.getCedula().trim().isEmpty()) {
            throw new IllegalArgumentException("La cédula es obligatoria");
        }
        
        // Validar formato de cédula (6-10 dígitos numéricos)
        if (!datos.getCedula().matches("\\d{6,10}")) {
            throw new IllegalArgumentException("La cédula debe contener entre 6 y 10 dígitos numéricos");
        }
        
        if (datos.getFechaNacimiento() == null) {
            throw new IllegalArgumentException("La fecha de nacimiento es obligatoria");
        }
        
        // Validar que la fecha de nacimiento sea válida (no futura)
        if (datos.getFechaNacimiento().isAfter(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de nacimiento no puede ser futura");
        }
    }

    /**
     * Convierte una entidad Usuario a UsuarioDTO
     */
    private UsuarioDTO convertirAUsuarioDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .cedula(usuario.getCedula())
                .correoElectronico(usuario.getCorreoElectronico())
                .fechaNacimiento(usuario.getFechaNacimiento())
                .rol(usuario.getTokenUsuario().getRol())
                .build();
    }
}
