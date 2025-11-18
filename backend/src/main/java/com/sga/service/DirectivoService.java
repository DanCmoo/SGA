package com.sga.service;

import com.sga.dto.EvaluacionDTO;
import com.sga.dto.GrupoDTO;

import java.util.List;
import java.util.UUID;

public interface DirectivoService {
    List<GrupoDTO> listarGruposPorGrado(String grado);
    List<EvaluacionDTO> obtenerHistoricoLogros(UUID idEstudiante);
}
