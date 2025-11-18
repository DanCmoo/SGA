package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GrupoDetalladoDTO {
    private UUID idGrupo;
    private String nombreGrupo;
    private String nombreGrado;
    private ProfesorDTO directorGrupo;
    private List<EstudianteDTO> estudiantes;
    private Integer cantidadEstudiantes;
}
