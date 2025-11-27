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
public class GrupoDTO {
    private UUID idGrupo;
    private String nombre;
    private UUID idGrado;
    private String nombreGrado;
    private UUID idProfesor;
    private String nombreProfesor;
    private Integer cantidadEstudiantes;
}
