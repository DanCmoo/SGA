package com.sga.controller;

import com.sga.dto.EstudianteDTO;
import com.sga.service.GrupoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/grupos")
@RequiredArgsConstructor
public class GrupoController {

    private final GrupoService grupoService;

    @GetMapping("/{id}/estudiantes")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('DIRECTOR')")
    public ResponseEntity<List<EstudianteDTO>> obtenerListadoEstudiantes(@PathVariable UUID id) {
        return ResponseEntity.ok(grupoService.obtenerListadoEstudiantes(id));
    }

    @GetMapping("/estudiante/{id}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('DIRECTOR')")
    public ResponseEntity<EstudianteDTO> obtenerEstudiante(@PathVariable UUID id) {
        return ResponseEntity.ok(grupoService.obtenerEstudiante(id));
    }
}
