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
@Table(name = "categoria_logro")
public class CategoriaLogro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_categoria", columnDefinition = "UUID")
    private UUID idCategoria;

    @Column(name = "nombre", nullable = false)
    private String nombre; // Psicosocial, Psicomotor, Cognitivo, Procedimental

    @ManyToOne
    @JoinColumn(name = "id_grado")
    private Grado grado;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    private List<Logro> logros = new ArrayList<>();
}
