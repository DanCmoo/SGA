package com.sga.service.impl;

import com.sga.dto.LogroDTO;
import com.sga.repository.CategoriaLogroRepository;
import com.sga.repository.LogroRepository;
import com.sga.service.CategoriaLogroService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoriaLogroServiceImpl implements CategoriaLogroService {

    private final CategoriaLogroRepository categoriaLogroRepository;
    private final LogroRepository logroRepository;

    @Override
    public void agregarLogro(LogroDTO logro) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public boolean eliminarLogro(UUID idLogro) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public LogroDTO obtenerLogro(UUID idLogro) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
