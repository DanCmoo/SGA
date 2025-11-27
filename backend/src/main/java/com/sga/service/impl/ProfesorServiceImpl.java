package com.sga.service.impl;

import com.sga.repository.LogroRepository;
import com.sga.repository.ProfesorRepository;
import com.sga.service.ProfesorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfesorServiceImpl implements ProfesorService {

    private final ProfesorRepository profesorRepository;
    private final LogroRepository logroRepository;

    @Override
    public void actualizarCumplimientoLogro(UUID idLogro) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
