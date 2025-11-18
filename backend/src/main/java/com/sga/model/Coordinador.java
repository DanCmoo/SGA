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
@Table(name = "coordinador")
public class Coordinador extends Usuario {

    @Column(name = "id_coordinador", columnDefinition = "UUID", unique = true)
    private UUID idCoordinador;

    @PrePersist
    protected void onCreate() {
        if (idCoordinador == null) {
            idCoordinador = UUID.randomUUID();
        }
    }
}
