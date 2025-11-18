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
public class GradoConGruposDTO {
    private UUID idGrado;
    private String nombreGrado;
    private List<GrupoDTO> grupos;
}
