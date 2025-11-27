package com.sga.service.impl;

import com.sga.repository.EstudianteRepository;
import com.sga.repository.HojaDeVidaRepository;
import com.sga.service.HojaDeVidaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class HojaDeVidaServiceImpl implements HojaDeVidaService {

    private final HojaDeVidaRepository hojaDeVidaRepository;
    private final EstudianteRepository estudianteRepository;

    @Override
    public void actualizarHojaDeVida(UUID idEstudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
