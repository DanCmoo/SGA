package com.sga.service;

import com.sga.dto.BoletinDTO;
import com.sga.dto.EvaluacionDTO;

import java.util.UUID;

public interface BoletinService {
    void agregarCategoriaEvaluada(EvaluacionDTO evaluacion);
    boolean eliminarCategoriaEvaluada(UUID idCategoria);
    byte[] generarArchivoPDFBoletin(UUID idBoletin);
    BoletinDTO generarBoletin(UUID idEstudiante, String periodo);
    EvaluacionDTO obtenerCategoriaEvaluada(UUID idCategoria);
}
