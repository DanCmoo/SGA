package com.sga.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "acudiente")
public class Acudiente extends Usuario {

    @Column(name = "id_acudiente", columnDefinition = "UUID", unique = true)
    private UUID idAcudiente;

    @Column(name = "estado", nullable = false)
    private Boolean estado;

    @OneToMany(mappedBy = "acudiente", cascade = CascadeType.ALL)
    private List<Estudiante> estudiantesACargo = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (idAcudiente == null) {
            idAcudiente = UUID.randomUUID();
        }
        if (estado == null) {
            estado = false; // Por defecto es aspirante
        }
    }
}
