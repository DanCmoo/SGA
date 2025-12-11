"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Users, ArrowLeft, Loader2, BarChart3, TrendingUp, UserCheck, GraduationCap } from "lucide-react"
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

interface Estadisticas {
  totalEstudiantes: number
  totalGrupos: number
  totalGrados: number
  promedioEstudiantesPorGrupo: number
  gruposSinProfesor: number
}

export default function DirectivoPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [expandedGrades, setExpandedGrades] = useState<string[]>([])
  const [gradesWithGroups, setGradesWithGroups] = useState<GradeWithGroups[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalEstudiantes: 0,
    totalGrupos: 0,
    totalGrados: 0,
    promedioEstudiantesPorGrupo: 0,
    gruposSinProfesor: 0
  })
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
      
      // Calcular estadísticas
      const totalGrupos = gradesData.reduce((acc, { grupos }) => acc + grupos.length, 0)
      const totalEstudiantes = gradesData.reduce((acc, { grupos }) => 
        acc + grupos.reduce((sum, grupo) => sum + grupo.cantidadEstudiantes, 0), 0
      )
      const gruposSinProfesor = gradesData.reduce((acc, { grupos }) => 
        acc + grupos.filter(g => !g.idProfesor).length, 0
      )
      
      setEstadisticas({
        totalEstudiantes,
        totalGrupos,
        totalGrados: grados.length,
        promedioEstudiantesPorGrupo: totalGrupos > 0 ? Math.round(totalEstudiantes / totalGrupos) : 0,
        gruposSinProfesor
      })
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
          <h1 className="mb-8 text-center text-4xl font-bold text-navy-800 tracking-tight">Panel de Gestión Académica</h1>
          
          {/* Dashboard de Estadísticas */}
          {!loading && (
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Estudiantes */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <TrendingUp className="h-6 w-6 text-white/60" />
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Total Estudiantes</h3>
                <p className="text-4xl font-bold text-white">{estadisticas.totalEstudiantes}</p>
              </div>

              {/* Total Grupos */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <UserCheck className="h-8 w-8 text-white" />
                  </div>
                  <BarChart3 className="h-6 w-6 text-white/60" />
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Grupos Activos</h3>
                <p className="text-4xl font-bold text-white">{estadisticas.totalGrupos}</p>
              </div>

              {/* Promedio Estudiantes */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <BarChart3 className="h-6 w-6 text-white/60" />
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Promedio por Grupo</h3>
                <p className="text-4xl font-bold text-white">{estadisticas.promedioEstudiantesPorGrupo}</p>
              </div>

              {/* Grupos sin Profesor */}
              <div className={`bg-gradient-to-br ${estadisticas.gruposSinProfesor > 0 ? 'from-red-500 to-red-600' : 'from-gray-500 to-gray-600'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  {estadisticas.gruposSinProfesor > 0 && (
                    <span className="px-2 py-1 bg-white/30 rounded-lg text-xs font-bold text-white">
                      ⚠️ Atención
                    </span>
                  )}
                </div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Sin Profesor</h3>
                <p className="text-4xl font-bold text-white">{estadisticas.gruposSinProfesor}</p>
              </div>
            </div>
          )}

          <h2 className="mb-6 text-2xl font-bold text-navy-800 tracking-tight">Grados y Grupos</h2>

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
