package com.sga.service.impl;

import com.sga.dto.CredencialesDTO;
import com.sga.dto.RegistroDTO;
import com.sga.dto.TokenDTO;
import com.sga.dto.UsuarioDTO;
import com.sga.model.Usuario;
import com.sga.repository.UsuarioRepository;
import com.sga.security.JwtService;
import com.sga.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public TokenDTO autenticar(CredencialesDTO credenciales) {
        Usuario usuario = usuarioRepository.findByCorreoElectronico(credenciales.getCorreoElectronico())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(credenciales.getContrasena(), usuario.getTokenUsuario().getContrasena())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = jwtService.generateToken(new CustomUserDetails(usuario));

        UsuarioDTO usuarioDTO = UsuarioDTO.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .cedula(usuario.getCedula())
                .correoElectronico(usuario.getCorreoElectronico())
                .fechaNacimiento(usuario.getFechaNacimiento())
                .rol(usuario.getTokenUsuario().getRol())
                .build();

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
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(datos.getNombre());
        usuario.setApellido(datos.getApellido());
        usuario.setCedula(datos.getCedula());
        usuario.setFechaNacimiento(datos.getFechaNacimiento());

        usuario = usuarioRepository.save(usuario);

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
