"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import type { CredencialesDTO, RegistroDTO, TokenDTO, UsuarioDTO } from '@/lib/types/auth';
import { ApiException } from '@/lib/api';

interface AuthContextType {
  user: UsuarioDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credenciales: CredencialesDTO) => Promise<TokenDTO>;
  logout: () => void;
  actualizarDatos: (datos: RegistroDTO) => Promise<UsuarioDTO>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Cargar usuario y token al montar el componente
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    setUser(currentUser);
    setToken(currentToken);
    setIsLoading(false);
  }, []);

  const login = async (credenciales: CredencialesDTO): Promise<TokenDTO> => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await AuthService.login(credenciales);
      setUser(response.usuario);
      setToken(response.token);
      return response;
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error de conexión con el servidor');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    AuthService.logout();
  };

  const actualizarDatos = async (datos: RegistroDTO): Promise<UsuarioDTO> => {
    setError(null);
    setIsLoading(true);
    
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    
    try {
      const updatedUser = await AuthService.actualizarDatosPersonales(
        user.idUsuario,
        datos
      );
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Error al actualizar datos personales');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        actualizarDatos,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
