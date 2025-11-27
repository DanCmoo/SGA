/**
 * Hook personalizado para redirección basada en roles
 */

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useEffect } from 'react'
import type { RolUsuario } from '@/lib/types/auth'

export function useRoleRedirect() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const redirectByRole = (rol: RolUsuario) => {
    const routes: Record<RolUsuario, string> = {
      ADMINISTRADOR: '/administrador',
      COORDINADOR: '/coordinador',
      DIRECTOR: '/directivo',
      PROFESOR: '/profesor',
      ACUDIENTE: '/acudiente',
    }

    const route = routes[rol]
    if (route) {
      router.push(route)
    }
  }

  return { redirectByRole }
}

/**
 * Hook para proteger rutas que requieren autenticación
 */
export function useRequireAuth() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}

/**
 * Hook para proteger rutas por rol específico
 */
export function useRequireRole(allowedRoles: RolUsuario[]) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user && !allowedRoles.includes(user.rol)) {
        // Redirigir a su dashboard correspondiente
        const routes: Record<RolUsuario, string> = {
          ADMINISTRADOR: '/administrador',
          COORDINADOR: '/coordinador',
          DIRECTOR: '/directivo',
          PROFESOR: '/profesor',
          ACUDIENTE: '/acudiente',
        }
        router.push(routes[user.rol])
      }
    }
  }, [user, isAuthenticated, isLoading, router, allowedRoles])

  return { user, isAuthenticated, isLoading }
}
