package com.sga.controller;

import com.sga.dto.BoletinDTO;
import com.sga.service.BoletinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/boletines")
@RequiredArgsConstructor
public class BoletinController {

    private final BoletinService boletinService;

    @GetMapping("/{id}/descarga")
    @PreAuthorize("hasRole('ACUDIENTE') or hasRole('PROFESOR') or hasRole('DIRECTOR')")
    public ResponseEntity<byte[]> descargarBoletin(@PathVariable UUID id) {
        byte[] pdf = boletinService.generarArchivoPDFBoletin(id);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=boletin.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/generar")
    @PreAuthorize("hasRole('PROFESOR')")
    public ResponseEntity<BoletinDTO> generarBoletin(
            @RequestParam UUID idEstudiante,
            @RequestParam String periodo) {
        return ResponseEntity.ok(boletinService.generarBoletin(idEstudiante, periodo));
    }
}
