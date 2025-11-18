package com.sga.service;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.PreinscripcionCompletoDTO;

import java.util.List;
import java.util.UUID;

public interface AdmisionesService {
    void aprobarAspirante(UUID idPreinscripcion);
    void asignarEstudianteAGrupo(UUID idEstudiante, UUID idGrupo);
    void asignarProfesorAGrupo(UUID idProfesor, UUID idGrupo);
    List<EstudianteDTO> listarAdmitidos();
    List<PreinscripcionCompletoDTO> listarPreinscritos();
}
