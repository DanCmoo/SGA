package com.sga.service.impl;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.GrupoCreacionDTO;
import com.sga.dto.GrupoDTO;
import com.sga.exception.ResourceNotFoundException;
import com.sga.model.Grado;
import com.sga.model.Grupo;
import com.sga.model.Profesor;
import com.sga.repository.EstudianteRepository;
import com.sga.repository.GradoRepository;
import com.sga.repository.GrupoRepository;
import com.sga.repository.ProfesorRepository;
import com.sga.service.GrupoService;
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
public class GrupoServiceImpl implements GrupoService {

    private final GrupoRepository grupoRepository;
    private final EstudianteRepository estudianteRepository;
    private final GradoRepository gradoRepository;
    private final ProfesorRepository profesorRepository;

    @Override
    public GrupoDTO crear(GrupoCreacionDTO grupoCreacionDTO) {
        log.info("Creando nuevo grupo: {}", grupoCreacionDTO.getNombre());
        
        Grado grado = gradoRepository.findById(grupoCreacionDTO.getIdGrado())
                .orElseThrow(() -> new ResourceNotFoundException("Grado no encontrado con ID: " + grupoCreacionDTO.getIdGrado()));
        
        Profesor profesor = null;
        if (grupoCreacionDTO.getIdProfesor() != null) {
            profesor = profesorRepository.findById(grupoCreacionDTO.getIdProfesor())
                    .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado con ID: " + grupoCreacionDTO.getIdProfesor()));
            
            // Verificar que el profesor no tenga ya un grupo asignado
            if (profesor.getGrupoAsignado() != null && !profesor.getGrupoAsignado().isEmpty()) {
                throw new IllegalStateException("El profesor ya tiene un grupo asignado");
            }
        }
        
        Grupo grupo = Grupo.builder()
                .nombreGrupo(grupoCreacionDTO.getNombre())
                .grado(grado)
                .directorDeGrupo(profesor)
                .build();
        
        Grupo grupoGuardado = grupoRepository.save(grupo);
        
        // Actualizar el campo grupoAsignado del profesor
        if (profesor != null) {
            profesor.setGrupoAsignado(grupoGuardado.getIdGrupo().toString());
            profesorRepository.save(profesor);
        }
        
        log.info("Grupo creado exitosamente con ID: {}", grupoGuardado.getIdGrupo());
        
        return convertirADTO(grupoGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GrupoDTO> listarTodos() {
        log.info("Listando todos los grupos");
        List<Grupo> grupos = grupoRepository.findAll();
        log.info("Se encontraron {} grupos", grupos.size());
        
        return grupos.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GrupoDTO> listarPorGrado(UUID idGrado) {
        log.info("Listando grupos del grado con ID: {}", idGrado);
        
        if (!gradoRepository.existsById(idGrado)) {
            throw new ResourceNotFoundException("Grado no encontrado con ID: " + idGrado);
        }
        
        List<Grupo> grupos = grupoRepository.findByGrado_IdGrado(idGrado);
        log.info("Se encontraron {} grupos para el grado", grupos.size());
        
        return grupos.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GrupoDTO consultar(UUID idGrupo) {
        log.info("Consultando grupo con ID: {}", idGrupo);
        
        Grupo grupo = grupoRepository.findById(idGrupo)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con ID: " + idGrupo));
        
        return convertirADTO(grupo);
    }

    @Override
    public GrupoDTO actualizar(UUID idGrupo, GrupoCreacionDTO grupoCreacionDTO) {
        log.info("Actualizando grupo con ID: {}", idGrupo);
        
        Grupo grupo = grupoRepository.findById(idGrupo)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con ID: " + idGrupo));
        
        if (grupoCreacionDTO.getNombre() != null) {
            grupo.setNombreGrupo(grupoCreacionDTO.getNombre());
        }
        
        if (grupoCreacionDTO.getIdGrado() != null) {
            Grado grado = gradoRepository.findById(grupoCreacionDTO.getIdGrado())
                    .orElseThrow(() -> new ResourceNotFoundException("Grado no encontrado con ID: " + grupoCreacionDTO.getIdGrado()));
            grupo.setGrado(grado);
        }
        
        if (grupoCreacionDTO.getIdProfesor() != null) {
            Profesor profesor = profesorRepository.findById(grupoCreacionDTO.getIdProfesor())
                    .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado con ID: " + grupoCreacionDTO.getIdProfesor()));
            grupo.setDirectorDeGrupo(profesor);
        }
        
        Grupo grupoActualizado = grupoRepository.save(grupo);
        log.info("Grupo actualizado exitosamente");
        
        return convertirADTO(grupoActualizado);
    }

    @Override
    public void eliminar(UUID idGrupo) {
        log.info("Eliminando grupo con ID: {}", idGrupo);
        
        if (!grupoRepository.existsById(idGrupo)) {
            throw new ResourceNotFoundException("Grupo no encontrado con ID: " + idGrupo);
        }
        
        grupoRepository.deleteById(idGrupo);
        log.info("Grupo eliminado exitosamente");
    }

    @Override
    public void agregarEstudiante(EstudianteDTO estudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public void eliminarEstudiante(UUID idEstudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    @Transactional(readOnly = true)
    public EstudianteDTO obtenerEstudiante(UUID idEstudiante) {
        log.info("Consultando estudiante con ID: {}", idEstudiante);
        
        var estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + idEstudiante));
        
        return convertirEstudianteADTO(estudiante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstudianteDTO> obtenerListadoEstudiantes(UUID idGrupo) {
        log.info("Listando estudiantes del grupo con ID: {}", idGrupo);
        
        // Verificar que el grupo existe
        if (!grupoRepository.existsById(idGrupo)) {
            throw new ResourceNotFoundException("Grupo no encontrado con ID: " + idGrupo);
        }
        
        var estudiantes = estudianteRepository.findByGrupoAsignadoIdGrupo(idGrupo);
        log.info("Se encontraron {} estudiantes en el grupo", estudiantes.size());
        
        return estudiantes.stream()
                .map(this::convertirEstudianteADTO)
                .collect(Collectors.toList());
    }
    
    private EstudianteDTO convertirEstudianteADTO(com.sga.model.Estudiante estudiante) {
        String nombreGrupo = null;
        UUID idGrupo = null;
        UUID idGrado = null;
        String gradoSolicitado = null;
        
        if (estudiante.getGrupoAsignado() != null) {
            idGrupo = estudiante.getGrupoAsignado().getIdGrupo();
            nombreGrupo = estudiante.getGrupoAsignado().getNombreGrupo();
            if (estudiante.getGrupoAsignado().getGrado() != null) {
                idGrado = estudiante.getGrupoAsignado().getGrado().getIdGrado();
                gradoSolicitado = estudiante.getGrupoAsignado().getGrado().getNombreGrado();
            }
        }
        
        String nombre1Acudiente = null;
        String nombre2Acudiente = null;
        String apellido1Acudiente = null;
        String apellido2Acudiente = null;
        UUID idAcudiente = null;
        
        if (estudiante.getAcudiente() != null) {
            idAcudiente = estudiante.getAcudiente().getIdAcudiente();
            nombre1Acudiente = estudiante.getAcudiente().getNombre();
            nombre2Acudiente = estudiante.getAcudiente().getNombre2();
            apellido1Acudiente = estudiante.getAcudiente().getApellido();
            apellido2Acudiente = estudiante.getAcudiente().getApellido2();
        }
        
        return EstudianteDTO.builder()
                .idEstudiante(estudiante.getIdEstudiante())
                .nombre(estudiante.getNombre())
                .nombre2(estudiante.getNombre2())
                .apellido(estudiante.getApellido())
                .apellido2(estudiante.getApellido2())
                .numeroDocumento(estudiante.getNumeroDocumento())
                .estado(estudiante.getEstado())
                .idAcudiente(idAcudiente)
                .nombre1Acudiente(nombre1Acudiente)
                .nombre2Acudiente(nombre2Acudiente)
                .apellido1Acudiente(apellido1Acudiente)
                .apellido2Acudiente(apellido2Acudiente)
                .idGrupo(idGrupo)
                .nombreGrupo(nombreGrupo)
                .idGrado(idGrado)
                .gradoSolicitado(gradoSolicitado)
                .build();
    }

    private GrupoDTO convertirADTO(Grupo grupo) {
        Integer cantidadEstudiantes = grupo.getEstudiantes() != null ? grupo.getEstudiantes().size() : 0;
        String nombreProfesor = null;
        UUID idProfesor = null;
        
        if (grupo.getDirectorDeGrupo() != null) {
            idProfesor = grupo.getDirectorDeGrupo().getIdProfesor();
            nombreProfesor = buildFullName(
                grupo.getDirectorDeGrupo().getNombre(),
                grupo.getDirectorDeGrupo().getNombre2(),
                grupo.getDirectorDeGrupo().getApellido(),
                grupo.getDirectorDeGrupo().getApellido2()
            );
        }
        
        return GrupoDTO.builder()
                .idGrupo(grupo.getIdGrupo())
                .nombre(grupo.getNombreGrupo())
                .idGrado(grupo.getGrado().getIdGrado())
                .nombreGrado(grupo.getGrado().getNombreGrado())
                .idProfesor(idProfesor)
                .nombreProfesor(nombreProfesor)
                .cantidadEstudiantes(cantidadEstudiantes)
                .build();
    }

    private String buildFullName(String nombre1, String nombre2, String apellido1, String apellido2) {
        StringBuilder fullName = new StringBuilder();
        if (nombre1 != null && !nombre1.isEmpty()) fullName.append(nombre1);
        if (nombre2 != null && !nombre2.isEmpty()) fullName.append(" ").append(nombre2);
        if (apellido1 != null && !apellido1.isEmpty()) fullName.append(" ").append(apellido1);
        if (apellido2 != null && !apellido2.isEmpty()) fullName.append(" ").append(apellido2);
        return fullName.toString().trim();
    }
}
