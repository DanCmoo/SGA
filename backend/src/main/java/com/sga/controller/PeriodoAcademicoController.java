package com.sga.controller;

import com.sga.dto.PeriodoAcademicoDTO;
import com.sga.model.PeriodoAcademico;
import com.sga.repository.PeriodoAcademicoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/periodos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PeriodoAcademicoController {

    private final PeriodoAcademicoRepository periodoRepository;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('PROFESOR', 'COORDINADOR', 'ADMINISTRADOR', 'DIRECTOR')")
    public ResponseEntity<List<PeriodoAcademicoDTO>> listarTodos() {
        log.info("GET /periodos - Listando todos los períodos académicos");
        List<PeriodoAcademico> periodos = periodoRepository.findAll();
        List<PeriodoAcademicoDTO> dtos = periodos.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('PROFESOR', 'COORDINADOR', 'ADMINISTRADOR', 'DIRECTOR')")
    public ResponseEntity<PeriodoAcademicoDTO> consultar(@PathVariable UUID id) {
        log.info("GET /periodos/{} - Consultando período", id);
        PeriodoAcademico periodo = periodoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Período no encontrado"));
        return ResponseEntity.ok(convertirADTO(periodo));
    }

    private PeriodoAcademicoDTO convertirADTO(PeriodoAcademico periodo) {
        return PeriodoAcademicoDTO.builder()
                .idPeriodo(periodo.getIdPeriodoAcademico())
                .fechaInicio(periodo.getFechaInicio())
                .fechaFin(periodo.getFechaFin())
                .nombre(periodo.getNombre())
                .build();
    }
}
