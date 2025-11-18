package com.sga.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "boletin")
public class Boletin {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_boletin", columnDefinition = "UUID")
    private UUID idBoletin;

    @ManyToOne
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;

    @OneToMany(mappedBy = "boletin", cascade = CascadeType.ALL)
    private List<EvaluacionCategoriaLogro> listaCategoriasEvaluadas = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_periodo", nullable = false)
    private PeriodoAcademico periodo;
}
