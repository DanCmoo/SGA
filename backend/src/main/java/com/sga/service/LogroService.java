package com.sga.service;

import com.sga.dto.EvaluacionDTO;

import java.util.List;
import java.util.UUID;

public interface LogroService {
    List<EvaluacionDTO> mostrarHistoricoLogros(UUID idEstudiante);
}
