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
public class EvaluacionRegistroDTO {
    private UUID idEstudiante;
    private UUID idPeriodo;
    private List<CategoriaEvaluadaDTO> categorias;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoriaEvaluadaDTO {
        private UUID idCategoria;
        private List<UUID> logrosAlcanzados; // IDs de los logros marcados como cumplidos
        private String calificacion; // "Superior", "Alto", "Básico", "Bajo"
    }
}
