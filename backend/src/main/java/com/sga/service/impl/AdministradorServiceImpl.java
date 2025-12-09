package com.sga.service.impl;

import com.sga.dto.UsuarioCreacionDTO;
import com.sga.dto.UsuarioDTO;
import com.sga.model.*;
import com.sga.repository.*;
import com.sga.service.AdministradorService;
import com.sga.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdministradorServiceImpl implements AdministradorService {

    private final UsuarioRepository usuarioRepository;
    private final ProfesorRepository profesorRepository;
    private final AcudienteRepository acudienteRepository;
    private final CoordinadorRepository coordinadorRepository;
    private final DirectorRepository directorRepository;
    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    @Transactional
    public UsuarioDTO crearUsuario(UsuarioCreacionDTO datos) {
        log.info("Creando nuevo usuario con rol: {}", datos.getRol());
        
        // Crear token de usuario
        Token_Usuario token = Token_Usuario.builder()
                .contrasena(passwordEncoder.encode(datos.getContrasenaGenerada()))
                .rol(datos.getRol())
                .build();

        Usuario usuario;
        
        // Crear el tipo de usuario según el rol
        switch (datos.getRol().toUpperCase()) {
            case "PROFESOR":
                Profesor profesor = Profesor.builder()
                        .nombre(datos.getNombre())
                        .nombre2(datos.getNombre2())
                        .apellido(datos.getApellido())
                        .apellido2(datos.getApellido2())
                        .cedula(datos.getCedula())
                        .correoElectronico(datos.getCorreoElectronico())
                        .fechaNacimiento(datos.getFechaNacimiento())
                        .tokenUsuario(token)
                        .build();
                usuario = profesorRepository.save(profesor);
                break;
                
            case "ACUDIENTE":
                Acudiente acudiente = Acudiente.builder()
                        .nombre(datos.getNombre())
                        .nombre2(datos.getNombre2())
                        .apellido(datos.getApellido())
                        .apellido2(datos.getApellido2())
                        .cedula(datos.getCedula())
                        .correoElectronico(datos.getCorreoElectronico())
                        .fechaNacimiento(datos.getFechaNacimiento())
                        .tokenUsuario(token)
                        .estado(false)
                        .build();
                usuario = acudienteRepository.save(acudiente);
                break;
                
            case "COORDINADOR":
                Coordinador coordinador = Coordinador.builder()
                        .nombre(datos.getNombre())
                        .nombre2(datos.getNombre2())
                        .apellido(datos.getApellido())
                        .apellido2(datos.getApellido2())
                        .cedula(datos.getCedula())
                        .correoElectronico(datos.getCorreoElectronico())
                        .fechaNacimiento(datos.getFechaNacimiento())
                        .tokenUsuario(token)
                        .build();
                usuario = coordinadorRepository.save(coordinador);
                break;
                
            case "DIRECTOR":
            case "DIRECTIVO":
                Director director = Director.builder()
                        .nombre(datos.getNombre())
                        .nombre2(datos.getNombre2())
                        .apellido(datos.getApellido())
                        .apellido2(datos.getApellido2())
                        .cedula(datos.getCedula())
                        .correoElectronico(datos.getCorreoElectronico())
                        .fechaNacimiento(datos.getFechaNacimiento())
                        .tokenUsuario(token)
                        .build();
                usuario = directorRepository.save(director);
                break;
                
            case "ADMINISTRADOR":
                Administrador administrador = Administrador.builder()
                        .nombre(datos.getNombre())
                        .nombre2(datos.getNombre2())
                        .apellido(datos.getApellido())
                        .apellido2(datos.getApellido2())
                        .cedula(datos.getCedula())
                        .correoElectronico(datos.getCorreoElectronico())
                        .fechaNacimiento(datos.getFechaNacimiento())
                        .tokenUsuario(token)
                        .build();
                usuario = administradorRepository.save(administrador);
                break;
                
            default:
                throw new IllegalArgumentException("Rol no válido: " + datos.getRol());
        }

        log.info("Usuario creado exitosamente con ID: {}", usuario.getIdUsuario());
        
        // Construir nombre completo para el email
        String nombreCompleto = construirNombreCompleto(datos);
        
        // Enviar email con las credenciales (asíncrono)
        try {
            emailService.enviarCredencialesNuevoUsuario(
                datos.getCorreoElectronico(),
                nombreCompleto,
                datos.getCorreoElectronico(),
                datos.getContrasenaGenerada(),
                datos.getRol()
            );
            log.info("Email de credenciales enviado a: {}", datos.getCorreoElectronico());
        } catch (Exception e) {
            log.error("Error al enviar email de credenciales: {}", e.getMessage());
            // No lanzar excepción, el usuario ya fue creado exitosamente
        }

        return convertirAUsuarioDTO(usuario);
    }
    
    private String construirNombreCompleto(UsuarioCreacionDTO datos) {
        StringBuilder nombreCompleto = new StringBuilder(datos.getNombre());
        if (datos.getNombre2() != null && !datos.getNombre2().isEmpty()) {
            nombreCompleto.append(" ").append(datos.getNombre2());
        }
        nombreCompleto.append(" ").append(datos.getApellido());
        if (datos.getApellido2() != null && !datos.getApellido2().isEmpty()) {
            nombreCompleto.append(" ").append(datos.getApellido2());
        }
        return nombreCompleto.toString();
    }

    @Override
    public UsuarioDTO consultarPorId(UUID idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertirAUsuarioDTO(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodosLosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirAUsuarioDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    private UsuarioDTO convertirAUsuarioDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .nombre2(usuario.getNombre2())
                .apellido(usuario.getApellido())
                .apellido2(usuario.getApellido2())
                .cedula(usuario.getCedula())
                .correoElectronico(usuario.getCorreoElectronico())
                .fechaNacimiento(usuario.getFechaNacimiento())
                .rol(usuario.getTokenUsuario().getRol())
                .build();
    }
}
