package com.sga.controller;

import com.sga.dto.CredencialesDTO;
import com.sga.dto.RegistroDTO;
import com.sga.dto.TokenDTO;
import com.sga.dto.UsuarioDTO;
import com.sga.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> autenticar(@RequestBody CredencialesDTO credenciales) {
        return ResponseEntity.ok(usuarioService.autenticar(credenciales));
    }

    @PutMapping("/{id}/datos-iniciales")
    public ResponseEntity<UsuarioDTO> ingresarDatosPersonales(
            @PathVariable UUID id,
            @RequestBody RegistroDTO datos) {
        return ResponseEntity.ok(usuarioService.ingresarDatosPersonales(id, datos));
    }
}
