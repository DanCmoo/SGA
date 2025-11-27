package com.sga.service.impl;

import com.sga.dto.EstudianteDTO;
import com.sga.dto.PreinscripcionDTO;
import com.sga.repository.AcudienteRepository;
import com.sga.repository.EstudianteRepository;
import com.sga.service.AcudienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AcudienteServiceImpl implements AcudienteService {

    private final AcudienteRepository acudienteRepository;
    private final EstudianteRepository estudianteRepository;

    @Override
    public void agregarEstudianteACargo(EstudianteDTO estudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public boolean eliminarEstudianteACargo(UUID idEstudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public List<EstudianteDTO> listarEstudiantesACargo(UUID idAcudiente) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public EstudianteDTO obtenerEstudiante(UUID idEstudiante) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public void registrarPreinscripcion(PreinscripcionDTO preinscripcion) {
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
