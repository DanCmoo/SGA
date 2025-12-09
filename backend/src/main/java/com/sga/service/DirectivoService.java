package com.sga.service;

import com.sga.dto.EvaluacionDTO;
import com.sga.dto.EstudianteDTO;
import com.sga.dto.GrupoDTO;
import com.sga.dto.HojaDeVidaDTO;

import java.util.List;
import java.util.UUID;

public interface DirectivoService {
    List<GrupoDTO> listarGruposPorGrado(UUID idGrado);
    List<EstudianteDTO> listarEstudiantesDeGrupo(UUID idGrupo);
    HojaDeVidaDTO obtenerHojaDeVida(UUID idEstudiante);
    HojaDeVidaDTO actualizarHojaDeVida(UUID idEstudiante, HojaDeVidaDTO hojaDeVidaDTO);
    List<EvaluacionDTO> obtenerHistoricoLogros(UUID idEstudiante);
}
