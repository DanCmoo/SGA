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
    private String nombreGrupo;
    private String nombreGrado;
    private UUID idDirectorGrupo;
    private String nombreDirectorGrupo;
    private Integer cantidadEstudiantes;
}
