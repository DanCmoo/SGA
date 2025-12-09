package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PeriodoAcademicoDTO {
    private UUID idPeriodo;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
