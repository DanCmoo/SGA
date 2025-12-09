import { api } from '../api'

export interface GradoDTO {
  idGrado: string
  nombreGrado: string
}

export interface GrupoDTO {
  idGrupo: string
  nombre: string
  idGrado: string
  nombreGrado: string
  idProfesor?: string
  nombreProfesor?: string
  cantidadEstudiantes: number
}

export interface EstudianteDTO {
  idEstudiante: string
  nombre: string
  nombre2?: string
  apellido: string
  apellido2?: string
  numeroDocumento: string
  estado?: boolean
  idGrado?: string
  nombreGrupo?: string
  gradoSolicitado?: string
}

export interface HojaDeVidaDTO {
  idHojaDeVida: string
  idEstudiante: string
  nombreCompleto: string
  nombreAcudiente?: string
  fechaNacimiento: string
  documentoIdentidad: string
  detallesMedicos: string[]
  observacionesAprendizaje: string[]
}

export const DirectivoService = {
  /**
   * Obtiene todos los grados disponibles
   */
  async obtenerGrados(): Promise<GradoDTO[]> {
    return await api.get<GradoDTO[]>('/grados')
  },

  /**
   * Obtiene los grupos de un grado específico
   */
  async obtenerGruposPorGrado(idGrado: string): Promise<GrupoDTO[]> {
    return await api.get<GrupoDTO[]>(`/directivo/grado/${idGrado}/grupos`)
  },

  /**
   * Obtiene los estudiantes de un grupo específico
   */
  async obtenerEstudiantesDeGrupo(idGrupo: string): Promise<EstudianteDTO[]> {
    return await api.get<EstudianteDTO[]>(`/directivo/grupo/${idGrupo}/estudiantes`)
  },

  /**
   * Obtiene la hoja de vida de un estudiante
   */
  async obtenerHojaDeVida(idEstudiante: string): Promise<HojaDeVidaDTO> {
    return await api.get<HojaDeVidaDTO>(`/directivo/estudiante/${idEstudiante}/hoja-vida`)
  },

  /**
   * Actualiza la hoja de vida de un estudiante
   */
  async actualizarHojaDeVida(idEstudiante: string, hojaDeVida: HojaDeVidaDTO): Promise<HojaDeVidaDTO> {
    return await api.put<HojaDeVidaDTO>(`/directivo/estudiante/${idEstudiante}/hoja-vida`, hojaDeVida)
  }
}
