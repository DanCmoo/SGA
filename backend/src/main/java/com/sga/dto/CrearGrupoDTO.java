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
public class CrearGrupoDTO {
    private String nombreGrupo;
    private UUID idGrado;
    private UUID idProfesor;
}
