/**
 * Servicio de autenticación
 * Maneja login, logout, y actualización de datos personales
 */

import { api, getAuthHeaders, removeAuthToken, setAuthToken } from '../api';
import type { CredencialesDTO, RegistroDTO, TokenDTO, UsuarioDTO } from '../types/auth';

export class AuthService {
  /**
   * Inicia sesión con credenciales
   */
  static async login(credenciales: CredencialesDTO): Promise<TokenDTO> {
    const response = await api.post<TokenDTO>('/usuarios/login', credenciales);
    
    // Guardar token en localStorage
    setAuthToken(response.token);
    
    // Guardar datos del usuario
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(response.usuario));
    }
    
    return response;
  }

  /**
   * Cierra sesión y limpia datos locales
   */
  static logout(): void {
    removeAuthToken();
    
    // Redirigir al login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Obtiene los datos del usuario actual desde localStorage
   */
  static getCurrentUser(): UsuarioDTO | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as UsuarioDTO;
    } catch {
      return null;
    }
  }

  /**
   * Actualiza los datos personales del usuario
   */
  static async actualizarDatosPersonales(
    idUsuario: string,
    datos: RegistroDTO
  ): Promise<UsuarioDTO> {
    const response = await api.put<UsuarioDTO>(
      `/usuarios/${idUsuario}/datos-iniciales`,
      datos,
      {
        headers: getAuthHeaders(),
      }
    );
    
    // Actualizar datos en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(response));
    }
    
    return response;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user_data');
    
    return !!(token && user);
  }

  /**
   * Verifica el estado de salud del servidor
   */
  static async checkHealth(): Promise<string> {
    return await api.get<string>('/usuarios/health');
  }
}
