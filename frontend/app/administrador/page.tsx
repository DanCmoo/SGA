"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, UserPlus, Mail, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toast } from "@/components/toast"

interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: string
}

export default function AdministradorPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: "María González", correo: "maria@colegio.com", rol: "profesor" },
    { id: 2, nombre: "Carlos Pérez", correo: "carlos@colegio.com", rol: "coordinador" },
    { id: 3, nombre: "Ana López", correo: "ana@colegio.com", rol: "acudiente" },
  ])
  
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    rol: ""
  })

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCrearUsuario = () => {
    if (!formData.nombre || !formData.correo || !formData.rol) {
      setToast({ message: "Por favor completa todos los campos", type: "error" })
      return
    }

    const nuevoUsuario: Usuario = {
      id: usuarios.length + 1,
      nombre: formData.nombre,
      correo: formData.correo,
      rol: formData.rol
    }

    setUsuarios([...usuarios, nuevoUsuario])
    setToast({ message: `Usuario ${formData.nombre} creado exitosamente`, type: "success" })
    setFormData({ nombre: "", correo: "", rol: "" })
    setMostrandoFormulario(false)
  }



  const getRolColor = (rol: string) => {
    switch (rol) {
      case "profesor":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "coordinador":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "acudiente":
        return "bg-green-100 text-green-700 border-green-200"
      case "directivo":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "administrador":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getRolIcon = (rol: string) => {
    return <Shield className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200 p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-navy-700 hover:bg-navy-100/50 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-5xl font-bold text-navy-800 tracking-tight">
                Panel de Administrador
              </h1>
              <div className="h-1 w-48 bg-gradient-to-r from-coral-500 to-transparent rounded-full mt-2"></div>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-beige-300/50">
            <Users className="h-8 w-8 text-navy-700" />
            <div>
              <p className="text-sm text-brown-600 font-semibold">Total Usuarios</p>
              <p className="text-3xl font-bold text-navy-800">{usuarios.length}</p>
            </div>
          </div>
        </div>

        {/* Formulario de Creación */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] p-12 border border-beige-300/50 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-navy-800 flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-coral-500" />
              Creación de Usuario
            </h2>
            {!mostrandoFormulario && (
              <Button
                onClick={() => setMostrandoFormulario(true)}
                className="bg-gradient-to-r from-navy-700 to-brown-700 px-8 py-6 text-lg font-bold text-white hover:from-brown-700 hover:to-navy-700 rounded-2xl shadow-[0_8px_30px_-4px_rgba(37,52,64,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(37,52,64,0.5)] transition-all duration-300 transform hover:scale-105"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Nuevo Usuario
              </Button>
            )}
          </div>

          {mostrandoFormulario && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-lg font-bold text-navy-700">
                    Nombre Completo
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingresa el nombre completo"
                    className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4 transition-all duration-300"
                  />
                </div>

                {/* Campo Correo */}
                <div className="space-y-2">
                  <Label htmlFor="correo" className="text-lg font-bold text-navy-700 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-coral-500" />
                    Correo Electrónico
                  </Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleInputChange("correo", e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Campo Rol */}
              <div className="space-y-2">
                <Label htmlFor="rol" className="text-lg font-bold text-navy-700 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-coral-500" />
                  Rol
                </Label>
                <Select value={formData.rol} onValueChange={(value) => handleInputChange("rol", value)}>
                  <SelectTrigger className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4">
                    <SelectValue placeholder="Selecciona un rol" />
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

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleCrearUsuario}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-lg font-bold text-white hover:from-green-700 hover:to-green-800 rounded-2xl shadow-[0_8px_30px_-4px_rgba(22,163,74,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(22,163,74,0.5)] transition-all duration-300 transform hover:scale-105"
                >
                  Crear Usuario
                </Button>
                <Button
                  onClick={() => {
                    setMostrandoFormulario(false)
                    setFormData({ nombre: "", correo: "", rol: "" })
                  }}
                  className="border-2 border-gray-400 bg-white px-8 py-6 text-lg font-bold text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Listado de Usuarios */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] p-12 border border-beige-300/50">
          <h2 className="mb-10 font-serif text-3xl font-bold text-navy-800">LISTADO DE USUARIOS</h2>

          <div className="space-y-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="flex items-center justify-between p-6 bg-gradient-to-r from-beige-50 to-beige-100/50 border-2 border-beige-300 rounded-2xl hover:shadow-lg hover:shadow-beige-300/50 hover:border-brown-400 transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-2xl font-bold text-navy-800">{usuario.nombre}</p>
                    <span className={`px-4 py-1 rounded-lg text-sm font-bold border flex items-center gap-2 ${getRolColor(usuario.rol)}`}>
                      {getRolIcon(usuario.rol)}
                      {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-brown-700">
                    <Mail className="h-4 w-4" />
                    <p className="text-base">{usuario.correo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
