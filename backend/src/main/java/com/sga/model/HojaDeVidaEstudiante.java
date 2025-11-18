package com.sga.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hoja_de_vida_estudiante")
public class HojaDeVidaEstudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_hoja_de_vida", columnDefinition = "UUID")
    private UUID idHojaDeVida;

    @Column(name = "detalles_medicos", columnDefinition = "TEXT")
    private String detallesMedicos;

    @Column(name = "observaciones_aprendizaje", columnDefinition = "TEXT")
    private String observacionesAprendizaje;

    @OneToOne(mappedBy = "hojaDeVida")
    private Estudiante estudiante;
}
