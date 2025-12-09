package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    private UUID idUsuario;
    private String nombre;
    private String nombre2;
    private String apellido;
    private String apellido2;
    private String cedula;
    private String correoElectronico;
    private LocalDate fechaNacimiento;
    private String rol;
    
    // Datos específicos del profesor
    private ProfesorInfoDTO profesor;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProfesorInfoDTO {
        private String grupoAsignado;
    }
}
