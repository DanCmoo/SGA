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
public class AcudienteDTO {
    private UUID idAcudiente;
    private String nombre;
    private String nombre2;
    private String apellido;
    private String apellido2;
    private String correoElectronico;
    private String telefono;
    private Boolean estado;
    private List<EstudianteDTO> estudiantesACargo;
}
