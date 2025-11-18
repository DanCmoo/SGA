package com.sga.service;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.PreinscripcionDTO;

import java.util.List;
import java.util.UUID;

public interface AcudienteService {
    void agregarEstudianteACargo(EstudianteDTO estudiante);
    boolean eliminarEstudianteACargo(UUID idEstudiante);
    List<EstudianteDTO> listarEstudiantesACargo(UUID idAcudiente);
    EstudianteDTO obtenerEstudiante(UUID idEstudiante);
    void registrarPreinscripcion(PreinscripcionDTO preinscripcion);
}
