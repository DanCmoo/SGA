import { api } from '../api'
import type { HistoricoLogroDTO } from './logro.service'

export interface EstudianteAcudienteDTO {
  idEstudiante: string
  nombre: string
  nombre2?: string
  apellido: string
  apellido2?: string
  numeroDocumento: string
  estado: boolean
  idGrado?: string
  nombreGrupo?: string
}

export const AcudienteService = {
  /**
   * Obtiene los estudiantes a cargo del acudiente
   */
  async obtenerEstudiantesACargo(idAcudiente: string): Promise<EstudianteAcudienteDTO[]> {
    return await api.get<EstudianteAcudienteDTO[]>(`/acudiente/${idAcudiente}/estudiantes`)
  },

  /**
   * Obtiene el histórico de logros de un estudiante
   */
  async obtenerHistoricoEstudiante(
    idAcudiente: string,
    idEstudiante: string
  ): Promise<HistoricoLogroDTO[]> {
    return await api.get<HistoricoLogroDTO[]>(
      `/acudiente/${idAcudiente}/estudiante/${idEstudiante}/historico`
    )
  }
}
