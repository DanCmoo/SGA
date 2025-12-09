"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock } from "lucide-react"

interface CambioContrasenaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
  isPrimerLogin?: boolean
}

export function CambioContrasenaModal({ isOpen, onClose, onSuccess, userId, isPrimerLogin = false }: CambioContrasenaModalProps) {
  const [contrasenaActual, setContrasenaActual] = useState("")
  const [contrasenaNueva, setContrasenaNueva] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState("")
  const [mostrarActual, setMostrarActual] = useState(false)
  const [mostrarNueva, setMostrarNueva] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validaciones
    if (contrasenaNueva.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (contrasenaNueva !== confirmarContrasena) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!isPrimerLogin && !contrasenaActual) {
      setError("Debes ingresar tu contraseña actual")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")

      const response = await fetch(`http://localhost:8080/api/usuarios/${userId}/cambiar-contrasena`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contrasenaActual: isPrimerLogin ? null : contrasenaActual,
          contrasenaNueva,
          confirmarContrasena,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Error al cambiar la contraseña")
      }

      // Limpiar formulario
      setContrasenaActual("")
      setContrasenaNueva("")
      setConfirmarContrasena("")
      
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={isPrimerLogin ? undefined : onClose}>
      <DialogContent className="sm:max-w-md" onInteractOutside={isPrimerLogin ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-navy-700" />
            {isPrimerLogin ? "Cambio de Contraseña Obligatorio" : "Cambiar Contraseña"}
          </DialogTitle>
          <DialogDescription>
            {isPrimerLogin
              ? "Por seguridad, debes cambiar tu contraseña temporal en este primer inicio de sesión."
              : "Ingresa tu contraseña actual y la nueva contraseña."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isPrimerLogin && (
            <div className="space-y-2">
              <Label htmlFor="contrasenaActual">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  id="contrasenaActual"
                  type={mostrarActual ? "text" : "password"}
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarActual(!mostrarActual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {mostrarActual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="contrasenaNueva">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="contrasenaNueva"
                type={mostrarNueva ? "text" : "password"}
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarNueva(!mostrarNueva)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarNueva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">Mínimo 8 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmarContrasena"
                type={mostrarConfirmar ? "text" : "password"}
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarConfirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4">
            {!isPrimerLogin && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
