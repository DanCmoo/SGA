package com.sga.controller;

import com.sga.dto.UsuarioCreacionDTO;
import com.sga.dto.UsuarioDTO;
import com.sga.service.AdministradorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMINISTRADOR')")
public class AdministradorController {

    private final AdministradorService administradorService;

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioCreacionDTO datos) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(administradorService.crearUsuario(datos));
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioDTO> consultarUsuario(@PathVariable UUID id) {
        return ResponseEntity.ok(administradorService.consultarPorId(id));
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        return ResponseEntity.ok(administradorService.listarTodosLosUsuarios());
    }
}
