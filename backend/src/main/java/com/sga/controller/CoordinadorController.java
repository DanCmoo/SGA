package com.sga.controller;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.PreinscripcionCompletoDTO;
import com.sga.service.AdmisionesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/coordinador")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('COORDINADOR')")
public class CoordinadorController {

    private final AdmisionesService admisionesService;

    @GetMapping("/preinscripciones")
    public ResponseEntity<List<PreinscripcionCompletoDTO>> listarPreinscritos() {
        return ResponseEntity.ok(admisionesService.listarPreinscritos());
    }

    @PutMapping("/preinscripcion/{id}/aceptar")
    public ResponseEntity<Void> aprobarAspirante(@PathVariable UUID id) {
        admisionesService.aprobarAspirante(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/estudiantes-admitidos")
    public ResponseEntity<List<EstudianteDTO>> listarAdmitidos() {
        return ResponseEntity.ok(admisionesService.listarAdmitidos());
    }

    @PostMapping("/asignar-estudiante")
    public ResponseEntity<Void> asignarEstudianteAGrupo(
            @RequestParam UUID idEstudiante,
            @RequestParam UUID idGrupo) {
        admisionesService.asignarEstudianteAGrupo(idEstudiante, idGrupo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/asignar-profesor")
    public ResponseEntity<Void> asignarProfesorAGrupo(
            @RequestParam UUID idProfesor,
            @RequestParam UUID idGrupo) {
        admisionesService.asignarProfesorAGrupo(idProfesor, idGrupo);
        return ResponseEntity.ok().build();
    }
}
