package com.sga.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    // Campos para preinscripción
    @Column(name = "nombre_estudiante")
    private String nombreEstudiante;

    @Column(name = "nombre2_estudiante")
    private String nombre2Estudiante;

    @Column(name = "apellido_estudiante")
    private String apellidoEstudiante;

    @Column(name = "apellido2_estudiante")
    private String apellido2Estudiante;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "documento_identidad")
    private String documentoIdentidad;

    @Column(name = "grado_solicitado")
    private String gradoSolicitado;

    @Column(name = "estado_preinscripcion")
    private String estadoPreinscripcion; // PENDIENTE, APROBADO, RECHAZADO

    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud;

    @ManyToOne
    @JoinColumn(name = "id_acudiente")
    private Acudiente acudiente;

    @OneToOne(mappedBy = "hojaDeVida")
    private Estudiante estudiante;
}
