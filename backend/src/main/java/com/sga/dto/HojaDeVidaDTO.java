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
public class HojaDeVidaDTO {
    private UUID idHojaDeVida;
    private UUID idEstudiante;
    private String nombreCompleto;
    private String nombreAcudiente;
    private LocalDate fechaNacimiento;
    private String documentoIdentidad;
    private List<String> detallesMedicos;
    private List<String> observacionesAprendizaje;
}
