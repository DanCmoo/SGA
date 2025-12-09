package com.sga.service.impl;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.PreinscripcionCompletoDTO;
import com.sga.dto.PreinscripcionDTO;
import com.sga.exception.ResourceNotFoundException;
import com.sga.model.*;
import com.sga.repository.*;
import com.sga.service.AdmisionesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdmisionesServiceImpl implements AdmisionesService {

    private final EstudianteRepository estudianteRepository;
    private final GrupoRepository grupoRepository;
    private final ProfesorRepository profesorRepository;
    private final HojaDeVidaEstudianteRepository hojaDeVidaRepository;
    private final AcudienteRepository acudienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PreinscripcionCompletoDTO crearPreinscripcion(PreinscripcionDTO preinscripcionDTO) {
        log.info("Creando preinscripción para estudiante: {} {} {} {}", 
                preinscripcionDTO.getNombre1Estudiante(), 
                preinscripcionDTO.getNombre2Estudiante(),
                preinscripcionDTO.getApellido1Estudiante(),
                preinscripcionDTO.getApellido2Estudiante());

        // Crear o buscar acudiente
        Acudiente acudiente = crearOBuscarAcudiente(preinscripcionDTO);

        // Crear hoja de vida con datos de preinscripción
        HojaDeVidaEstudiante hojaDeVida = HojaDeVidaEstudiante.builder()
                .nombreEstudiante(preinscripcionDTO.getNombre1Estudiante())
                .nombre2Estudiante(preinscripcionDTO.getNombre2Estudiante())
                .apellidoEstudiante(preinscripcionDTO.getApellido1Estudiante())
                .apellido2Estudiante(preinscripcionDTO.getApellido2Estudiante())
                .fechaNacimiento(preinscripcionDTO.getFechaNacimiento())
                .documentoIdentidad(preinscripcionDTO.getDocumentoIdentidad())
                .gradoSolicitado(preinscripcionDTO.getGradoSolicitado())
                .estadoPreinscripcion("PENDIENTE")
                .fechaSolicitud(LocalDateTime.now())
                .acudiente(acudiente)
                .build();

        HojaDeVidaEstudiante hojaGuardada = hojaDeVidaRepository.save(hojaDeVida);
        log.info("Preinscripción creada con ID: {}", hojaGuardada.getIdHojaDeVida());

        return convertirAPreinscripcionCompletoDTO(hojaGuardada);
    }

    @Override
    public void aprobarAspirante(UUID idPreinscripcion) {
        log.info("Aprobando aspirante con ID: {}", idPreinscripcion);

        HojaDeVidaEstudiante hojaDeVida = hojaDeVidaRepository.findById(idPreinscripcion)
                .orElseThrow(() -> new ResourceNotFoundException("Preinscripción no encontrada con ID: " + idPreinscripcion));

        if (!"PENDIENTE".equals(hojaDeVida.getEstadoPreinscripcion())) {
            throw new IllegalStateException("La preinscripción ya ha sido procesada");
        }

        // Crear Estudiante
        Estudiante estudiante = Estudiante.builder()
                .nombre(hojaDeVida.getNombreEstudiante())
                .nombre2(hojaDeVida.getNombre2Estudiante())
                .apellido(hojaDeVida.getApellidoEstudiante())
                .apellido2(hojaDeVida.getApellido2Estudiante())
                .numeroDocumento(hojaDeVida.getDocumentoIdentidad())
                .estado(true)
                .hojaDeVida(hojaDeVida)
                .acudiente(hojaDeVida.getAcudiente())
                .build();

        estudianteRepository.save(estudiante);

        // Actualizar estado de preinscripción
        hojaDeVida.setEstadoPreinscripcion("APROBADO");
        hojaDeVidaRepository.save(hojaDeVida);

        log.info("Aspirante aprobado y convertido en estudiante exitosamente");
    }

    @Override
    public void rechazarAspirante(UUID idPreinscripcion) {
        log.info("Rechazando aspirante con ID: {}", idPreinscripcion);

        HojaDeVidaEstudiante hojaDeVida = hojaDeVidaRepository.findById(idPreinscripcion)
                .orElseThrow(() -> new ResourceNotFoundException("Preinscripción no encontrada con ID: " + idPreinscripcion));

        if (!"PENDIENTE".equals(hojaDeVida.getEstadoPreinscripcion())) {
            throw new IllegalStateException("La preinscripción ya ha sido procesada");
        }

        hojaDeVida.setEstadoPreinscripcion("RECHAZADO");
        hojaDeVidaRepository.save(hojaDeVida);

        log.info("Aspirante rechazado exitosamente");
    }

    @Override
    public void asignarEstudianteAGrupo(UUID idEstudiante, UUID idGrupo) {
        log.info("Asignando estudiante {} al grupo {}", idEstudiante, idGrupo);

        Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + idEstudiante));

        Grupo grupo = grupoRepository.findById(idGrupo)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con ID: " + idGrupo));

        estudiante.setGrupoAsignado(grupo);
        estudianteRepository.save(estudiante);

        log.info("Estudiante asignado al grupo exitosamente");
    }

    @Override
    public void asignarProfesorAGrupo(UUID idProfesor, UUID idGrupo) {
        log.info("Asignando profesor {} al grupo {}", idProfesor, idGrupo);

        Profesor profesor = profesorRepository.findById(idProfesor)
                .orElseThrow(() -> new ResourceNotFoundException("Profesor no encontrado con ID: " + idProfesor));

        Grupo grupo = grupoRepository.findById(idGrupo)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con ID: " + idGrupo));

        grupo.setDirectorDeGrupo(profesor);
        grupoRepository.save(grupo);

        log.info("Profesor asignado al grupo exitosamente");
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstudianteDTO> listarAdmitidos() {
        log.info("Listando estudiantes admitidos");
        // TODO: Implementar conversión a DTO cuando se cree EstudianteServiceImpl completo
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PreinscripcionCompletoDTO> listarPreinscritos() {
        log.info("Listando preinscripciones pendientes");
        List<HojaDeVidaEstudiante> preinscritos = hojaDeVidaRepository.findByEstadoPreinscripcion("PENDIENTE");
        
        return preinscritos.stream()
                .map(this::convertirAPreinscripcionCompletoDTO)
                .collect(Collectors.toList());
    }

    private Acudiente crearOBuscarAcudiente(PreinscripcionDTO preinscripcionDTO) {
        return usuarioRepository.findByCorreoElectronico(preinscripcionDTO.getCorreoAcudiente())
                .filter(u -> u instanceof Acudiente)
                .map(u -> (Acudiente) u)
                .orElseGet(() -> {
                    log.info("Creando nuevo acudiente: {} {} {} {}", 
                            preinscripcionDTO.getNombre1Acudiente(),
                            preinscripcionDTO.getNombre2Acudiente(),
                            preinscripcionDTO.getApellido1Acudiente(),
                            preinscripcionDTO.getApellido2Acudiente());
                    
                    Token_Usuario tokenUsuario = Token_Usuario.builder()
                            .contrasena(passwordEncoder.encode(preinscripcionDTO.getCedulaAcudiente()))
                            .rol("ACUDIENTE")
                            .requiereCambioContrasena(true)
                            .build();

                    Acudiente nuevoAcudiente = Acudiente.builder()
                            .nombre(preinscripcionDTO.getNombre1Acudiente())
                            .nombre2(preinscripcionDTO.getNombre2Acudiente())
                            .apellido(preinscripcionDTO.getApellido1Acudiente())
                            .apellido2(preinscripcionDTO.getApellido2Acudiente())
                            .cedula(preinscripcionDTO.getCedulaAcudiente())
                            .fechaNacimiento(preinscripcionDTO.getFechaNacimientoAcudiente())
                            .correoElectronico(preinscripcionDTO.getCorreoAcudiente())
                            .tokenUsuario(tokenUsuario)
                            .estado(true)
                            .build();

                    Acudiente acudienteGuardado = acudienteRepository.save(nuevoAcudiente);
                    
                    log.info("Acudiente creado exitosamente. Correo: {}, Contraseña temporal: su cédula ({})", 
                            preinscripcionDTO.getCorreoAcudiente(), 
                            preinscripcionDTO.getCedulaAcudiente());
                    
                    return acudienteGuardado;
                });
    }

    private String generarCorreoEstudiante(HojaDeVidaEstudiante hojaDeVida) {
        String nombre = (hojaDeVida.getNombreEstudiante() + 
                        (hojaDeVida.getNombre2Estudiante() != null ? hojaDeVida.getNombre2Estudiante() : ""))
                .toLowerCase().replaceAll("\\s+", "");
        String apellido = (hojaDeVida.getApellidoEstudiante() + 
                          (hojaDeVida.getApellido2Estudiante() != null ? hojaDeVida.getApellido2Estudiante() : ""))
                .toLowerCase().replaceAll("\\s+", "");
        
        return nombre + "." + apellido + "@estudiante.fis.edu.co";
    }

    private String buildFullName(String nombre1, String nombre2, String apellido1, String apellido2) {
        StringBuilder fullName = new StringBuilder();
        if (nombre1 != null && !nombre1.isEmpty()) fullName.append(nombre1);
        if (nombre2 != null && !nombre2.isEmpty()) fullName.append(" ").append(nombre2);
        if (apellido1 != null && !apellido1.isEmpty()) fullName.append(" ").append(apellido1);
        if (apellido2 != null && !apellido2.isEmpty()) fullName.append(" ").append(apellido2);
        return fullName.toString().trim();
    }

    private PreinscripcionCompletoDTO convertirAPreinscripcionCompletoDTO(HojaDeVidaEstudiante hojaDeVida) {
        Acudiente acudiente = hojaDeVida.getAcudiente();
        return PreinscripcionCompletoDTO.builder()
                .idHojaDeVida(hojaDeVida.getIdHojaDeVida())
                .idAcudiente(acudiente != null ? acudiente.getIdAcudiente() : null)
                .nombre1Acudiente(acudiente != null ? acudiente.getNombre() : null)
                .nombre2Acudiente(acudiente != null ? acudiente.getNombre2() : null)
                .apellido1Acudiente(acudiente != null ? acudiente.getApellido() : null)
                .apellido2Acudiente(acudiente != null ? acudiente.getApellido2() : null)
                .cedulaAcudiente(acudiente != null ? acudiente.getCedula() : null)
                .correoAcudiente(acudiente != null ? acudiente.getCorreoElectronico() : null)
                .telefonoAcudiente(null)
                .nombre1Estudiante(hojaDeVida.getNombreEstudiante())
                .nombre2Estudiante(hojaDeVida.getNombre2Estudiante())
                .apellido1Estudiante(hojaDeVida.getApellidoEstudiante())
                .apellido2Estudiante(hojaDeVida.getApellido2Estudiante())
                .fechaNacimiento(hojaDeVida.getFechaNacimiento())
                .documentoIdentidad(hojaDeVida.getDocumentoIdentidad())
                .gradoSolicitado(hojaDeVida.getGradoSolicitado())
                .estado(hojaDeVida.getEstadoPreinscripcion())
                .fechaSolicitud(hojaDeVida.getFechaSolicitud())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstudianteDTO> listarEstudiantesAprobadosSinGrupo() {
        log.info("Listando estudiantes aprobados sin grupo asignado");
        List<Estudiante> estudiantes = estudianteRepository.findAll().stream()
                .filter(e -> e.getEstado() && e.getGrupoAsignado() == null)
                .collect(Collectors.toList());
        
        return estudiantes.stream()
                .map(this::convertirAEstudianteDTO)
                .collect(Collectors.toList());
    }

    private EstudianteDTO convertirAEstudianteDTO(Estudiante estudiante) {
        Acudiente acudiente = estudiante.getAcudiente();
        Grupo grupo = estudiante.getGrupoAsignado();
        HojaDeVidaEstudiante hojaDeVida = estudiante.getHojaDeVida();
        
        return EstudianteDTO.builder()
                .idEstudiante(estudiante.getIdEstudiante())
                .nombre(estudiante.getNombre())
                .nombre2(estudiante.getNombre2())
                .apellido(estudiante.getApellido())
                .apellido2(estudiante.getApellido2())
                .numeroDocumento(estudiante.getNumeroDocumento())
                .estado(estudiante.getEstado())
                .idAcudiente(acudiente != null ? acudiente.getIdAcudiente() : null)
                .nombre1Acudiente(acudiente != null ? acudiente.getNombre() : null)
                .nombre2Acudiente(acudiente != null ? acudiente.getNombre2() : null)
                .apellido1Acudiente(acudiente != null ? acudiente.getApellido() : null)
                .apellido2Acudiente(acudiente != null ? acudiente.getApellido2() : null)
                .idGrupo(grupo != null ? grupo.getIdGrupo() : null)
                .nombreGrupo(grupo != null ? grupo.getNombreGrupo() : null)
                .gradoSolicitado(hojaDeVida != null ? hojaDeVida.getGradoSolicitado() : null)
                .hojaDeVida(null) // No enviamos la hoja de vida completa en este DTO
                .build();
    }
}
