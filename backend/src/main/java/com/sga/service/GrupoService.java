package com.sga.service;

import com.sga.dto.EstudianteDTO;

import java.util.List;
import java.util.UUID;

public interface GrupoService {
    void agregarEstudiante(EstudianteDTO estudiante);
    void eliminarEstudiante(UUID idEstudiante);
    EstudianteDTO obtenerEstudiante(UUID idEstudiante);
    List<EstudianteDTO> obtenerListadoEstudiantes(UUID idGrupo);
}
