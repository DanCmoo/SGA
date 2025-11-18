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
public class UsuarioCreacionDTO {
    private String nombre;
    private String apellido;
    private String cedula;
    private String correoElectronico;
    private LocalDate fechaNacimiento;
    private String rol;
    private String contrasenaGenerada;
}
