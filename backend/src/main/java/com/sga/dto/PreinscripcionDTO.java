package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PreinscripcionDTO {
    private String nombreEstudiante;
    private String apellidoEstudiante;
    private String numeroDocumento;
    private String correoAcudiente;
    private String telefonoAcudiente;
    private String gradoSolicitado;
}
