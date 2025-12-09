/**
 * Servicio para gestión de logros y evaluaciones
 */

import { api } from '../api';

export interface CategoriaLogroDTO {
  idCategoria: string;
  nombre: string;
  descripcion?: string;
  logros: LogroDTO[];
}

export interface LogroDTO {
  idLogro: string;
  descripcion: string;
  idCategoria: string;
  nombreCategoria: string;
}

export interface EvaluacionDTO {
  idEvaluacion?: string;
  idEstudiante: string;
  nombreEstudiante?: string;
  idCategoria?: string;
  nombreCategoria?: string;
  logros?: LogroCumplidoDTO[];
  calificacion?: string;
  fechaEvaluacion?: string;
  periodo?: string;
}

export interface EvaluacionPeriodoDTO {
  idEstudiante: string;
  nombreEstudiante: string;
  periodo: PeriodoAcademicoDTO;
  categorias: CategoriaEvaluacionDTO[];
  fechaEvaluacion: string;
}

export interface CategoriaEvaluacionDTO {
  idCategoria: string;
  nombreCategoria: string;
  logrosAlcanzados: LogroDTO[];
  totalLogros: number;
  calificacion: string;
}

export interface HistoricoLogroDTO {
  periodo: PeriodoAcademicoDTO;
  categorias: CategoriaHistoricoDTO[];
}

export interface CategoriaHistoricoDTO {
  idCategoria: string;
  nombreCategoria: string;
  logrosAlcanzados: LogroDTO[];
  totalLogros: number;
  calificacion: string;
}

export interface LogroCumplidoDTO {
  idLogro: string;
  cumplido: boolean;
}

export interface EvaluacionRegistroDTO {
  idEstudiante: string;
  idPeriodo: string;
  categorias: CategoriaEvaluadaDTO[];
}

export interface CategoriaEvaluadaDTO {
  idCategoria: string;
  logrosAlcanzados: string[]; // IDs de logros cumplidos
  calificacion: string; // "Superior", "Alto", "Básico", "Bajo"
}

export interface PeriodoAcademicoDTO {
  idPeriodo: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface EstudianteDTO {
  idEstudiante: string;
  nombre: string;
  nombre2?: string;
  apellido: string;
  apellido2?: string;
  numeroDocumento: string;
  estado: boolean;
  idAcudiente?: string;
  nombre1Acudiente?: string;
  nombre2Acudiente?: string;
  apellido1Acudiente?: string;
  apellido2Acudiente?: string;
  idGrupo?: string;
  nombreGrupo?: string;
  idGrado?: string;
  gradoSolicitado?: string;
}

export class LogroService {
  /**
   * Obtener categorías de logros por grado
   */
  static async obtenerCategoriasPorGrado(idGrado: string): Promise<CategoriaLogroDTO[]> {
    return await api.get<CategoriaLogroDTO[]>(`/logros/grado/${idGrado}/categorias`);
  }

  /**
   * Obtener logros de una categoría
   */
  static async obtenerLogrosPorCategoria(idCategoria: string): Promise<LogroDTO[]> {
    return await api.get<LogroDTO[]>(`/logros/categoria/${idCategoria}`);
  }

  /**
   * Registrar evaluación de logros
   */
  static async registrarEvaluacion(evaluacion: EvaluacionRegistroDTO): Promise<EvaluacionDTO> {
    return await api.post<EvaluacionDTO>('/logros/evaluar', evaluacion);
  }

  /**
   * Obtener histórico de evaluaciones de un estudiante
   */
  static async obtenerHistoricoLogros(idEstudiante: string): Promise<HistoricoLogroDTO[]> {
    return await api.get<HistoricoLogroDTO[]>(`/logros/estudiante/${idEstudiante}/historico`);
  }

  /**
   * Obtener evaluación de un estudiante en un período
   */
  static async obtenerEvaluacionPorPeriodo(
    idEstudiante: string,
    idPeriodo: string
  ): Promise<EvaluacionPeriodoDTO | null> {
    try {
      return await api.get<EvaluacionPeriodoDTO>(
        `/logros/estudiante/${idEstudiante}/periodo/${idPeriodo}`
      );
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener todos los períodos académicos
   */
  static async obtenerPeriodos(): Promise<PeriodoAcademicoDTO[]> {
    return await api.get<PeriodoAcademicoDTO[]>('/periodos');
  }

  /**
   * Obtener estudiantes de un grupo
   */
  static async obtenerEstudiantesGrupo(idGrupo: string): Promise<EstudianteDTO[]> {
    return await api.get<EstudianteDTO[]>(`/grupos/${idGrupo}/estudiantes`);
  }

  /**
   * Obtener información de un estudiante
   */
  static async obtenerEstudiante(idEstudiante: string): Promise<EstudianteDTO> {
    return await api.get<EstudianteDTO>(`/grupos/estudiante/${idEstudiante}`);
  }
}
