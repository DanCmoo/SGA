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
@Table(name = "director")
public class Director extends Usuario {

    @Column(name = "id_director", columnDefinition = "UUID", unique = true)
    private UUID idDirector;

    @PrePersist
    protected void onCreate() {
        if (idDirector == null) {
            idDirector = UUID.randomUUID();
        }
    }
}
