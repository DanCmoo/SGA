package com.sga.controller;

import com.sga.dto.CategoriaLogroDTO;
import com.sga.dto.EvaluacionDTO;
import com.sga.dto.EvaluacionRegistroDTO;
import com.sga.dto.HistoricoLogroDTO;
import com.sga.dto.LogroDTO;
import com.sga.service.LogroService;
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
@RequestMapping("/logros")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LogroController {

    private final LogroService logroService;

    /**
     * Obtener categorías de logros por grado
     */
    @GetMapping("/grado/{idGrado}/categorias")
    @PreAuthorize("hasAnyAuthority('PROFESOR', 'COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<List<CategoriaLogroDTO>> obtenerCategoriasPorGrado(@PathVariable UUID idGrado) {
        log.info("GET /logros/grado/{}/categorias - Obteniendo categorías", idGrado);
        List<CategoriaLogroDTO> categorias = logroService.obtenerCategoriasPorGrado(idGrado);
        return ResponseEntity.ok(categorias);
    }

    /**
     * Obtener logros de una categoría específica
     */
    @GetMapping("/categoria/{idCategoria}")
    @PreAuthorize("hasAnyAuthority('PROFESOR', 'COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<List<LogroDTO>> obtenerLogrosPorCategoria(@PathVariable UUID idCategoria) {
        log.info("GET /logros/categoria/{} - Obteniendo logros", idCategoria);
        List<LogroDTO> logros = logroService.obtenerLogrosPorCategoria(idCategoria);
        return ResponseEntity.ok(logros);
    }

    /**
     * Registrar evaluación de logros de un estudiante
     */
    @PostMapping("/evaluar")
    @PreAuthorize("hasAnyAuthority('PROFESOR', 'COORDINADOR')")
    public ResponseEntity<EvaluacionDTO> registrarEvaluacion(@RequestBody EvaluacionRegistroDTO evaluacion) {
        log.info("POST /logros/evaluar - Registrando evaluación para estudiante: {}", evaluacion.getIdEstudiante());
        EvaluacionDTO resultado = logroService.registrarEvaluacion(evaluacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    /**
     * Obtener histórico de evaluaciones de un estudiante
     */
    @GetMapping("/estudiante/{id}/historico")
    @PreAuthorize("hasAnyAuthority('PROFESOR', 'COORDINADOR', 'DIRECTOR', 'ACUDIENTE', 'ADMINISTRADOR')")
    public ResponseEntity<List<HistoricoLogroDTO>> mostrarHistoricoLogros(@PathVariable UUID id) {
        log.info("GET /logros/estudiante/{}/historico - Obteniendo histórico", id);
        return ResponseEntity.ok(logroService.mostrarHistoricoLogros(id));
    }

    /**
     * Obtener evaluación de un estudiante en un período específico
     */
    @GetMapping("/estudiante/{idEstudiante}/periodo/{idPeriodo}")
    @PreAuthorize("hasAnyAuthority('PROFESOR', 'COORDINADOR', 'DIRECTOR', 'ACUDIENTE', 'ADMINISTRADOR')")
    public ResponseEntity<EvaluacionDTO> obtenerEvaluacionPorPeriodo(
            @PathVariable UUID idEstudiante,
            @PathVariable UUID idPeriodo) {
        log.info("GET /logros/estudiante/{}/periodo/{} - Consultando evaluación", idEstudiante, idPeriodo);
        EvaluacionDTO evaluacion = logroService.obtenerEvaluacionPorEstudianteYPeriodo(idEstudiante, idPeriodo);
        if (evaluacion == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(evaluacion);
    }
}
