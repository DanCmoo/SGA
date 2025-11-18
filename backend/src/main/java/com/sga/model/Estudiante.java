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
@Table(name = "estudiante")
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_estudiante", columnDefinition = "UUID")
    private UUID idEstudiante;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido", nullable = false)
    private String apellido;

    @Column(name = "numero_documento", nullable = false, unique = true)
    private String numeroDocumento;

    @Column(name = "estado", nullable = false)
    private Boolean estado;

    @ManyToOne
    @JoinColumn(name = "id_acudiente")
    private Acudiente acudiente;

    @ManyToOne
    @JoinColumn(name = "id_grupo")
    private Grupo grupoAsignado;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_hoja_de_vida", referencedColumnName = "id_hoja_de_vida")
    private HojaDeVidaEstudiante hojaDeVida;

    @OneToMany(mappedBy = "estudiante", cascade = CascadeType.ALL)
    private List<Boletin> boletines = new ArrayList<>();
}
