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
public class CategoriaLogroDTO {
    private UUID idCategoria;
    private String nombre;
    private String descripcion;
    private List<LogroDTO> logros;
}
