package com.sga.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "evaluacion_categoria_logro")
public class EvaluacionCategoriaLogro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_evaluacion", columnDefinition = "UUID")
    private UUID idEvaluacion;

    @Column(name = "calificacion_logro", nullable = false)
    private String calificacionLogro; // Puntuación calculada (0-100)

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaLogro categoriaLogro;

    @Column(name = "fecha_evaluacion", nullable = false)
    private LocalDate fechaEvaluacion;

    @ManyToOne
    @JoinColumn(name = "id_periodo", nullable = false)
    private PeriodoAcademico periodo;

    @ManyToOne
    @JoinColumn(name = "id_boletin")
    private Boletin boletin;
}
