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
@Table(name = "grado")
public class Grado {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_grado", columnDefinition = "UUID")
    private UUID idGrado;

    @Column(name = "nombre_grado", nullable = false)
    private String nombreGrado; // Párvulos, Caminadores, Pre-jardín

    @OneToMany(mappedBy = "grado", cascade = CascadeType.ALL)
    private List<CategoriaLogro> categoriasLogros = new ArrayList<>();
}
