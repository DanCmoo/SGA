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
public class HistoricoLogroDTO {
    private PeriodoAcademicoDTO periodo;
    private List<CategoriaHistoricoDTO> categorias;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoriaHistoricoDTO {
        private UUID idCategoria;
        private String nombreCategoria;
        private List<LogroDTO> logrosAlcanzados;
        private Integer totalLogros;
        private String calificacion;
    }
}
