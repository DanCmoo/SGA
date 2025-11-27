package com.sga.service.impl;

import com.sga.dto.BoletinDTO;
import com.sga.repository.BoletinRepository;
import com.sga.repository.EstudianteRepository;
import com.sga.service.EstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EstudianteServiceImpl implements EstudianteService {

    private final EstudianteRepository estudianteRepository;
    private final BoletinRepository boletinRepository;

    @Override
    public void agregarBoletin(BoletinDTO boletin) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public boolean eliminarBoletin(UUID idBoletin) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public BoletinDTO obtenerBoletin(UUID idBoletin) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
