package com.sga.controller;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.HistoricoLogroDTO;
import com.sga.service.AcudienteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/acudiente")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AcudienteController {

    private final AcudienteService acudienteService;

    /**
     * Obtener estudiantes a cargo del acudiente autenticado
     */
    @GetMapping("/{idAcudiente}/estudiantes")
    @PreAuthorize("hasAuthority('ACUDIENTE')")
    public ResponseEntity<List<EstudianteDTO>> obtenerEstudiantesACargo(@PathVariable UUID idAcudiente) {
        log.info("GET /acudiente/{}/estudiantes - Obteniendo estudiantes a cargo", idAcudiente);
        return ResponseEntity.ok(acudienteService.listarEstudiantesACargo(idAcudiente));
    }

    /**
     * Obtener histórico de logros de un estudiante
     */
    @GetMapping("/{idAcudiente}/estudiante/{idEstudiante}/historico")
    @PreAuthorize("hasAuthority('ACUDIENTE')")
    public ResponseEntity<List<HistoricoLogroDTO>> obtenerHistoricoEstudiante(
            @PathVariable UUID idAcudiente,
            @PathVariable UUID idEstudiante) {
        log.info("GET /acudiente/{}/estudiante/{}/historico - Obteniendo histórico", idAcudiente, idEstudiante);
        return ResponseEntity.ok(acudienteService.obtenerHistoricoEstudiante(idAcudiente, idEstudiante));
    }
}
