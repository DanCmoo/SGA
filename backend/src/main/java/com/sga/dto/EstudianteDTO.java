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
    private String nombre2;
    private String apellido;
    private String apellido2;
    private String numeroDocumento;
    private Boolean estado;
    private UUID idAcudiente;
    private String nombre1Acudiente;
    private String nombre2Acudiente;
    private String apellido1Acudiente;
    private String apellido2Acudiente;
    private UUID idGrupo;
    private String nombreGrupo;
    private String gradoSolicitado;
    private HojaDeVidaDTO hojaDeVida;
}
