package com.sga.service.impl;

import com.sga.dto.CambioContrasenaDTO;
import com.sga.dto.CredencialesDTO;
import com.sga.dto.RegistroDTO;
import com.sga.dto.TokenDTO;
import com.sga.dto.UsuarioDTO;
import com.sga.exception.CredencialesInvalidasException;
import com.sga.exception.UsuarioNoEncontradoException;
import com.sga.model.Profesor;
import com.sga.model.Token_Usuario;
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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

        log.debug("Token de usuario encontrado. Rol: {}", usuario.getTokenUsuario().getRol());
        
        // Validar contraseña
        log.debug("Validando contraseña para usuario: {}", credenciales.getCorreoElectronico());
        if (!passwordEncoder.matches(credenciales.getContrasena(), usuario.getTokenUsuario().getContrasena())) {
            log.warn("Contraseña incorrecta para el usuario: {}", credenciales.getCorreoElectronico());
            throw new CredencialesInvalidasException("La contraseña es incorrecta");
        }

        log.debug("Contraseña validada correctamente");
        
        // Generar token JWT
        log.debug("Generando token JWT para usuario: {}", usuario.getCorreoElectronico());
        CustomUserDetails userDetails = new CustomUserDetails(usuario);
        log.debug("CustomUserDetails creado");
        
        String token = jwtService.generateToken(userDetails);
        log.debug("Token JWT generado exitosamente: {}", token.substring(0, 20) + "...");
        
        // Construir DTO del usuario
        log.debug("Convirtiendo usuario a DTO");
        UsuarioDTO usuarioDTO = convertirAUsuarioDTO(usuario);
        log.debug("Usuario convertido a DTO exitosamente");
        
        log.info("Autenticación exitosa para el usuario: {} con rol: {}", 
                usuario.getCorreoElectronico(), usuario.getTokenUsuario().getRol());

        // Retornar token de autenticación
        log.debug("Construyendo respuesta TokenDTO");
        TokenDTO response = TokenDTO.builder()
                .token(token)
                .tipo("Bearer")
                .expiracion(LocalDateTime.now().plusDays(1))
                .usuario(usuarioDTO)
                .requiereCambioContrasena(usuario.getTokenUsuario().getRequiereCambioContrasena())
                .build();
        log.debug("TokenDTO construido exitosamente");
        
        return response;
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
        UsuarioDTO.UsuarioDTOBuilder builder = UsuarioDTO.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .nombre2(usuario.getNombre2())
                .apellido(usuario.getApellido())
                .apellido2(usuario.getApellido2())
                .cedula(usuario.getCedula())
                .correoElectronico(usuario.getCorreoElectronico())
                .fechaNacimiento(usuario.getFechaNacimiento())
                .rol(usuario.getTokenUsuario().getRol());
        
        // Si es profesor, incluir información específica
        if (usuario instanceof Profesor) {
            Profesor profesor = (Profesor) usuario;
            builder.profesor(UsuarioDTO.ProfesorInfoDTO.builder()
                    .grupoAsignado(profesor.getGrupoAsignado())
                    .build());
        }
        
        return builder.build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarProfesores() {
        log.info("Listando profesores disponibles (sin grupo asignado)");
        return usuarioRepository.findByTokenUsuarioRol("PROFESOR").stream()
                .filter(usuario -> {
                    if (usuario instanceof Profesor) {
                        Profesor profesor = (Profesor) usuario;
                        // Solo incluir profesores sin grupo asignado
                        return profesor.getGrupoAsignado() == null || profesor.getGrupoAsignado().isEmpty();
                    }
                    return false;
                })
                .map(this::convertirAUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cambiarContrasena(UUID idUsuario, CambioContrasenaDTO cambioContrasena) {
        log.info("Cambiando contraseña para usuario: {}", idUsuario);

        // Validaciones
        if (cambioContrasena.getContrasenaNueva() == null || cambioContrasena.getContrasenaNueva().length() < 8) {
            throw new IllegalArgumentException("La nueva contraseña debe tener al menos 8 caracteres");
        }

        if (!cambioContrasena.getContrasenaNueva().equals(cambioContrasena.getConfirmarContrasena())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

        Token_Usuario token = usuario.getTokenUsuario();
        if (token == null) {
            throw new IllegalStateException("El usuario no tiene credenciales configuradas");
        }

        // Verificar contraseña actual si se proporcionó
        if (cambioContrasena.getContrasenaActual() != null && !cambioContrasena.getContrasenaActual().isEmpty()) {
            if (!passwordEncoder.matches(cambioContrasena.getContrasenaActual(), token.getContrasena())) {
                throw new CredencialesInvalidasException("La contraseña actual es incorrecta");
            }
        }

        // Actualizar contraseña y marcar como no requiere cambio
        token.setContrasena(passwordEncoder.encode(cambioContrasena.getContrasenaNueva()));
        token.setRequiereCambioContrasena(false);

        // Spring Data JPA actualizará automáticamente por la relación
        usuarioRepository.save(usuario);

        log.info("Contraseña actualizada exitosamente para usuario: {}", idUsuario);
    }
}
