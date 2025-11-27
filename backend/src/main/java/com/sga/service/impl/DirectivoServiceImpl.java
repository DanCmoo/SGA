package com.sga.service.impl;

import com.sga.dto.EvaluacionDTO;
import com.sga.dto.GrupoDTO;
import com.sga.repository.DirectorRepository;
import com.sga.repository.EvaluacionCategoriaLogroRepository;
import com.sga.repository.GrupoRepository;
import com.sga.service.DirectivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DirectivoServiceImpl implements DirectivoService {

    private final DirectorRepository directorRepository;
    private final GrupoRepository grupoRepository;
    private final EvaluacionCategoriaLogroRepository evaluacionRepository;

    @Override
    public List<GrupoDTO> listarGruposPorGrado(String grado) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public List<EvaluacionDTO> obtenerHistoricoLogros(UUID idEstudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
