package com.sga.controller;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.GrupoCreacionDTO;
import com.sga.dto.GrupoDTO;
import com.sga.service.GrupoService;
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
@RequestMapping("/grupos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class GrupoController {

    private final GrupoService grupoService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<GrupoDTO> crear(@RequestBody GrupoCreacionDTO grupoCreacionDTO) {
        log.info("POST /grupos - Creando grupo: {}", grupoCreacionDTO.getNombre());
        GrupoDTO grupoCreado = grupoService.crear(grupoCreacionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(grupoCreado);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR', 'DIRECTOR', 'PROFESOR')")
    public ResponseEntity<List<GrupoDTO>> listarTodos() {
        log.info("GET /grupos - Listando todos los grupos");
        List<GrupoDTO> grupos = grupoService.listarTodos();
        return ResponseEntity.ok(grupos);
    }

    @GetMapping("/grado/{idGrado}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR', 'DIRECTOR', 'PROFESOR')")
    public ResponseEntity<List<GrupoDTO>> listarPorGrado(@PathVariable UUID idGrado) {
        log.info("GET /grupos/grado/{} - Listando grupos por grado", idGrado);
        List<GrupoDTO> grupos = grupoService.listarPorGrado(idGrado);
        return ResponseEntity.ok(grupos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR', 'DIRECTOR', 'PROFESOR')")
    public ResponseEntity<GrupoDTO> consultar(@PathVariable("id") UUID idGrupo) {
        log.info("GET /grupos/{} - Consultando grupo", idGrupo);
        GrupoDTO grupo = grupoService.consultar(idGrupo);
        return ResponseEntity.ok(grupo);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<GrupoDTO> actualizar(
            @PathVariable("id") UUID idGrupo,
            @RequestBody GrupoCreacionDTO grupoCreacionDTO) {
        log.info("PUT /grupos/{} - Actualizando grupo", idGrupo);
        GrupoDTO grupoActualizado = grupoService.actualizar(idGrupo, grupoCreacionDTO);
        return ResponseEntity.ok(grupoActualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable("id") UUID idGrupo) {
        log.info("DELETE /grupos/{} - Eliminando grupo", idGrupo);
        grupoService.eliminar(idGrupo);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/estudiantes")
    @PreAuthorize("hasAuthority('PROFESOR') or hasAuthority('COORDINADOR') or hasAuthority('DIRECTOR')")
    public ResponseEntity<List<EstudianteDTO>> obtenerListadoEstudiantes(@PathVariable UUID id) {
        return ResponseEntity.ok(grupoService.obtenerListadoEstudiantes(id));
    }

    @GetMapping("/estudiante/{id}")
    @PreAuthorize("hasAuthority('PROFESOR') or hasAuthority('COORDINADOR') or hasAuthority('DIRECTOR')")
    public ResponseEntity<EstudianteDTO> obtenerEstudiante(@PathVariable UUID id) {
        return ResponseEntity.ok(grupoService.obtenerEstudiante(id));
    }
}
