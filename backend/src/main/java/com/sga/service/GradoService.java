package com.sga.service;

import com.sga.dto.GradoDTO;

import java.util.List;
import java.util.UUID;

public interface GradoService {
    GradoDTO crear(GradoDTO gradoDTO);
    List<GradoDTO> listarTodos();
    GradoDTO consultar(UUID idGrado);
    GradoDTO actualizar(UUID idGrado, GradoDTO gradoDTO);
    void eliminar(UUID idGrado);
}
