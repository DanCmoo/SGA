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
public class ProfesorDTO {
    private UUID idProfesor;
    private String nombre;
    private String apellido;
    private String correoElectronico;
    private String especialidad;
    private List<GrupoDTO> gruposAsignados;
}
