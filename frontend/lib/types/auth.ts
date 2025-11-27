/**
 * Tipos de datos para autenticación y usuarios
 */

export type RolUsuario = 'ADMINISTRADOR' | 'COORDINADOR' | 'DIRECTOR' | 'PROFESOR' | 'ACUDIENTE';

export interface UsuarioDTO {
  idUsuario: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correoElectronico: string;
  fechaNacimiento: string;
  rol: RolUsuario;
}

export interface CredencialesDTO {
  correoElectronico: string;
  contrasena: string;
}

export interface TokenDTO {
  token: string;
  tipo: string;
  expiracion: string;
  usuario: UsuarioDTO;
}

export interface RegistroDTO {
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
}
