package com.sga.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "token_usuario")
public class Token_Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_token", columnDefinition = "UUID")
    private UUID idToken;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "rol", nullable = false)
    private String rol;

    @Column(name = "requiere_cambio_contrasena", nullable = false)
    @Builder.Default
    private Boolean requiereCambioContrasena = true;

    @OneToOne(mappedBy = "tokenUsuario")
    @JsonBackReference
    private Usuario usuario;
}
