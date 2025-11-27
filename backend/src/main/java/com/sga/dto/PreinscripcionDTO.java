package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PreinscripcionDTO {
    // Datos del acudiente
    private String nombre1Acudiente;
    private String nombre2Acudiente;
    private String apellido1Acudiente;
    private String apellido2Acudiente;
    private String cedulaAcudiente;
    private LocalDate fechaNacimientoAcudiente;
    private String telefonoAcudiente;
    private String correoAcudiente;
    
    // Datos del estudiante
    private String nombre1Estudiante;
    private String nombre2Estudiante;
    private String apellido1Estudiante;
    private String apellido2Estudiante;
    private LocalDate fechaNacimiento;
    private String documentoIdentidad;
    private String gradoSolicitado;
}
