package com.sga.service;

import com.sga.dto.BoletinDTO;

import java.util.UUID;

public interface EstudianteService {
    void agregarBoletin(BoletinDTO boletin);
    boolean eliminarBoletin(UUID idBoletin);
    BoletinDTO obtenerBoletin(UUID idBoletin);
}
