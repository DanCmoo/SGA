/**
 * Servicio para gestión de boletines académicos
 */

import { api, getAuthHeaders } from '../api';

export interface BoletinDTO {
  idBoletin: string;
  idEstudiante: string;
  nombreEstudiante: string;
  periodo: string;
  fechaInicioPeriodo: string;
  fechaFinPeriodo: string;
  fechaGeneracion: string;
}

/**
 * Servicio de Boletines
 */
export const BoletinService = {
  /**
   * Descargar boletín en formato PDF
   */
  async descargarBoletin(idEstudiante: string, idPeriodo: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/boletines/estudiante/${idEstudiante}/periodo/${idPeriodo}/descargar`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error descargando boletín: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error en BoletinService.descargarBoletin:', error);
      throw error;
    }
  },

  /**
   * Descargar boletín y guardarlo automáticamente
   */
  async descargarYGuardarBoletin(
    idEstudiante: string,
    idPeriodo: string,
    nombreEstudiante: string
  ): Promise<void> {
    try {
      const blob = await this.descargarBoletin(idEstudiante, idPeriodo);
      
      // Crear URL temporal del blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento <a> temporal para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = `boletin-${nombreEstudiante.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`;
      
      // Simular click para iniciar descarga
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando y guardando boletín:', error);
      throw error;
    }
  },

  /**
   * Generar boletín para un estudiante
   */
  async generarBoletin(idEstudiante: string, periodo: string): Promise<BoletinDTO> {
    return api.post<BoletinDTO>(
      `/boletines/generar?idEstudiante=${idEstudiante}&periodo=${periodo}`,
      null,
      {
        headers: getAuthHeaders(),
      }
    );
  },
};
