package com.sga.controller;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.PreinscripcionCompletoDTO;
import com.sga.dto.PreinscripcionDTO;
import com.sga.service.AdmisionesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/admisiones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdmisionesController {

    private final AdmisionesService admisionesService;

    @PostMapping("/preinscripcion")
    public ResponseEntity<PreinscripcionCompletoDTO> crearPreinscripcion(@RequestBody PreinscripcionDTO preinscripcionDTO) {
        log.info("POST /admisiones/preinscripcion - Nueva preinscripción");
        PreinscripcionCompletoDTO preinscripcion = admisionesService.crearPreinscripcion(preinscripcionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(preinscripcion);
    }

    @GetMapping("/preinscritos")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<List<PreinscripcionCompletoDTO>> listarPreinscritos() {
        log.info("GET /admisiones/preinscritos - Listando preinscritos");
        List<PreinscripcionCompletoDTO> preinscritos = admisionesService.listarPreinscritos();
        return ResponseEntity.ok(preinscritos);
    }

    @GetMapping("/estudiantes-aprobados")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<List<EstudianteDTO>> listarEstudiantesAprobados() {
        log.info("GET /admisiones/estudiantes-aprobados - Listando estudiantes aprobados sin grupo");
        List<EstudianteDTO> estudiantes = admisionesService.listarEstudiantesAprobadosSinGrupo();
        return ResponseEntity.ok(estudiantes);
    }

    @PostMapping("/aprobar/{idPreinscripcion}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<Void> aprobarAspirante(@PathVariable UUID idPreinscripcion) {
        log.info("POST /admisiones/aprobar/{} - Aprobando aspirante", idPreinscripcion);
        admisionesService.aprobarAspirante(idPreinscripcion);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rechazar/{idPreinscripcion}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<Void> rechazarAspirante(@PathVariable UUID idPreinscripcion) {
        log.info("POST /admisiones/rechazar/{} - Rechazando aspirante", idPreinscripcion);
        admisionesService.rechazarAspirante(idPreinscripcion);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/asignar-grupo")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<Void> asignarEstudianteAGrupo(
            @RequestParam UUID idEstudiante,
            @RequestParam UUID idGrupo) {
        log.info("POST /admisiones/asignar-grupo - Asignando estudiante {} al grupo {}", idEstudiante, idGrupo);
        admisionesService.asignarEstudianteAGrupo(idEstudiante, idGrupo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/asignar-profesor")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<Void> asignarProfesorAGrupo(
            @RequestParam UUID idProfesor,
            @RequestParam UUID idGrupo) {
        log.info("POST /admisiones/asignar-profesor - Asignando profesor {} al grupo {}", idProfesor, idGrupo);
        admisionesService.asignarProfesorAGrupo(idProfesor, idGrupo);
        return ResponseEntity.ok().build();
    }
}
