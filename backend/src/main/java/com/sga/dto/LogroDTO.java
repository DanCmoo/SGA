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
public class LogroDTO {
    private UUID idLogro;
    private String descripcion;
    private UUID idCategoria;
    private String nombreCategoria;
}
