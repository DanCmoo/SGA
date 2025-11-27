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
public class RegistroDTO {
    private String nombre;
    private String nombre2;
    private String apellido;
    private String apellido2;
    private String cedula;
    private String correoElectronico;
    private LocalDate fechaNacimiento;
    private String rol;
    private String contrasena;
}
