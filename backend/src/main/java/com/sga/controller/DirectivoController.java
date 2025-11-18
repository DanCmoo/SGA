package com.sga.controller;

import com.sga.dto.EvaluacionDTO;
import com.sga.dto.GrupoDTO;
import com.sga.service.DirectivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/directivo")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DIRECTOR') or hasRole('DIRECTIVO')")
public class DirectivoController {

    private final DirectivoService directivoService;

    @GetMapping("/grados-grupos")
    public ResponseEntity<List<GrupoDTO>> listarGruposPorGrado(@RequestParam String grado) {
        return ResponseEntity.ok(directivoService.listarGruposPorGrado(grado));
    }

    @GetMapping("/estudiante/{id}/perfil")
    public ResponseEntity<List<EvaluacionDTO>> obtenerHistoricoLogros(@PathVariable UUID id) {
        return ResponseEntity.ok(directivoService.obtenerHistoricoLogros(id));
    }
}
