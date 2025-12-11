package com.sga.controller;

import com.sga.dto.BoletinDTO;
import com.sga.service.BoletinService;
import com.sga.service.impl.BoletinServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/boletines")
@RequiredArgsConstructor
public class BoletinController {

    private final BoletinService boletinService;
    private final BoletinServiceImpl boletinServiceImpl;

    @GetMapping("/{id}/descarga")
    @PreAuthorize("hasAuthority('ACUDIENTE') or hasAuthority('PROFESOR') or hasAuthority('DIRECTOR')")
    public ResponseEntity<byte[]> descargarBoletin(@PathVariable UUID id) {
        byte[] pdf = boletinService.generarArchivoPDFBoletin(id);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=boletin.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/estudiante/{idEstudiante}/periodo/{idPeriodo}/descargar")
    @PreAuthorize("hasAnyAuthority('ACUDIENTE', 'DIRECTOR', 'COORDINADOR', 'ADMINISTRADOR', 'PROFESOR')")
    public ResponseEntity<byte[]> descargarBoletinEstudiante(
            @PathVariable UUID idEstudiante,
            @PathVariable UUID idPeriodo) {
        
        try {
            log.info("Generando boletín PDF para estudiante: {} en período: {}", idEstudiante, idPeriodo);
            
            byte[] pdfBytes = boletinServiceImpl.generarBoletinPorEstudiante(idEstudiante, idPeriodo);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "boletin-" + idEstudiante + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            log.info("Boletín PDF generado exitosamente. Tamaño: {} bytes", pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error generando boletín PDF: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/generar")
    @PreAuthorize("hasAuthority('PROFESOR')")
    public ResponseEntity<BoletinDTO> generarBoletin(
            @RequestParam UUID idEstudiante,
            @RequestParam String periodo) {
        return ResponseEntity.ok(boletinService.generarBoletin(idEstudiante, periodo));
    }
}
