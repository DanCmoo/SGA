package com.sga.service;

import com.sga.dto.UsuarioCreacionDTO;
import com.sga.dto.UsuarioDTO;

import java.util.List;
import java.util.UUID;

public interface AdministradorService {
    UsuarioDTO crearUsuario(UsuarioCreacionDTO datos);
    UsuarioDTO consultarPorId(UUID idUsuario);
    List<UsuarioDTO> listarTodosLosUsuarios();
}
