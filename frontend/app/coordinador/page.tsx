"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Toast } from "@/components/toast"
import { EmptyState } from "@/components/empty-state"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface PreregisteredStudent {
  idHojaDeVida: string
  nombre1Estudiante: string
  nombre2Estudiante: string
  apellido1Estudiante: string
  apellido2Estudiante: string
  gradoSolicitado: string
  nombre1Acudiente: string
  nombre2Acudiente: string
  apellido1Acudiente: string
  apellido2Acudiente: string
  correoAcudiente: string
  documentoIdentidad: string
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO"
}

export default function CoordinadorPage() {
  const router = useRouter()
  const { token, logout } = useAuth()
  const [students, setStudents] = useState<PreregisteredStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const buildFullName = (nombre1: string, nombre2?: string, apellido1?: string, apellido2?: string) => {
    const parts = [nombre1, nombre2, apellido1, apellido2].filter(Boolean)
    return parts.join(" ")
  }

  useEffect(() => {
    console.log("useEffect ejecutado, token:", token ? "existe" : "no existe")
    if (token) {
      cargarPreinscritos()
    } else {
      setLoading(false)
    }
  }, [token])

  const cargarPreinscritos = async () => {
    console.log("Intentando cargar preinscritos...")
    try {
      const response = await api.get<PreregisteredStudent[]>("/admisiones/preinscritos", {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("Respuesta recibida:", response)
      setStudents(response)
    } catch (error: any) {
      console.error("Error al cargar preinscritos:", error)
      console.error("Error response:", error.response)
      setToast({ message: `Error al cargar los preinscritos: ${error.message}`, type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (idHojaDeVida: string, fullName: string) => {
    try {
      await api.post(`/admisiones/aprobar/${idHojaDeVida}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setStudents(students.map((student) => 
        student.idHojaDeVida === idHojaDeVida 
          ? { ...student, estado: "APROBADO" as const } 
          : student
      ))
      setToast({ message: `${fullName} ha sido aceptado exitosamente`, type: "success" })
    } catch (error) {
      console.error("Error al aprobar aspirante:", error)
      setToast({ message: "Error al aprobar el aspirante", type: "error" })
    }
  }

  const handleReject = async (idHojaDeVida: string, fullName: string) => {
    try {
      await api.post(`/admisiones/rechazar/${idHojaDeVida}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setStudents(students.map((student) => 
        student.idHojaDeVida === idHojaDeVida 
          ? { ...student, estado: "RECHAZADO" as const } 
          : student
      ))
      setToast({ message: `${fullName} ha sido rechazado`, type: "error" })
    } catch (error) {
      console.error("Error al rechazar aspirante:", error)
      setToast({ message: "Error al rechazar el aspirante", type: "error" })
    }
  }

  const pendingStudents = students?.filter((s) => s.estado === "PENDIENTE") || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200 p-10">
      <div className="mx-auto max-w-6xl">
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
              <h1 className="font-serif text-5xl font-bold text-navy-800 tracking-tight">Panel de Coordinador</h1>
              <div className="h-1 w-48 bg-gradient-to-r from-coral-500 to-transparent rounded-full mt-2"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={logout}
              variant="outline"
              className="border-2 border-burgundy-700 text-burgundy-700 hover:bg-burgundy-700 hover:text-white px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300"
            >
              Cerrar Sesión
            </Button>
            <Button
              onClick={() => router.push("/coordinador/crear-grupos")}
              className="bg-gradient-to-r from-navy-700 to-brown-700 px-10 py-7 text-lg font-bold text-white hover:from-brown-700 hover:to-navy-700 rounded-2xl shadow-[0_8px_30px_-4px_rgba(37,52,64,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(37,52,64,0.5)] transition-all duration-300 transform hover:scale-105"
            >
              Creación Grupos
            </Button>
          </div>
        </div>
        {/* </CHANGE> */}

        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] p-12 border border-beige-300/50">
          <h2 className="mb-10 font-serif text-3xl font-bold text-navy-800">LISTADO DE ESTUDIANTES PREINSCRITOS</h2>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-xl text-navy-700">Cargando preinscritos...</p>
            </div>
          ) : pendingStudents.length === 0 ? (
            <EmptyState
              title="No hay estudiantes pendientes"
              description="Todos los estudiantes preinscritos han sido procesados"
            />
          ) : (
            <div className="space-y-6">
              {students.map((student) => {
                const nombreEstudiante = buildFullName(
                  student.nombre1Estudiante,
                  student.nombre2Estudiante,
                  student.apellido1Estudiante,
                  student.apellido2Estudiante
                )
                const nombreAcudiente = buildFullName(
                  student.nombre1Acudiente,
                  student.nombre2Acudiente,
                  student.apellido1Acudiente,
                  student.apellido2Acudiente
                )

                return (
                  <div
                    key={student.idHojaDeVida}
                    className="flex items-center justify-between border-b-2 border-beige-300 pb-6 last:border-b-0 hover:bg-beige-50/50 p-4 rounded-xl transition-all duration-300"
                  >
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-navy-800">
                        {nombreEstudiante}
                      </p>
                      <p className="text-base text-brown-700 mt-1">Grado: {student.gradoSolicitado}</p>
                      <p className="text-sm text-brown-600 mt-1">Acudiente: {nombreAcudiente}</p>
                    </div>

                    <div className="flex gap-5">
                      {student.estado === "PENDIENTE" && (
                        <>
                          <Button
                            onClick={() => handleAccept(student.idHojaDeVida, nombreEstudiante)}
                            className="border-2 border-navy-700 bg-white px-10 py-3 text-navy-700 hover:bg-navy-700 hover:text-white rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_-4px_rgba(37,52,64,0.3)] transform hover:scale-105"
                          >
                            Aceptar
                          </Button>
                          <Button
                            onClick={() => handleReject(student.idHojaDeVida, nombreEstudiante)}
                            className="border-2 border-burgundy-700 bg-white px-10 py-3 text-burgundy-700 hover:bg-burgundy-700 hover:text-white rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_-4px_rgba(99,32,36,0.3)] transform hover:scale-105"
                          >
                            Rechazar
                          </Button>
                        </>
                      )}
                      {student.estado === "APROBADO" && (
                        <span className="rounded-xl bg-green-100 px-8 py-3 font-bold text-green-700 shadow-md border border-green-200 animate-in fade-in zoom-in-95 duration-300">
                          ✓ Aceptado
                        </span>
                      )}
                      {student.estado === "RECHAZADO" && (
                        <span className="rounded-xl bg-red-100 px-8 py-3 font-bold text-red-700 shadow-md border border-red-200 animate-in fade-in zoom-in-95 duration-300">
                          ✗ Rechazado
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {/* </CHANGE> */}
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* </CHANGE> */}
    </div>
  )
}
