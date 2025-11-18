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
public class AdmisionDTO {
    private UUID idEstudiante;
    private UUID idGrupo;
    private Boolean estadoAdmision;
    private LocalDate fechaProceso;
}
