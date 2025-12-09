package com.sga.service.impl;

import com.sga.dto.BoletinDTO;
import com.sga.dto.EvaluacionDTO;
import com.sga.model.*;
import com.sga.repository.*;
import com.sga.service.BoletinService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BoletinServiceImpl implements BoletinService {

    private final BoletinRepository boletinRepository;
    private final EstudianteRepository estudianteRepository;
    private final PeriodoAcademicoRepository periodoAcademicoRepository;
    private final EvaluacionCategoriaLogroRepository evaluacionRepository;

    @Override
    public void agregarCategoriaEvaluada(EvaluacionDTO evaluacion) {
        // Implementación básica - se puede expandir según necesidades
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public boolean eliminarCategoriaEvaluada(UUID idCategoria) {
        // Implementación básica - se puede expandir según necesidades
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    @Override
    public byte[] generarArchivoPDFBoletin(UUID idBoletin) {
        // Implementación básica - se puede expandir según necesidades
        // Por ahora retorna un PDF vacío
        return new byte[0];
    }

    @Override
    public BoletinDTO generarBoletin(UUID idEstudiante, String periodo) {
        Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        // Buscar periodo académico (simplificado - asume que periodo es un identificador)
        PeriodoAcademico periodoAcademico = periodoAcademicoRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Periodo académico no encontrado"));

        // Verificar si ya existe un boletín para este estudiante y periodo
        Boletin boletin = boletinRepository
                .findByEstudianteIdEstudianteAndPeriodoIdPeriodoAcademico(idEstudiante, periodoAcademico.getIdPeriodoAcademico())
                .orElseGet(() -> {
                    Boletin nuevoBoletin = Boletin.builder()
                            .estudiante(estudiante)
                            .periodo(periodoAcademico)
                            .build();
                    return boletinRepository.save(nuevoBoletin);
                });

        // El boletín ya no contiene evaluaciones directamente, se consultan por el LogroService
        return BoletinDTO.builder()
                .idBoletin(boletin.getIdBoletin())
                .idEstudiante(estudiante.getIdEstudiante())
                .nombreEstudiante(estudiante.getNombre() + " " + estudiante.getApellido())
                .periodo(periodo)
                .fechaInicioPeriodo(periodoAcademico.getFechaInicio())
                .fechaFinPeriodo(periodoAcademico.getFechaFin())
                .fechaGeneracion(LocalDate.now())
                .build();
    }

    @Override
    public EvaluacionDTO obtenerCategoriaEvaluada(UUID idCategoria) {
        // Implementación básica - se puede expandir según necesidades
        throw new UnsupportedOperationException("Método no implementado aún");
    }

    // Método deprecado - EvaluacionDTO ha cambiado de estructura
    /*
    private EvaluacionDTO convertirAEvaluacionDTO(EvaluacionCategoriaLogro evaluacion) {
        return EvaluacionDTO.builder()
                .idEvaluacion(evaluacion.getIdEvaluacion())
                .idCategoria(evaluacion.getCategoriaLogro().getIdCategoria())
                .nombreCategoria(evaluacion.getCategoriaLogro().getNombre())
                .calificacion(evaluacion.getCalificacionLogro())
                .fechaEvaluacion(evaluacion.getFechaEvaluacion())
                .build();
    }
    */
}
