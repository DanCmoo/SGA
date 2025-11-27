package com.sga.service.impl;

import com.sga.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Usuario usuario;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (usuario.getTokenUsuario() == null) {
            throw new IllegalStateException("Usuario sin token de autenticación");
        }
        return List.of(new SimpleGrantedAuthority(usuario.getTokenUsuario().getRol()));
    }

    @Override
    public String getPassword() {
        if (usuario.getTokenUsuario() == null) {
            throw new IllegalStateException("Usuario sin token de autenticación");
        }
        return usuario.getTokenUsuario().getContrasena();
    }

    @Override
    public String getUsername() {
        if (usuario.getCorreoElectronico() == null) {
            throw new IllegalStateException("Usuario sin correo electrónico");
        }
        return usuario.getCorreoElectronico();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
}
