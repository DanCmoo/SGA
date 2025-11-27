/**
 * Cliente HTTP para comunicación con el backend
 * Configuración base para todas las peticiones API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  mensaje: string;
  path: string;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public error: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

/**
 * Realiza una petición HTTP al backend
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Si la respuesta no es exitosa, lanzar error con el cuerpo de la respuesta
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        timestamp: new Date().toISOString(),
        status: response.status,
        error: response.statusText,
        mensaje: 'Error de comunicación con el servidor',
        path: endpoint,
      }));
      
      throw new ApiException(
        errorData.status,
        errorData.error,
        errorData.mensaje
      );
    }
    
    // Respuestas vacías (204 No Content o sin contenido)
    if (response.status === 204) {
      return null as T;
    }
    
    // Verificar si hay contenido antes de parsear JSON
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Si no hay content-type o content-length es 0, retornar null
    if (!contentType || contentLength === '0') {
      return null as T;
    }
    
    // Si hay contenido, parsearlo como JSON
    if (contentType.includes('application/json')) {
      const text = await response.text();
      return (text ? JSON.parse(text) : null) as T;
    }
    
    return null as T;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    
    // Errores de red u otros
    throw new ApiException(
      0,
      'Network Error',
      error instanceof Error ? error.message : 'Error de conexión con el servidor'
    );
  }
}

/**
 * Cliente API con métodos HTTP
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
  
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
};

/**
 * Obtiene el token de autenticación almacenado
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Guarda el token de autenticación
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Elimina el token de autenticación
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
}

/**
 * Crea headers de autenticación con el token Bearer
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`,
  };
}
