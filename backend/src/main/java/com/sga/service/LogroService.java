package com.sga.service;

import com.sga.dto.CategoriaLogroDTO;
import com.sga.dto.EvaluacionDTO;
import com.sga.dto.EvaluacionRegistroDTO;
import com.sga.dto.HistoricoLogroDTO;
import com.sga.dto.LogroDTO;

import java.util.List;
import java.util.UUID;

public interface LogroService {
    List<HistoricoLogroDTO> mostrarHistoricoLogros(UUID idEstudiante);
    List<CategoriaLogroDTO> obtenerCategoriasPorGrado(UUID idGrado);
    List<LogroDTO> obtenerLogrosPorCategoria(UUID idCategoria);
    EvaluacionDTO registrarEvaluacion(EvaluacionRegistroDTO evaluacion);
    EvaluacionDTO obtenerEvaluacionPorEstudianteYPeriodo(UUID idEstudiante, UUID idPeriodo);
}
