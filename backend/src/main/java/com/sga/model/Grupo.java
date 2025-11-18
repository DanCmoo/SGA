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
@Table(name = "grupo")
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_grupo", columnDefinition = "UUID")
    private UUID idGrupo;

    @Column(name = "nombre_grupo", nullable = false)
    private String nombreGrupo;

    @ManyToOne
    @JoinColumn(name = "id_grado", nullable = false)
    private Grado grado;

    @ManyToOne
    @JoinColumn(name = "id_director_grupo")
    private Profesor directorDeGrupo;

    @OneToMany(mappedBy = "grupoAsignado", cascade = CascadeType.ALL)
    private List<Estudiante> estudiantes = new ArrayList<>();
}
