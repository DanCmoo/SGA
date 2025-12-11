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
        throw new UnsupportedOperationException("Use generarBoletinPorEstudiante en su lugar");
    }
    
    public byte[] generarBoletinPorEstudiante(UUID idEstudiante, UUID idPeriodo) {
        try {
            Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            PeriodoAcademico periodo = periodoAcademicoRepository.findById(idPeriodo)
                    .orElseThrow(() -> new RuntimeException("Período académico no encontrado"));

            // Buscar o crear boletín
            Boletin boletin = boletinRepository
                    .findByEstudianteIdEstudianteAndPeriodoIdPeriodoAcademico(idEstudiante, idPeriodo)
                    .orElseGet(() -> {
                        Boletin nuevoBoletin = Boletin.builder()
                                .estudiante(estudiante)
                                .periodo(periodo)
                                .build();
                        return boletinRepository.save(nuevoBoletin);
                    });

            // Obtener evaluaciones del boletín
            List<EvaluacionCategoriaLogro> evaluaciones = evaluacionRepository
                    .findByBoletinIdBoletin(boletin.getIdBoletin());

            return generarPDF(estudiante, periodo, evaluaciones);
        } catch (Exception e) {
            throw new RuntimeException("Error generando boletín PDF: " + e.getMessage(), e);
        }
    }
    
    private byte[] generarPDF(Estudiante estudiante, PeriodoAcademico periodo, 
                             List<EvaluacionCategoriaLogro> evaluaciones) {
        try {
            com.itextpdf.kernel.pdf.PdfWriter writer = new com.itextpdf.kernel.pdf.PdfWriter(
                    new java.io.ByteArrayOutputStream());
            com.itextpdf.kernel.pdf.PdfDocument pdf = new com.itextpdf.kernel.pdf.PdfDocument(writer);
            com.itextpdf.layout.Document document = new com.itextpdf.layout.Document(pdf);
            
            // Encabezado
            com.itextpdf.layout.element.Paragraph header = new com.itextpdf.layout.element.Paragraph(
                    "BOLETÍN ACADÉMICO\nFundación Institución Salesiana")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER)
                    .setFontSize(18)
                    .setBold()
                    .setMarginBottom(20);
            document.add(header);
            
            // Información del estudiante
            document.add(new com.itextpdf.layout.element.Paragraph("Estudiante: " + 
                    estudiante.getNombre() + " " + estudiante.getApellido())
                    .setFontSize(12)
                    .setBold());
            document.add(new com.itextpdf.layout.element.Paragraph("Grado: " + 
                    (estudiante.getGrupoAsignado() != null && estudiante.getGrupoAsignado().getGrado() != null ? 
                        estudiante.getGrupoAsignado().getGrado().getNombreGrado() : "N/A"))
                    .setFontSize(12));
            document.add(new com.itextpdf.layout.element.Paragraph("Grupo: " + 
                    (estudiante.getGrupoAsignado() != null ? estudiante.getGrupoAsignado().getNombreGrupo() : "N/A"))
                    .setFontSize(12));
            document.add(new com.itextpdf.layout.element.Paragraph("Período: " + 
                    periodo.getFechaInicio() + " - " + periodo.getFechaFin())
                    .setFontSize(12)
                    .setMarginBottom(20));
            
            // Tabla de evaluaciones
            float[] columnWidths = {4, 1};
            com.itextpdf.layout.element.Table table = new com.itextpdf.layout.element.Table(columnWidths);
            table.setWidth(com.itextpdf.layout.properties.UnitValue.createPercentValue(100));
            
            // Encabezados de tabla
            table.addHeaderCell(new com.itextpdf.layout.element.Cell()
                    .add(new com.itextpdf.layout.element.Paragraph("Categoría de Logro"))
                    .setBold()
                    .setBackgroundColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY));
            table.addHeaderCell(new com.itextpdf.layout.element.Cell()
                    .add(new com.itextpdf.layout.element.Paragraph("Calificación"))
                    .setBold()
                    .setBackgroundColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            
            // Agrupar evaluaciones por categoría y calcular promedios
            java.util.Map<String, java.util.List<EvaluacionCategoriaLogro>> porCategoria = evaluaciones.stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                            e -> e.getCategoriaLogro().getNombre()));
            
            for (java.util.Map.Entry<String, java.util.List<EvaluacionCategoriaLogro>> entry : porCategoria.entrySet()) {
                String nombreCategoria = entry.getKey();
                java.util.List<EvaluacionCategoriaLogro> evals = entry.getValue();
                
                // Calcular promedio de calificaciones (convertir String a Double)
                double promedio = evals.stream()
                        .mapToDouble(e -> {
                            try {
                                return Double.parseDouble(e.getCalificacionLogro());
                            } catch (NumberFormatException ex) {
                                return 0.0;
                            }
                        })
                        .average()
                        .orElse(0.0);
                
                table.addCell(new com.itextpdf.layout.element.Cell()
                        .add(new com.itextpdf.layout.element.Paragraph(nombreCategoria)));
                table.addCell(new com.itextpdf.layout.element.Cell()
                        .add(new com.itextpdf.layout.element.Paragraph(String.format("%.1f", promedio)))
                        .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            }
            
            document.add(table);
            
            // Pie de página
            document.add(new com.itextpdf.layout.element.Paragraph("\nFecha de generación: " + 
                    LocalDate.now().toString())
                    .setFontSize(10)
                    .setMarginTop(20)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));
            
            document.close();
            
            return ((java.io.ByteArrayOutputStream) writer.getOutputStream()).toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error creando documento PDF: " + e.getMessage(), e);
        }
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
