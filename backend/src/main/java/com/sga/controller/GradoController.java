package com.sga.controller;

import com.sga.dto.GradoDTO;
import com.sga.service.GradoService;
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
@RequestMapping("/grados")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class GradoController {

    private final GradoService gradoService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<GradoDTO> crear(@RequestBody GradoDTO gradoDTO) {
        log.info("POST /grados - Creando grado: {}", gradoDTO.getNombreGrado());
        GradoDTO gradoCreado = gradoService.crear(gradoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(gradoCreado);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR', 'DIRECTOR', 'PROFESOR')")
    public ResponseEntity<List<GradoDTO>> listarTodos() {
        log.info("GET /grados - Listando todos los grados");
        List<GradoDTO> grados = gradoService.listarTodos();
        return ResponseEntity.ok(grados);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR', 'DIRECTOR', 'PROFESOR')")
    public ResponseEntity<GradoDTO> consultar(@PathVariable("id") UUID idGrado) {
        log.info("GET /grados/{} - Consultando grado", idGrado);
        GradoDTO grado = gradoService.consultar(idGrado);
        return ResponseEntity.ok(grado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<GradoDTO> actualizar(
            @PathVariable("id") UUID idGrado,
            @RequestBody GradoDTO gradoDTO) {
        log.info("PUT /grados/{} - Actualizando grado", idGrado);
        GradoDTO gradoActualizado = gradoService.actualizar(idGrado, gradoDTO);
        return ResponseEntity.ok(gradoActualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('COORDINADOR', 'ADMINISTRADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable("id") UUID idGrado) {
        log.info("DELETE /grados/{} - Eliminando grado", idGrado);
        gradoService.eliminar(idGrado);
        return ResponseEntity.noContent().build();
    }
}
