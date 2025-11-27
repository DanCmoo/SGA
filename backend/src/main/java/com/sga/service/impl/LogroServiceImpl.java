package com.sga.service.impl;

import com.sga.dto.EvaluacionDTO;
import com.sga.repository.EvaluacionCategoriaLogroRepository;
import com.sga.repository.LogroRepository;
import com.sga.service.LogroService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LogroServiceImpl implements LogroService {

    private final LogroRepository logroRepository;
    private final EvaluacionCategoriaLogroRepository evaluacionRepository;

    @Override
    public List<EvaluacionDTO> mostrarHistoricoLogros(UUID idEstudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
