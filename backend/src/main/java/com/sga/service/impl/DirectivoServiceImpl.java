package com.sga.service.impl;

import com.sga.dto.*;
import com.sga.exception.ResourceNotFoundException;
import com.sga.model.Estudiante;
import com.sga.model.Grupo;
import com.sga.model.HojaDeVidaEstudiante;
import com.sga.repository.*;
import com.sga.service.DirectivoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DirectivoServiceImpl implements DirectivoService {

    private final GrupoRepository grupoRepository;
    private final EstudianteRepository estudianteRepository;
    private final HojaDeVidaEstudianteRepository hojaDeVidaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GrupoDTO> listarGruposPorGrado(UUID idGrado) {
        log.info("Listando grupos del grado: {}", idGrado);
        
        List<Grupo> grupos = grupoRepository.findByGrado_IdGrado(idGrado);
        
        return grupos.stream()
                .map(this::convertirGrupoADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstudianteDTO> listarEstudiantesDeGrupo(UUID idGrupo) {
        log.info("Listando estudiantes del grupo: {}", idGrupo);
        
        List<Estudiante> estudiantes = estudianteRepository.findByGrupoAsignadoIdGrupo(idGrupo);
        
        return estudiantes.stream()
                .map(this::convertirEstudianteADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public HojaDeVidaDTO obtenerHojaDeVida(UUID idEstudiante) {
        log.info("Obteniendo hoja de vida del estudiante: {}", idEstudiante);
        
        Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + idEstudiante));
        
        HojaDeVidaEstudiante hojaDeVida = estudiante.getHojaDeVida();
        if (hojaDeVida == null) {
            throw new ResourceNotFoundException("El estudiante no tiene hoja de vida registrada");
        }
        
        return convertirHojaDeVidaADTO(estudiante, hojaDeVida);
    }

    @Override
    public HojaDeVidaDTO actualizarHojaDeVida(UUID idEstudiante, HojaDeVidaDTO dto) {
        log.info("Actualizando hoja de vida del estudiante: {}", idEstudiante);
        
        Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + idEstudiante));
        
        HojaDeVidaEstudiante hojaDeVida = estudiante.getHojaDeVida();
        if (hojaDeVida == null) {
            throw new ResourceNotFoundException("El estudiante no tiene hoja de vida registrada");
        }
        
        // Actualizar campos editables
        if (dto.getDetallesMedicos() != null) {
            String detallesMedicos = String.join(",", dto.getDetallesMedicos());
            hojaDeVida.setDetallesMedicos(detallesMedicos);
        }
        
        if (dto.getObservacionesAprendizaje() != null) {
            String observaciones = String.join(",", dto.getObservacionesAprendizaje());
            hojaDeVida.setObservacionesAprendizaje(observaciones);
        }
        
        hojaDeVidaRepository.save(hojaDeVida);
        
        log.info("Hoja de vida actualizada exitosamente");
        return convertirHojaDeVidaADTO(estudiante, hojaDeVida);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EvaluacionDTO> obtenerHistoricoLogros(UUID idEstudiante) {
        log.info("Obteniendo histórico de logros del estudiante: {}", idEstudiante);
        // Esta funcionalidad ya está implementada en LogroService
        // Por ahora retornamos lista vacía, se puede delegar a LogroService si es necesario
        return List.of();
    }

    private GrupoDTO convertirGrupoADTO(Grupo grupo) {
        int cantidadEstudiantes = estudianteRepository.countByGrupoAsignadoIdGrupo(grupo.getIdGrupo());
        
        return GrupoDTO.builder()
                .idGrupo(grupo.getIdGrupo())
                .nombre(grupo.getNombreGrupo())
                .idGrado(grupo.getGrado().getIdGrado())
                .nombreGrado(grupo.getGrado().getNombreGrado())
                .idProfesor(grupo.getDirectorDeGrupo() != null ? grupo.getDirectorDeGrupo().getIdUsuario() : null)
                .nombreProfesor(grupo.getDirectorDeGrupo() != null ? 
                    grupo.getDirectorDeGrupo().getNombre() + " " + grupo.getDirectorDeGrupo().getApellido() : null)
                .cantidadEstudiantes(cantidadEstudiantes)
                .build();
    }

    private EstudianteDTO convertirEstudianteADTO(Estudiante estudiante) {
        return EstudianteDTO.builder()
                .idEstudiante(estudiante.getIdEstudiante())
                .nombre(estudiante.getNombre())
                .nombre2(estudiante.getNombre2())
                .apellido(estudiante.getApellido())
                .apellido2(estudiante.getApellido2())
                .numeroDocumento(estudiante.getNumeroDocumento())
                .idGrado(estudiante.getGrupoAsignado() != null && estudiante.getGrupoAsignado().getGrado() != null ? 
                    estudiante.getGrupoAsignado().getGrado().getIdGrado() : null)
                .nombreGrupo(estudiante.getGrupoAsignado() != null ? 
                    estudiante.getGrupoAsignado().getNombreGrupo() : null)
                .build();
    }

    private HojaDeVidaDTO convertirHojaDeVidaADTO(Estudiante estudiante, HojaDeVidaEstudiante hojaDeVida) {
        // Convertir strings separados por coma a listas
        List<String> detallesMedicos = hojaDeVida.getDetallesMedicos() != null && !hojaDeVida.getDetallesMedicos().isEmpty() ? 
                Arrays.asList(hojaDeVida.getDetallesMedicos().split(",")) : List.of();
        
        List<String> observaciones = hojaDeVida.getObservacionesAprendizaje() != null && !hojaDeVida.getObservacionesAprendizaje().isEmpty() ? 
                Arrays.asList(hojaDeVida.getObservacionesAprendizaje().split(",")) : List.of();
        
        String nombreCompleto = estudiante.getNombre() + 
                (estudiante.getNombre2() != null ? " " + estudiante.getNombre2() : "") + 
                " " + estudiante.getApellido() +
                (estudiante.getApellido2() != null ? " " + estudiante.getApellido2() : "");
        
        String nombreAcudiente = estudiante.getAcudiente() != null ? 
                estudiante.getAcudiente().getNombre() + " " + estudiante.getAcudiente().getApellido() : null;
        
        return HojaDeVidaDTO.builder()
                .idHojaDeVida(hojaDeVida.getIdHojaDeVida())
                .idEstudiante(estudiante.getIdEstudiante())
                .nombreCompleto(nombreCompleto)
                .nombreAcudiente(nombreAcudiente)
                .fechaNacimiento(hojaDeVida.getFechaNacimiento())
                .documentoIdentidad(hojaDeVida.getDocumentoIdentidad())
                .detallesMedicos(detallesMedicos)
                .observacionesAprendizaje(observaciones)
                .build();
    }
}
