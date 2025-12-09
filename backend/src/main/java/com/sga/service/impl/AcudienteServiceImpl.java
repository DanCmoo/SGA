package com.sga.service.impl;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.HistoricoLogroDTO;
import com.sga.dto.PreinscripcionDTO;
import com.sga.exception.ResourceNotFoundException;
import com.sga.model.Acudiente;
import com.sga.model.Estudiante;
import com.sga.repository.AcudienteRepository;
import com.sga.repository.EstudianteRepository;
import com.sga.service.AcudienteService;
import com.sga.service.LogroService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AcudienteServiceImpl implements AcudienteService {

    private final AcudienteRepository acudienteRepository;
    private final EstudianteRepository estudianteRepository;
    private final LogroService logroService;

    @Override
    public void agregarEstudianteACargo(EstudianteDTO estudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public boolean eliminarEstudianteACargo(UUID idEstudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstudianteDTO> listarEstudiantesACargo(UUID idAcudiente) {
        log.info("Listando estudiantes a cargo del acudiente: {}", idAcudiente);
        
        Acudiente acudiente = acudienteRepository.findById(idAcudiente)
                .orElseThrow(() -> new ResourceNotFoundException("Acudiente no encontrado con ID: " + idAcudiente));
        
        return acudiente.getEstudiantesACargo().stream()
                .map(this::convertirEstudianteADTO)
                .collect(Collectors.toList());
    }

    @Override
    public EstudianteDTO obtenerEstudiante(UUID idEstudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public void registrarPreinscripcion(PreinscripcionDTO preinscripcion) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    @Transactional(readOnly = true)
    public List<HistoricoLogroDTO> obtenerHistoricoEstudiante(UUID idAcudiente, UUID idEstudiante) {
        log.info("Obteniendo histórico del estudiante {} para acudiente {}", idEstudiante, idAcudiente);
        
        // Verificar que el acudiente existe
        Acudiente acudiente = acudienteRepository.findById(idAcudiente)
                .orElseThrow(() -> new ResourceNotFoundException("Acudiente no encontrado con ID: " + idAcudiente));
        
        // Verificar que el estudiante está a cargo del acudiente
        boolean tienePermiso = acudiente.getEstudiantesACargo().stream()
                .anyMatch(e -> e.getIdEstudiante().equals(idEstudiante));
        
        if (!tienePermiso) {
            throw new ResourceNotFoundException("El estudiante no está a cargo de este acudiente");
        }
        
        // Obtener el histórico usando el servicio de logros
        return logroService.mostrarHistoricoLogros(idEstudiante);
    }

    private EstudianteDTO convertirEstudianteADTO(Estudiante estudiante) {
        return EstudianteDTO.builder()
                .idEstudiante(estudiante.getIdEstudiante())
                .nombre(estudiante.getNombre())
                .nombre2(estudiante.getNombre2())
                .apellido(estudiante.getApellido())
                .apellido2(estudiante.getApellido2())
                .numeroDocumento(estudiante.getNumeroDocumento())
                .estado(estudiante.getEstado())
                .idGrado(estudiante.getGrupoAsignado() != null && estudiante.getGrupoAsignado().getGrado() != null ? 
                    estudiante.getGrupoAsignado().getGrado().getIdGrado() : null)
                .nombreGrupo(estudiante.getGrupoAsignado() != null ? 
                    estudiante.getGrupoAsignado().getNombreGrupo() : null)
                .build();
    }
}
