package com.sga.service;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.GrupoCreacionDTO;
import com.sga.dto.GrupoDTO;

import java.util.List;
import java.util.UUID;

public interface GrupoService {
    GrupoDTO crear(GrupoCreacionDTO grupoCreacionDTO);
    List<GrupoDTO> listarTodos();
    List<GrupoDTO> listarPorGrado(UUID idGrado);
    GrupoDTO consultar(UUID idGrupo);
    GrupoDTO actualizar(UUID idGrupo, GrupoCreacionDTO grupoCreacionDTO);
    void eliminar(UUID idGrupo);
    void agregarEstudiante(EstudianteDTO estudiante);
    void eliminarEstudiante(UUID idEstudiante);
    EstudianteDTO obtenerEstudiante(UUID idEstudiante);
    List<EstudianteDTO> obtenerListadoEstudiantes(UUID idGrupo);
}
