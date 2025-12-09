package com.sga.service;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.HistoricoLogroDTO;
import com.sga.dto.PreinscripcionDTO;

import java.util.List;
import java.util.UUID;

public interface AcudienteService {
    void agregarEstudianteACargo(EstudianteDTO estudiante);
    boolean eliminarEstudianteACargo(UUID idEstudiante);
    List<EstudianteDTO> listarEstudiantesACargo(UUID idAcudiente);
    EstudianteDTO obtenerEstudiante(UUID idEstudiante);
    void registrarPreinscripcion(PreinscripcionDTO preinscripcion);
    
    /**
     * Obtener el histórico de logros de un estudiante
     * Verifica que el acudiente tenga permiso sobre ese estudiante
     */
    List<HistoricoLogroDTO> obtenerHistoricoEstudiante(UUID idAcudiente, UUID idEstudiante);
}
