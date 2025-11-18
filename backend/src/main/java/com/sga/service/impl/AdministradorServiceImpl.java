package com.sga.service.impl;

import com.sga.dto.UsuarioCreacionDTO;
import com.sga.dto.UsuarioDTO;
import com.sga.model.*;
import com.sga.repository.*;
import com.sga.service.AdministradorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

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

    @Override
    @Transactional
    public UsuarioDTO crearUsuario(UsuarioCreacionDTO datos) {
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
                        .apellido(datos.getApellido())
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
                        .apellido(datos.getApellido())
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
                        .apellido(datos.getApellido())
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
                        .apellido(datos.getApellido())
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
                        .apellido(datos.getApellido())
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

        return convertirAUsuarioDTO(usuario);
    }

    @Override
    public UsuarioDTO consultarPorId(UUID idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertirAUsuarioDTO(usuario);
    }

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
