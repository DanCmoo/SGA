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
public class BoletinDTO {
    private UUID idBoletin;
    private UUID idEstudiante;
    private String nombreEstudiante;
    private String periodo;
    private LocalDate fechaInicioPeriodo;
    private LocalDate fechaFinPeriodo;
    private List<EvaluacionDTO> evaluaciones;
    private LocalDate fechaGeneracion;
}
