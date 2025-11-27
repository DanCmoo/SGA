"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Lock, Mail, AlertCircle } from "lucide-react"
import { FirstTimeModal } from "./first-time-modal"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const router = useRouter()
  const { login, error, clearError } = useAuth()
  
  const [correoElectronico, setCorreoElectronico] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [usuarioId, setUsuarioId] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setIsLoading(true)

    try {
      const response = await login({
        correoElectronico,
        contrasena,
      })

      // Verificar si es primera vez (datos personales incompletos)
      const usuario = response.usuario
      const esPrimeraVez = !usuario.nombre || !usuario.cedula || !usuario.fechaNacimiento

      if (esPrimeraVez) {
        setUsuarioId(usuario.idUsuario)
        setShowFirstTimeModal(true)
      } else {
        // Redirigir según el rol
        redirectByRole(usuario.rol)
      }
    } catch (err) {
      // El error ya está manejado en el contexto
      console.error('Error de autenticación:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const redirectByRole = (rol: string) => {
    const routes: Record<string, string> = {
      ADMINISTRADOR: '/administrador',
      COORDINADOR: '/coordinador',
      DIRECTOR: '/directivo',
      PROFESOR: '/profesor',
      ACUDIENTE: '/acudiente',
    }

    const route = routes[rol] || '/'
    router.push(route)
  }

  return (
    <>
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-navy-500/20 overflow-hidden border border-beige-200/50">
          <div className="bg-gradient-to-br from-navy-600 via-navy-700 to-brown-600 p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-beige-400 to-coral-500 rounded-2xl mb-6 shadow-xl shadow-coral-500/30 transform hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-navy-800" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Sistema Escolar</h1>
            <p className="text-beige-200 text-base font-medium">Gestión Académica</p>
          </div>
          <div className="p-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-navy-700 mb-3">Bienvenido</h2>
              <p className="text-brown-600 text-base">Ingresa tus credenciales para continuar</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="correoElectronico" className="text-sm font-semibold text-navy-700">
                  Correo Electrónico
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-500 transition-colors group-focus-within:text-navy-600" />
                  <Input
                    id="correoElectronico"
                    type="email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                    className="pl-12 h-14 border-2 border-beige-300 rounded-xl focus-visible:border-navy-500 focus-visible:ring-4 focus-visible:ring-navy-500/10 transition-all duration-300 bg-white hover:border-brown-400 shadow-sm shadow-beige-200/50"
                    placeholder="ejemplo@fis.edu.co"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="contrasena" className="text-sm font-semibold text-navy-700">
                  Contraseña
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-500 transition-colors group-focus-within:text-navy-600" />
                  <Input
                    id="contrasena"
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="pl-12 h-14 border-2 border-beige-300 rounded-xl focus-visible:border-navy-500 focus-visible:ring-4 focus-visible:ring-navy-500/10 transition-all duration-300 bg-white hover:border-brown-400 shadow-sm shadow-beige-200/50"
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-coral-500 to-burgundy-600 hover:from-burgundy-600 hover:to-coral-500 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <FirstTimeModal 
        isOpen={showFirstTimeModal} 
        onClose={() => setShowFirstTimeModal(false)}
        usuarioId={usuarioId}
        onSuccess={redirectByRole}
      />
    </>
  )
}
