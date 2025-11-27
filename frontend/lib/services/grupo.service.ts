/**
 * Servicio para gestión de grupos
 */

import { api } from '../api';

export interface GradoDTO {
  idGrado: string;
  nombreGrado: string;
}

export interface GrupoCreacionDTO {
  nombre: string;
  idGrado: string;
  idProfesor: string;
}

export interface GrupoDTO {
  idGrupo: string;
  nombre: string;
  idGrado: string;
  nombreGrado: string;
  idProfesor: string;
  nombreProfesor: string;
  cantidadEstudiantes: number;
}

export interface ProfesorDTO {
  idUsuario: string;
  nombre: string;
  nombre2?: string;
  apellido: string;
  apellido2?: string;
  correoElectronico: string;
}

export interface EstudianteAprobadoDTO {
  idEstudiante: string;
  nombre: string;
  nombre2?: string;
  apellido: string;
  apellido2?: string;
  numeroDocumento: string;
  gradoSolicitado: string;
}

export class GrupoService {
  /**
   * Obtener todos los grados
   */
  static async obtenerGrados(): Promise<GradoDTO[]> {
    return await api.get<GradoDTO[]>('/grados', {
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`
      }
    });
  }

  /**
   * Obtener todos los profesores
   */
  static async obtenerProfesores(): Promise<ProfesorDTO[]> {
    return await api.get<ProfesorDTO[]>('/usuarios/profesores', {
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`
      }
    });
  }

  /**
   * Obtener estudiantes aprobados sin grupo asignado
   */
  static async obtenerEstudiantesAprobados(): Promise<EstudianteAprobadoDTO[]> {
    return await api.get<EstudianteAprobadoDTO[]>('/admisiones/estudiantes-aprobados', {
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`
      }
    });
  }

  /**
   * Crear un nuevo grupo
   */
  static async crearGrupo(grupo: GrupoCreacionDTO): Promise<GrupoDTO> {
    return await api.post<GrupoDTO>('/grupos', grupo, {
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`
      }
    });
  }

  /**
   * Asignar estudiante a grupo
   */
  static async asignarEstudianteAGrupo(idEstudiante: string, idGrupo: string): Promise<void> {
    return await api.post<void>(
      `/admisiones/asignar-grupo?idEstudiante=${idEstudiante}&idGrupo=${idGrupo}`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`
        }
      }
    );
  }

  /**
   * Obtener todos los grupos
   */
  static async obtenerGrupos(): Promise<GrupoDTO[]> {
    return await api.get<GrupoDTO[]>('/grupos', {
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`
      }
    });
  }

  /**
   * Obtener grupos por grado
   */
  static async obtenerGruposPorGrado(idGrado: string): Promise<GrupoDTO[]> {
    return await api.get<GrupoDTO[]>(`/grupos/grado/${idGrado}`, {
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`
      }
    });
  }
}
