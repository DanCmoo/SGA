package com.sga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenDTO {
    private String token;
    private String tipo;
    private LocalDateTime expiracion;
    private UsuarioDTO usuario;
    private Boolean requiereCambioContrasena;
}
