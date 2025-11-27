/**
 * Utilidades de validación para formularios
 */

export const validaciones = {
  /**
   * Valida formato de correo electrónico
   */
  correoElectronico: (correo: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(correo)
  },

  /**
   * Valida formato de cédula (6-10 dígitos numéricos)
   */
  cedula: (cedula: string): boolean => {
    const regex = /^\d{6,10}$/
    return regex.test(cedula)
  },

  /**
   * Valida que la fecha no sea futura
   */
  fechaNoFutura: (fecha: string): boolean => {
    const fechaIngresada = new Date(fecha)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    return fechaIngresada <= hoy
  },

  /**
   * Valida edad mínima
   */
  edadMinima: (fechaNacimiento: string, edadMinima: number): boolean => {
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    const edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mesActual = hoy.getMonth()
    const mesNacimiento = nacimiento.getMonth()
    
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
      return edad - 1 >= edadMinima
    }
    
    return edad >= edadMinima
  },

  /**
   * Valida contraseña (mínimo 8 caracteres)
   */
  contrasena: (contrasena: string): boolean => {
    return contrasena.length >= 8
  },

  /**
   * Valida nombre/apellido (solo letras y espacios)
   */
  nombre: (nombre: string): boolean => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    return regex.test(nombre) && nombre.trim().length > 0
  },

  /**
   * Valida teléfono (7-10 dígitos)
   */
  telefono: (telefono: string): boolean => {
    const regex = /^\d{7,10}$/
    return regex.test(telefono)
  },
}

/**
 * Mensajes de error de validación
 */
export const mensajesError = {
  correoElectronico: 'Ingresa un correo electrónico válido',
  cedula: 'La cédula debe contener entre 6 y 10 dígitos',
  fechaNoFutura: 'La fecha no puede ser futura',
  edadMinima: (edad: number) => `Debes tener al menos ${edad} años`,
  contrasena: 'La contraseña debe tener al menos 8 caracteres',
  nombre: 'Ingresa un nombre válido (solo letras)',
  telefono: 'El teléfono debe tener entre 7 y 10 dígitos',
  requerido: 'Este campo es obligatorio',
}

/**
 * Formatea fecha de YYYY-MM-DD a DD/MM/YYYY
 */
export function formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

/**
 * Formatea fecha de DD/MM/YYYY a YYYY-MM-DD
 */
export function formatearFechaISO(fecha: string): string {
  const [day, month, year] = fecha.split('/')
  return `${year}-${month}-${day}`
}

/**
 * Capitaliza primera letra de cada palabra
 */
export function capitalize(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ')
}
