package com.sga.controller;

import com.sga.dto.EvaluacionDTO;
import com.sga.service.LogroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/logros")
@RequiredArgsConstructor
public class LogroController {

    private final LogroService logroService;

    @GetMapping("/estudiante/{id}/historico")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ACUDIENTE') or hasRole('DIRECTOR')")
    public ResponseEntity<List<EvaluacionDTO>> mostrarHistoricoLogros(@PathVariable UUID id) {
        return ResponseEntity.ok(logroService.mostrarHistoricoLogros(id));
    }
}
