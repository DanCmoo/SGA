"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, User, Calendar, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FirstTimeModalProps {
  isOpen: boolean
  onClose: () => void
  usuarioId: string
  onSuccess: (rol: string) => void
}

export function FirstTimeModal({ isOpen, onClose, usuarioId, onSuccess }: FirstTimeModalProps) {
  const { actualizarDatos, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: "",
    nombre2: "",
    apellido: "",
    apellido2: "",
    cedula: "",
    fechaNacimiento: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await actualizarDatos(formData)
      setSuccess(true)
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        onClose()
        if (user?.rol) {
          onSuccess(user.rol)
        }
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar datos personales')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-navy-600 via-navy-700 to-brown-600 p-6 relative rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-coral-400 transition-all duration-200 hover:scale-110 hover:rotate-90 z-10"
            aria-label="Cerrar"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white text-center">INGRESAR DATOS PERSONALES</h2>
            <p className="text-beige-200 text-center text-sm mt-2">Por favor completa tu información para continuar</p>
            <div className="h-1 w-32 bg-gradient-to-r from-coral-400 to-transparent rounded-full mt-3 mx-auto"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Datos actualizados correctamente. Redirigiendo...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <User className="w-4 h-4 text-brown-600" />
                Primer Nombre
              </Label>
              <Input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="Ingresa tu primer nombre"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre2" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <User className="w-4 h-4 text-brown-600" />
                Segundo Nombre
              </Label>
              <Input
                id="nombre2"
                type="text"
                value={formData.nombre2}
                onChange={(e) => handleChange("nombre2", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="Segundo nombre (opcional)"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <User className="w-4 h-4 text-brown-600" />
                Primer Apellido
              </Label>
              <Input
                id="apellido"
                type="text"
                value={formData.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="Ingresa tu primer apellido"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido2" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <User className="w-4 h-4 text-brown-600" />
                Segundo Apellido
              </Label>
              <Input
                id="apellido2"
                type="text"
                value={formData.apellido2}
                onChange={(e) => handleChange("apellido2", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="Segundo apellido (opcional)"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brown-600" />
                Cédula
              </Label>
              <Input
                id="cedula"
                type="text"
                value={formData.cedula}
                onChange={(e) => handleChange("cedula", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="6-10 dígitos numéricos"
                pattern="\d{6,10}"
                title="La cédula debe contener entre 6 y 10 dígitos"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brown-600" />
                Fecha Nacimiento
              </Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-gradient-to-r from-coral-500 to-burgundy-600 hover:from-burgundy-600 hover:to-coral-500 text-white font-semibold text-base h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : success ? 'Datos guardados' : 'Guardar y Continuar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
