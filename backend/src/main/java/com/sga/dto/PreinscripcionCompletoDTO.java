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
public class PreinscripcionCompletoDTO {
    private UUID idEstudiante;
    private String nombreEstudiante;
    private String apellidoEstudiante;
    private String numeroDocumento;
    private String nombreAcudiente;
    private String correoAcudiente;
    private String telefonoAcudiente;
    private String gradoSolicitado;
    private String estadoSolicitud; // pendiente, aceptado, rechazado
    private LocalDate fechaRegistro;
}
