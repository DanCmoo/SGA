/**
 * Servicio para gestión de usuarios por parte del administrador
 */

import { api, getAuthHeaders } from '../api';

export interface UsuarioCreacion {
  nombre: string;
  apellido: string;
  cedula: string;
  correoElectronico: string;
  fechaNacimiento: string;
  rol: string;
  contrasenaGenerada: string;
}

export interface Usuario {
  idUsuario: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correoElectronico: string;
  fechaNacimiento: string;
  rol: string;
}

/**
 * Servicio de administrador
 */
export const AdministradorService = {
  /**
   * Crear un nuevo usuario en el sistema
   */
  async crearUsuario(datos: UsuarioCreacion): Promise<Usuario> {
    return api.post<Usuario>('/admin/usuarios', datos, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Listar todos los usuarios del sistema
   */
  async listarUsuarios(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/admin/usuarios', {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Consultar un usuario específico por ID
   */
  async consultarUsuario(id: string): Promise<Usuario> {
    return api.get<Usuario>(`/admin/usuarios/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Genera una contraseña temporal aleatoria
   */
  generarContrasenaAleatoria(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let contrasena = '';
    for (let i = 0; i < 12; i++) {
      contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return contrasena;
  },
};
