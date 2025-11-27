"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, UserPlus, Mail, Shield, Users, Calendar, IdCard, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toast } from "@/components/toast"
import { AdministradorService, Usuario, UsuarioCreacion } from "@/lib/services/administrador.service"
import { ApiException } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

export default function AdministradorPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(false)
  const [cargandoLista, setCargandoLista] = useState(true)
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    correoElectronico: "",
    fechaNacimiento: "",
    rol: ""
  })

  const [contrasenaGenerada, setContrasenaGenerada] = useState("")
  const [copiado, setCopiado] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false)

  // Cargar usuarios al montar el componente
  useEffect(() => {
    // Verificar autenticación
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    // Verificar que sea administrador
    if (!isLoading && isAuthenticated && user?.rol !== 'ADMINISTRADOR') {
      setToast({ message: "No tienes permisos para acceder a esta página", type: "error" })
      setTimeout(() => router.push('/'), 2000)
      return
    }

    if (isAuthenticated) {
      cargarUsuarios()
    }
  }, [isAuthenticated, isLoading, user, router])

  const cargarUsuarios = async () => {
    try {
      setCargandoLista(true)
      const listaUsuarios = await AdministradorService.listarUsuarios()
      setUsuarios(listaUsuarios)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      if (error instanceof ApiException) {
        setToast({ message: error.message, type: "error" })
      } else {
        setToast({ message: "Error al cargar los usuarios", type: "error" })
      }
    } finally {
      setCargandoLista(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validarFormulario = (): boolean => {
    if (!formData.nombre.trim()) {
      setToast({ message: "El nombre es obligatorio", type: "error" })
      return false
    }
    if (!formData.apellido.trim()) {
      setToast({ message: "El apellido es obligatorio", type: "error" })
      return false
    }
    if (!formData.cedula.trim()) {
      setToast({ message: "La cédula es obligatoria", type: "error" })
      return false
    }
    if (!/^\d{6,10}$/.test(formData.cedula)) {
      setToast({ message: "La cédula debe tener entre 6 y 10 dígitos", type: "error" })
      return false
    }
    if (!formData.correoElectronico.trim()) {
      setToast({ message: "El correo electrónico es obligatorio", type: "error" })
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) {
      setToast({ message: "El correo electrónico no es válido", type: "error" })
      return false
    }
    if (!formData.fechaNacimiento) {
      setToast({ message: "La fecha de nacimiento es obligatoria", type: "error" })
      return false
    }
    if (!formData.rol) {
      setToast({ message: "El rol es obligatorio", type: "error" })
      return false
    }
    return true
  }

  const handleCrearUsuario = async () => {
    if (!validarFormulario()) return

    try {
      setCargando(true)
      
      // Generar contraseña temporal
      const contrasena = AdministradorService.generarContrasenaAleatoria()
      setContrasenaGenerada(contrasena)

      const datosCreacion: UsuarioCreacion = {
        ...formData,
        contrasenaGenerada: contrasena
      }

      const nuevoUsuario = await AdministradorService.crearUsuario(datosCreacion)
      
      setToast({ 
        message: `Usuario ${formData.nombre} ${formData.apellido} creado exitosamente`, 
        type: "success" 
      })
      
      // Agregar a la lista local
      setUsuarios(prev => [...prev, nuevoUsuario])
      
      // Limpiar formulario
      setFormData({ 
        nombre: "", 
        apellido: "", 
        cedula: "", 
        correoElectronico: "", 
        fechaNacimiento: "", 
        rol: "" 
      })
      
    } catch (error) {
      console.error('Error al crear usuario:', error)
      if (error instanceof ApiException) {
        setToast({ message: error.message, type: "error" })
      } else {
        setToast({ message: "Error al crear el usuario", type: "error" })
      }
    } finally {
      setCargando(false)
    }
  }

  const copiarContrasena = () => {
    if (contrasenaGenerada) {
      navigator.clipboard.writeText(contrasenaGenerada)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
      setToast({ message: "Contraseña copiada al portapapeles", type: "success" })
    }
  }

  const cerrarFormulario = () => {
    setMostrandoFormulario(false)
    setContrasenaGenerada("")
    setFormData({ 
      nombre: "", 
      apellido: "", 
      cedula: "", 
      correoElectronico: "", 
      fechaNacimiento: "", 
      rol: "" 
    })
  }



  const getRolColor = (rol: string) => {
    const rolUpper = rol?.toUpperCase() || ""
    switch (rolUpper) {
      case "PROFESOR":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "COORDINADOR":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "ACUDIENTE":
        return "bg-green-100 text-green-700 border-green-200"
      case "DIRECTIVO":
      case "DIRECTOR":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "ADMINISTRADOR":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getRolIcon = (rol: string) => {
    return <Shield className="h-4 w-4" />
  }

  const formatearRol = (rol: string) => {
    return rol?.charAt(0) + rol?.slice(1).toLowerCase() || ""
  }

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-navy-700"></div>
          <p className="mt-4 text-xl text-brown-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no renderizar nada (se redirige en useEffect)
  if (!isAuthenticated) {
    return null
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
          <div className="flex items-center gap-4">
            <Button
              onClick={logout}
              variant="outline"
              className="border-2 border-burgundy-700 text-burgundy-700 hover:bg-burgundy-700 hover:text-white px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300"
            >
              Cerrar Sesión
            </Button>
            <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-beige-300/50">
              <Users className="h-8 w-8 text-navy-700" />
              <div>
                <p className="text-sm text-brown-600 font-semibold">Total Usuarios</p>
                <p className="text-3xl font-bold text-navy-800">{usuarios.length}</p>
              </div>
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
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingresa el nombre"
                    className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4 transition-all duration-300"
                    disabled={cargando}
                  />
                </div>

                {/* Campo Apellido */}
                <div className="space-y-2">
                  <Label htmlFor="apellido" className="text-lg font-bold text-navy-700">
                    Apellido
                  </Label>
                  <Input
                    id="apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                    placeholder="Ingresa el apellido"
                    className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4 transition-all duration-300"
                    disabled={cargando}
                  />
                </div>

                {/* Campo Cédula */}
                <div className="space-y-2">
                  <Label htmlFor="cedula" className="text-lg font-bold text-navy-700 flex items-center gap-2">
                    <IdCard className="h-5 w-5 text-coral-500" />
                    Cédula
                  </Label>
                  <Input
                    id="cedula"
                    type="text"
                    value={formData.cedula}
                    onChange={(e) => handleInputChange("cedula", e.target.value)}
                    placeholder="6-10 dígitos"
                    pattern="\d{6,10}"
                    className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4 transition-all duration-300"
                    disabled={cargando}
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
                    value={formData.correoElectronico}
                    onChange={(e) => handleInputChange("correoElectronico", e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4 transition-all duration-300"
                    disabled={cargando}
                  />
                </div>

                {/* Campo Fecha de Nacimiento */}
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento" className="text-lg font-bold text-navy-700 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-coral-500" />
                    Fecha de Nacimiento
                  </Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4 transition-all duration-300"
                    disabled={cargando}
                  />
                </div>

                {/* Campo Rol */}
                <div className="space-y-2">
                  <Label htmlFor="rol" className="text-lg font-bold text-navy-700 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-coral-500" />
                    Rol
                  </Label>
                  <Select value={formData.rol} onValueChange={(value) => handleInputChange("rol", value)} disabled={cargando}>
                    <SelectTrigger className="h-14 text-lg border-2 border-beige-300 focus:border-navy-600 rounded-xl px-4">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROFESOR">Profesor</SelectItem>
                      <SelectItem value="COORDINADOR">Coordinador</SelectItem>
                      <SelectItem value="ACUDIENTE">Acudiente</SelectItem>
                      <SelectItem value="DIRECTOR">Directivo</SelectItem>
                      <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mostrar contraseña generada */}
              {contrasenaGenerada && (
                <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-bold text-yellow-900 mb-2 block">
                        Contraseña Temporal Generada
                      </Label>
                      <div className="flex items-center gap-4">
                        <code className="text-xl font-mono font-bold text-yellow-900 bg-white px-4 py-2 rounded-lg border-2 border-yellow-400">
                          {contrasenaGenerada}
                        </code>
                        <Button
                          onClick={copiarContrasena}
                          variant="outline"
                          size="sm"
                          className="border-yellow-400 hover:bg-yellow-100"
                        >
                          {copiado ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-yellow-800 mt-3">
                    ⚠️ <strong>Importante:</strong> Guarda esta contraseña. El usuario deberá usarla en su primer inicio de sesión.
                  </p>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleCrearUsuario}
                  disabled={cargando || !!contrasenaGenerada}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-lg font-bold text-white hover:from-green-700 hover:to-green-800 rounded-2xl shadow-[0_8px_30px_-4px_rgba(22,163,74,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(22,163,74,0.5)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {cargando ? "Creando..." : "Crear Usuario"}
                </Button>
                <Button
                  onClick={cerrarFormulario}
                  disabled={cargando}
                  className="border-2 border-gray-400 bg-white px-8 py-6 text-lg font-bold text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contrasenaGenerada ? "Cerrar" : "Cancelar"}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Listado de Usuarios */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] p-12 border border-beige-300/50">
          <h2 className="mb-10 font-serif text-3xl font-bold text-navy-800">LISTADO DE USUARIOS</h2>

          {cargandoLista ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
              <p className="mt-4 text-brown-600">Cargando usuarios...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.idUsuario}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-beige-50 to-beige-100/50 border-2 border-beige-300 rounded-2xl hover:shadow-lg hover:shadow-beige-300/50 hover:border-brown-400 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-2xl font-bold text-navy-800">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      <span className={`px-4 py-1 rounded-lg text-sm font-bold border flex items-center gap-2 ${getRolColor(usuario.rol)}`}>
                        {getRolIcon(usuario.rol)}
                        {formatearRol(usuario.rol)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-brown-700">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <p className="text-base">{usuario.correoElectronico}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <IdCard className="h-4 w-4" />
                        <p className="text-base">Cédula: {usuario.cedula}</p>
                      </div>
                      {usuario.fechaNacimiento && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <p className="text-base">
                            {new Date(usuario.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-CO', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
