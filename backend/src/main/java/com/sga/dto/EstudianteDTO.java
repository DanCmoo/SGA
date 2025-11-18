package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EstudianteDTO {
    private UUID idEstudiante;
    private String nombre;
    private String apellido;
    private String numeroDocumento;
    private Boolean estado;
    private UUID idAcudiente;
    private String nombreAcudiente;
    private UUID idGrupo;
    private String nombreGrupo;
    private HojaDeVidaDTO hojaDeVida;
}
