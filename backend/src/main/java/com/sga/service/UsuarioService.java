package com.sga.service;

import com.sga.dto.CredencialesDTO;
import com.sga.dto.RegistroDTO;
import com.sga.dto.TokenDTO;
import com.sga.dto.UsuarioDTO;

import java.util.UUID;

public interface UsuarioService {
    TokenDTO autenticar(CredencialesDTO credenciales);
    UsuarioDTO ingresarDatosPersonales(UUID idUsuario, RegistroDTO datos);
}
