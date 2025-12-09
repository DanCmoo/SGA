package com.sga.controller;

import com.sga.dto.EvaluacionDTO;
import com.sga.dto.EstudianteDTO;
import com.sga.dto.GrupoDTO;
import com.sga.dto.HojaDeVidaDTO;
import com.sga.service.DirectivoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/directivo")
@RequiredArgsConstructor
public class DirectivoController {

    private final DirectivoService directivoService;

    @GetMapping("/grado/{idGrado}/grupos")
    @PreAuthorize("hasAnyAuthority('DIRECTOR', 'DIRECTIVO')")
    public ResponseEntity<List<GrupoDTO>> listarGruposPorGrado(@PathVariable UUID idGrado) {
        log.info("GET /directivo/grado/{}/grupos - Listando grupos", idGrado);
        return ResponseEntity.ok(directivoService.listarGruposPorGrado(idGrado));
    }

    @GetMapping("/grupo/{idGrupo}/estudiantes")
    @PreAuthorize("hasAnyAuthority('DIRECTOR', 'DIRECTIVO')")
    public ResponseEntity<List<EstudianteDTO>> listarEstudiantesDeGrupo(@PathVariable UUID idGrupo) {
        log.info("GET /directivo/grupo/{}/estudiantes - Listando estudiantes", idGrupo);
        return ResponseEntity.ok(directivoService.listarEstudiantesDeGrupo(idGrupo));
    }

    @GetMapping("/estudiante/{idEstudiante}/hoja-vida")
    @PreAuthorize("hasAnyAuthority('DIRECTOR', 'DIRECTIVO', 'PROFESOR', 'COORDINADOR')")
    public ResponseEntity<HojaDeVidaDTO> obtenerHojaDeVida(@PathVariable UUID idEstudiante) {
        log.info("GET /directivo/estudiante/{}/hoja-vida - Obteniendo hoja de vida", idEstudiante);
        return ResponseEntity.ok(directivoService.obtenerHojaDeVida(idEstudiante));
    }

    @PutMapping("/estudiante/{idEstudiante}/hoja-vida")
    @PreAuthorize("hasAnyAuthority('DIRECTOR', 'DIRECTIVO', 'PROFESOR', 'COORDINADOR')")
    public ResponseEntity<HojaDeVidaDTO> actualizarHojaDeVida(
            @PathVariable UUID idEstudiante,
            @RequestBody HojaDeVidaDTO hojaDeVidaDTO) {
        log.info("PUT /directivo/estudiante/{}/hoja-vida - Actualizando hoja de vida", idEstudiante);
        return ResponseEntity.ok(directivoService.actualizarHojaDeVida(idEstudiante, hojaDeVidaDTO));
    }

    @GetMapping("/estudiante/{idEstudiante}/historico")
    @PreAuthorize("hasAnyAuthority('DIRECTOR', 'DIRECTIVO', 'PROFESOR', 'COORDINADOR', 'ACUDIENTE')")
    public ResponseEntity<List<EvaluacionDTO>> obtenerHistoricoLogros(@PathVariable UUID idEstudiante) {
        log.info("GET /directivo/estudiante/{}/historico - Obteniendo histórico de logros", idEstudiante);
        return ResponseEntity.ok(directivoService.obtenerHistoricoLogros(idEstudiante));
    }
}
