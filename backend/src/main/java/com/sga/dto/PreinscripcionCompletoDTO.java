package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PreinscripcionCompletoDTO {
    private UUID idHojaDeVida;
    
    // Datos del acudiente
    private UUID idAcudiente;
    private String nombre1Acudiente;
    private String nombre2Acudiente;
    private String apellido1Acudiente;
    private String apellido2Acudiente;
    private String cedulaAcudiente;
    private String correoAcudiente;
    private String telefonoAcudiente;
    
    // Datos del estudiante
    private String nombre1Estudiante;
    private String nombre2Estudiante;
    private String apellido1Estudiante;
    private String apellido2Estudiante;
    private LocalDate fechaNacimiento;
    private String documentoIdentidad;
    private String gradoSolicitado;
    
    // Metadatos
    private String estado; // PENDIENTE, APROBADO, RECHAZADO
    private LocalDateTime fechaSolicitud;
}
