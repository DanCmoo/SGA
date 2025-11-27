package com.sga.service;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.PreinscripcionCompletoDTO;
import com.sga.dto.PreinscripcionDTO;

import java.util.List;
import java.util.UUID;

public interface AdmisionesService {
    PreinscripcionCompletoDTO crearPreinscripcion(PreinscripcionDTO preinscripcionDTO);
    void aprobarAspirante(UUID idPreinscripcion);
    void rechazarAspirante(UUID idPreinscripcion);
    void asignarEstudianteAGrupo(UUID idEstudiante, UUID idGrupo);
    void asignarProfesorAGrupo(UUID idProfesor, UUID idGrupo);
    List<EstudianteDTO> listarAdmitidos();
    List<PreinscripcionCompletoDTO> listarPreinscritos();
    List<EstudianteDTO> listarEstudiantesAprobadosSinGrupo();
}
