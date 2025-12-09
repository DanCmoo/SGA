package com.sga.service;

import com.sga.dto.CambioContrasenaDTO;
import com.sga.dto.CredencialesDTO;
import com.sga.dto.RegistroDTO;
import com.sga.dto.TokenDTO;
import com.sga.dto.UsuarioDTO;

import java.util.List;
import java.util.UUID;

public interface UsuarioService {
    TokenDTO autenticar(CredencialesDTO credenciales);
    UsuarioDTO ingresarDatosPersonales(UUID idUsuario, RegistroDTO datos);
    List<UsuarioDTO> listarProfesores();
    void cambiarContrasena(UUID idUsuario, CambioContrasenaDTO cambioContrasena);
}
