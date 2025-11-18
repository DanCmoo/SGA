"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, User, Mail, Calendar, CreditCard, Phone, MapPin, Shield } from "lucide-react"

interface FirstTimeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FirstTimeModal({ isOpen, onClose }: FirstTimeModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    direccion: "",
    rol: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos personales:", formData)
    
    // Redirigir según el rol seleccionado
    switch (formData.rol) {
      case "profesor":
        router.push("/profesor")
        break
      case "coordinador":
        router.push("/coordinador")
        break
      case "acudiente":
        router.push("/acudiente")
        break
      case "directivo":
        router.push("/directivo")
        break
      case "administrador":
        router.push("/administrador")
        break
      default:
        router.push("/")
    }
    
    onClose()
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
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white text-center">INGRESAR DATOS PERSONALES</h2>
            <p className="text-beige-200 text-center text-sm mt-2">Por favor completa tu información para continuar</p>
            <div className="h-1 w-32 bg-gradient-to-r from-coral-400 to-transparent rounded-full mt-3 mx-auto"></div>
          </div>
        </div>
        {/* </CHANGE> */}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <User className="w-4 h-4 text-brown-600" />
                Nombre
              </Label>
              <Input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <User className="w-4 h-4 text-brown-600" />
                Apellido
              </Label>
              <Input
                id="apellido"
                type="text"
                value={formData.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="Ingresa tu apellido"
                required
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
                placeholder="Número de cédula"
                required
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
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brown-600" />
                Correo
              </Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-brown-600" />
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                placeholder="Número de teléfono"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brown-600" />
              Dirección
            </Label>
            <Input
              id="direccion"
              type="text"
              value={formData.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              className="h-11 border-2 border-beige-300 rounded-xl focus-visible:border-navy-600 focus-visible:ring-2 focus-visible:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
              placeholder="Dirección completa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol" className="text-sm font-semibold text-navy-700 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brown-600" />
              Rol
            </Label>
            <Select value={formData.rol} onValueChange={(value) => handleChange("rol", value)}>
              <SelectTrigger className="h-11 border-2 border-beige-300 rounded-xl focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500">
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profesor">Profesor</SelectItem>
                <SelectItem value="coordinador">Coordinador</SelectItem>
                <SelectItem value="acudiente">Acudiente</SelectItem>
                <SelectItem value="directivo">Directivo</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-coral-500 to-burgundy-600 hover:from-burgundy-600 hover:to-coral-500 text-white font-semibold text-base h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
              Ingresar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
