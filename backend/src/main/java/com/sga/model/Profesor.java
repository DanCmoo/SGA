package com.sga.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "profesor")
public class Profesor extends Usuario {

    @Column(name = "id_profesor", columnDefinition = "UUID", unique = true)
    private UUID idProfesor;

    @Column(name = "grupo_asignado")
    private String grupoAsignado;

    @PrePersist
    protected void onCreate() {
        if (idProfesor == null) {
            idProfesor = UUID.randomUUID();
        }
    }
}
