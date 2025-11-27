import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const publicPaths = ['/login', '/']

// Rutas protegidas por rol
const roleRoutes = {
  ADMINISTRADOR: '/administrador',
  COORDINADOR: '/coordinador',
  DIRECTOR: '/directivo',
  PROFESOR: '/profesor',
  ACUDIENTE: '/acudiente',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Permitir acceso a rutas públicas y archivos estáticos
  if (
    publicPaths.some(path => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Verificar autenticación
  const token = request.cookies.get('auth_token')?.value
  
  if (!token) {
    // Redirigir a login si no está autenticado
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
