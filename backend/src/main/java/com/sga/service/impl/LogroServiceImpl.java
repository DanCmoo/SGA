package com.sga.service.impl;

import com.sga.dto.CategoriaLogroDTO;
import com.sga.dto.EvaluacionDTO;
import com.sga.dto.EvaluacionRegistroDTO;
import com.sga.dto.HistoricoLogroDTO;
import com.sga.dto.LogroDTO;
import com.sga.dto.PeriodoAcademicoDTO;
import com.sga.exception.ResourceNotFoundException;
import com.sga.model.*;
import com.sga.repository.*;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class LogroServiceImpl implements com.sga.service.LogroService {

    private final LogroRepository logroRepository;
    private final EvaluacionCategoriaLogroRepository evaluacionRepository;
    private final CategoriaLogroRepository categoriaLogroRepository;
    private final BoletinRepository boletinRepository;
    private final EstudianteRepository estudianteRepository;
    private final PeriodoAcademicoRepository periodoRepository;
    private final EvaluacionCategoriaLogroRepository evaluacionCategoriaLogroRepository;
    private final EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public List<HistoricoLogroDTO> mostrarHistoricoLogros(UUID idEstudiante) {
        log.info("Obteniendo histórico de logros para estudiante: {}", idEstudiante);
        
        Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + idEstudiante));
        
        List<Boletin> boletines = boletinRepository.findByEstudianteIdEstudiante(idEstudiante);
        
        List<HistoricoLogroDTO> historico = new ArrayList<>();
        for (Boletin boletin : boletines) {
            List<HistoricoLogroDTO.CategoriaHistoricoDTO> categorias = new ArrayList<>();
            
            for (EvaluacionCategoriaLogro evaluacion : boletin.getListaCategoriasEvaluadas()) {
                // Por ahora, devolver todos los logros de la categoría
                // TODO: Implementar almacenamiento de logros individuales alcanzados
                List<LogroDTO> logros = evaluacion.getCategoriaLogro().getLogros().stream()
                        .map(this::convertirLogroADTO)
                        .collect(Collectors.toList());
                
                HistoricoLogroDTO.CategoriaHistoricoDTO categoria = HistoricoLogroDTO.CategoriaHistoricoDTO.builder()
                        .idCategoria(evaluacion.getCategoriaLogro().getIdCategoria())
                        .nombreCategoria(evaluacion.getCategoriaLogro().getNombre())
                        .logrosAlcanzados(logros)
                        .totalLogros(evaluacion.getCategoriaLogro().getLogros().size())
                        .calificacion(evaluacion.getCalificacionLogro())
                        .build();
                categorias.add(categoria);
            }
            
            HistoricoLogroDTO dto = HistoricoLogroDTO.builder()
                    .periodo(PeriodoAcademicoDTO.builder()
                            .idPeriodo(boletin.getPeriodo().getIdPeriodoAcademico())
                            .nombre(boletin.getPeriodo().getNombre())
                            .fechaInicio(boletin.getPeriodo().getFechaInicio())
                            .fechaFin(boletin.getPeriodo().getFechaFin())
                            .build())
                    .categorias(categorias)
                    .build();
            historico.add(dto);
        }
        
        log.info("Se encontraron {} evaluaciones en el histórico", historico.size());
        return historico;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaLogroDTO> obtenerCategoriasPorGrado(UUID idGrado) {
        log.info("Obteniendo categorías de logros para grado: {}", idGrado);
        
        List<CategoriaLogro> categorias = categoriaLogroRepository.findByGradoIdGrado(idGrado);
        
        return categorias.stream()
                .map(this::convertirCategoriaADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LogroDTO> obtenerLogrosPorCategoria(UUID idCategoria) {
        log.info("Obteniendo logros para categoría: {}", idCategoria);
        
        List<Logro> logros = logroRepository.findByCategoriaIdCategoria(idCategoria);
        
        return logros.stream()
                .map(this::convertirLogroADTO)
                .collect(Collectors.toList());
    }

    @Override
    public EvaluacionDTO registrarEvaluacion(EvaluacionRegistroDTO evaluacion) {
        log.info("Registrando evaluación para estudiante: {}", evaluacion.getIdEstudiante());
        
        Estudiante estudiante = estudianteRepository.findById(evaluacion.getIdEstudiante())
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));
        
        PeriodoAcademico periodo = periodoRepository.findById(evaluacion.getIdPeriodo())
                .orElseThrow(() -> new ResourceNotFoundException("Período académico no encontrado"));
        
        // Buscar o crear boletín
        Boletin boletin = boletinRepository
                .findByEstudianteIdEstudianteAndPeriodoIdPeriodoAcademico(
                        evaluacion.getIdEstudiante(), 
                        evaluacion.getIdPeriodo())
                .orElseGet(() -> {
                    Boletin nuevoBoletin = Boletin.builder()
                            .estudiante(estudiante)
                            .periodo(periodo)
                            .listaCategoriasEvaluadas(new ArrayList<>())
                            .build();
                    return boletinRepository.save(nuevoBoletin);
                });
        
        // Registrar evaluaciones de cada categoría
        for (EvaluacionRegistroDTO.CategoriaEvaluadaDTO catEval : evaluacion.getCategorias()) {
            CategoriaLogro categoria = categoriaLogroRepository.findById(catEval.getIdCategoria())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
            
            // Eliminar evaluaciones anteriores de esta categoría en este boletín (de la BD)
            evaluacionCategoriaLogroRepository.deleteByBoletinIdBoletinAndCategoriaLogroIdCategoria(
                    boletin.getIdBoletin(), 
                    catEval.getIdCategoria()
            );
            
            // Forzar la ejecución del DELETE antes de continuar
            entityManager.flush();
            
            // Crear nueva evaluación
            EvaluacionCategoriaLogro nuevaEval = EvaluacionCategoriaLogro.builder()
                    .categoriaLogro(categoria)
                    .calificacionLogro(catEval.getCalificacion())
                    .fechaEvaluacion(LocalDate.now())
                    .periodo(periodo)
                    .boletin(boletin)
                    .build();
            
            evaluacionCategoriaLogroRepository.save(nuevaEval);
        }
        
        // Recargar el boletín con las evaluaciones actualizadas
        boletin = boletinRepository.findById(boletin.getIdBoletin())
                .orElseThrow(() -> new ResourceNotFoundException("Boletín no encontrado"));
        
        log.info("Evaluación registrada exitosamente");
        
        // Construir respuesta con la estructura nueva
        List<EvaluacionDTO.CategoriaEvaluacionDTO> categoriasEvaluadas = boletin.getListaCategoriasEvaluadas().stream()
                .map(ev -> {
                    List<LogroDTO> logros = ev.getCategoriaLogro().getLogros().stream()
                            .map(this::convertirLogroADTO)
                            .collect(Collectors.toList());
                    
                    return EvaluacionDTO.CategoriaEvaluacionDTO.builder()
                            .idCategoria(ev.getCategoriaLogro().getIdCategoria())
                            .nombreCategoria(ev.getCategoriaLogro().getNombre())
                            .logrosAlcanzados(logros)
                            .totalLogros(ev.getCategoriaLogro().getLogros().size())
                            .calificacion(ev.getCalificacionLogro())
                            .build();
                })
                .collect(Collectors.toList());
        
        return EvaluacionDTO.builder()
                .idEstudiante(evaluacion.getIdEstudiante())
                .nombreEstudiante(buildFullName(estudiante))
                .periodo(PeriodoAcademicoDTO.builder()
                        .idPeriodo(periodo.getIdPeriodoAcademico())
                        .nombre(periodo.getNombre())
                        .fechaInicio(periodo.getFechaInicio())
                        .fechaFin(periodo.getFechaFin())
                        .build())
                .categorias(categoriasEvaluadas)
                .fechaEvaluacion(LocalDate.now())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluacionDTO obtenerEvaluacionPorEstudianteYPeriodo(UUID idEstudiante, UUID idPeriodo) {
        log.info("Obteniendo evaluación de estudiante {} en período {}", idEstudiante, idPeriodo);
        
        Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));
        
        PeriodoAcademico periodo = periodoRepository.findById(idPeriodo)
                .orElseThrow(() -> new ResourceNotFoundException("Período académico no encontrado"));
        
        Boletin boletin = boletinRepository
                .findByEstudianteIdEstudianteAndPeriodoIdPeriodoAcademico(idEstudiante, idPeriodo)
                .orElse(null);
        
        if (boletin == null) {
            return null;
        }
        
        // Construir lista de categorías evaluadas
        List<EvaluacionDTO.CategoriaEvaluacionDTO> categoriasEvaluadas = boletin.getListaCategoriasEvaluadas().stream()
                .map(evaluacionCategoria -> {
                    CategoriaLogro categoria = evaluacionCategoria.getCategoriaLogro();
                    
                    // Por ahora, devolver todos los logros de la categoría
                    // TODO: Implementar almacenamiento de logros individuales alcanzados
                    List<LogroDTO> logros = categoria.getLogros().stream()
                            .map(this::convertirLogroADTO)
                            .collect(Collectors.toList());
                    
                    // Total de logros en la categoría
                    int totalLogros = categoria.getLogros().size();
                    
                    return EvaluacionDTO.CategoriaEvaluacionDTO.builder()
                            .idCategoria(categoria.getIdCategoria())
                            .nombreCategoria(categoria.getNombre())
                            .logrosAlcanzados(logros)
                            .totalLogros(totalLogros)
                            .calificacion(evaluacionCategoria.getCalificacionLogro())
                            .build();
                })
                .collect(Collectors.toList());
        
        return EvaluacionDTO.builder()
                .idEstudiante(idEstudiante)
                .nombreEstudiante(buildFullName(estudiante))
                .periodo(PeriodoAcademicoDTO.builder()
                        .idPeriodo(periodo.getIdPeriodoAcademico())
                        .nombre(periodo.getNombre())
                        .fechaInicio(periodo.getFechaInicio())
                        .fechaFin(periodo.getFechaFin())
                        .build())
                .categorias(categoriasEvaluadas)
                .fechaEvaluacion(LocalDate.now())
                .build();
    }
    
    private CategoriaLogroDTO convertirCategoriaADTO(CategoriaLogro categoria) {
        List<LogroDTO> logros = categoria.getLogros().stream()
                .map(this::convertirLogroADTO)
                .collect(Collectors.toList());
        
        return CategoriaLogroDTO.builder()
                .idCategoria(categoria.getIdCategoria())
                .nombre(categoria.getNombre())
                .logros(logros)
                .build();
    }
    
    private LogroDTO convertirLogroADTO(Logro logro) {
        return LogroDTO.builder()
                .idLogro(logro.getIdLogro())
                .descripcion(logro.getDescripcion())
                .idCategoria(logro.getCategoria().getIdCategoria())
                .nombreCategoria(logro.getCategoria().getNombre())
                .build();
    }
    
    private String buildFullName(Estudiante estudiante) {
        StringBuilder fullName = new StringBuilder();
        fullName.append(estudiante.getNombre());
        if (estudiante.getNombre2() != null && !estudiante.getNombre2().isEmpty()) {
            fullName.append(" ").append(estudiante.getNombre2());
        }
        fullName.append(" ").append(estudiante.getApellido());
        if (estudiante.getApellido2() != null && !estudiante.getApellido2().isEmpty()) {
            fullName.append(" ").append(estudiante.getApellido2());
        }
        return fullName.toString();
    }
    
    private String formatPeriodo(PeriodoAcademico periodo) {
        return periodo.getFechaInicio() + " - " + periodo.getFechaFin();
    }
}
