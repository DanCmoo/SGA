package com.sga.service;

import com.sga.dto.LogroDTO;

import java.util.UUID;

public interface CategoriaLogroService {
    void agregarLogro(LogroDTO logro);
    boolean eliminarLogro(UUID idLogro);
    LogroDTO obtenerLogro(UUID idLogro);
}
