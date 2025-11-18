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
public class HojaDeVidaDTO {
    private UUID idHojaDeVida;
    private String detallesMedicos;
    private String observacionesAprendizaje;
    private LocalDate fechaActualizacion;
}
