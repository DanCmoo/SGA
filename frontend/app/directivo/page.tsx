"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Users, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { DirectivoService, type GradoDTO, type GrupoDTO } from "@/lib/services/directivo.service"
import { Toast } from "@/components/toast"

interface GradeWithGroups {
  grado: GradoDTO
  grupos: GrupoDTO[]
}

export default function DirectivoPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [expandedGrades, setExpandedGrades] = useState<string[]>([])
  const [gradesWithGroups, setGradesWithGroups] = useState<GradeWithGroups[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const grados = await DirectivoService.obtenerGrados()
      
      // Cargar grupos para cada grado
      const gradesData = await Promise.all(
        grados.map(async (grado) => {
          const grupos = await DirectivoService.obtenerGruposPorGrado(grado.idGrado)
          return { grado, grupos }
        })
      )
      
      setGradesWithGroups(gradesData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setToast({ message: "Error al cargar los grados y grupos", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const toggleGrade = (gradeId: string) => {
    setExpandedGrades((prev) => (prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [...prev, gradeId]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
      <div className="mx-auto max-w-5xl p-10">
        {/* Header con logout */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-navy-700 hover:bg-navy-100/50 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-2 border-burgundy-700 text-burgundy-700 hover:bg-burgundy-700 hover:text-white px-8 py-3 font-bold rounded-xl transition-all duration-300"
          >
            Cerrar Sesión
          </Button>
        </div>

        <div className="rounded-3xl bg-white/95 backdrop-blur-sm p-12 shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] border border-beige-300/50">
          <h1 className="mb-12 text-center text-4xl font-bold text-navy-800 tracking-tight">GRADOS Y GRUPOS</h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-navy-600" />
            </div>
          ) : gradesWithGroups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No hay grados disponibles</p>
            </div>
          ) : (
            <div className="space-y-6">
              {gradesWithGroups.map(({ grado, grupos }) => {
                const isExpanded = expandedGrades.includes(grado.idGrado)

                return (
                  <div
                    key={grado.idGrado}
                    className="rounded-2xl border-2 border-brown-600 bg-gradient-to-r from-beige-200/40 to-beige-100/30 shadow-[0_4px_20px_-4px_rgba(111,77,56,0.2)] hover:shadow-[0_8px_30px_-4px_rgba(111,77,56,0.3)] transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleGrade(grado.idGrado)}
                      className="flex w-full items-center justify-between p-6 text-left transition-all duration-300 hover:bg-beige-200/50 rounded-2xl"
                    >
                      <span className="text-2xl font-bold text-navy-800">{grado.nombreGrado}</span>
                      <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm transition-transform duration-300 shadow-sm">
                        {isExpanded ? (
                          <ChevronDown className="h-7 w-7 text-navy-700" />
                        ) : (
                          <ChevronRight className="h-7 w-7 text-navy-700" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t-2 border-brown-600 bg-white/60 backdrop-blur-sm p-6 rounded-b-2xl">
                        {grupos.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">No hay grupos en este grado</p>
                        ) : (
                          <div className="space-y-4">
                            {grupos.map((grupo) => (
                              <Link
                                key={grupo.idGrupo}
                                href={`/directivo/grupo/${grupo.idGrupo}`}
                                className="flex items-center justify-between rounded-xl border-2 border-navy-700 bg-white p-5 transition-all duration-300 hover:border-coral-500 hover:bg-coral-50/50 hover:shadow-[0_4px_20px_-4px_rgba(246,120,145,0.3)] transform hover:scale-[1.02]"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 bg-beige-200/50 rounded-lg shadow-sm">
                                    <Users className="h-6 w-6 text-brown-700" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-navy-800 text-lg block">{grupo.nombre}</span>
                                    <span className="text-sm text-gray-600">
                                      {grupo.cantidadEstudiantes} estudiante{grupo.cantidadEstudiantes !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-base text-brown-700 font-medium">Ver estudiantes →</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
