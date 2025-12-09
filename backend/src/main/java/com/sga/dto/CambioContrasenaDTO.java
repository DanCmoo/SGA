package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CambioContrasenaDTO {
    private String contrasenaActual;
    private String contrasenaNueva;
    private String confirmarContrasena;
}
