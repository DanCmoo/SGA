package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EvaluacionDTO {
    private UUID idEvaluacion;
    private UUID idEstudiante;
    private String nombreEstudiante;
    private UUID idCategoria;
    private String nombreCategoria;
    private List<LogroCumplidoDTO> logros;
    private String calificacion;
    private LocalDate fechaEvaluacion;
    private String periodo;
}
