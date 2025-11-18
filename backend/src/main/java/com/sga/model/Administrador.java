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
@Table(name = "administrador")
public class Administrador extends Usuario {

    @Column(name = "id_administrador", columnDefinition = "UUID", unique = true)
    private UUID idAdministrador;

    @PrePersist
    protected void onCreate() {
        if (idAdministrador == null) {
            idAdministrador = UUID.randomUUID();
        }
    }
}
