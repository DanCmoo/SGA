"use client"

import { useState, useEffect } from "react"
import { X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/toast"
import { 
  LogroService, 
  CategoriaLogroDTO, 
  PeriodoAcademicoDTO,
  EstudianteDTO 
} from "@/lib/services/logro.service"

interface Achievement {
  id: string
  description: string
  value: boolean | null
}

interface AchievementCategory {
  id: string
  title: string
  achievements: Achievement[]
}

interface AchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  studentId: string
}

export function AchievementsModal({ isOpen, onClose, studentName, studentId }: AchievementsModalProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<AchievementCategory[]>([])
  const [periodos, setPeriodos] = useState<PeriodoAcademicoDTO[]>([])
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("")
  const [estudiante, setEstudiante] = useState<EstudianteDTO | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Cargar datos iniciales cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, studentId])

  // Resetear evaluaciones a null cuando cambia el período
  useEffect(() => {
    if (periodoSeleccionado) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        achievements: cat.achievements.map(a => ({ ...a, value: null }))
      })))
    }
  }, [periodoSeleccionado])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Cargar datos del estudiante
      const estudianteData = await LogroService.obtenerEstudiante(studentId)
      setEstudiante(estudianteData)
      
      // Cargar períodos
      const periodosData = await LogroService.obtenerPeriodos()
      setPeriodos(periodosData)
      if (periodosData.length > 0) {
        setPeriodoSeleccionado(periodosData[0].idPeriodo)
      }
      
      // Cargar categorías si el estudiante tiene grado
      if (estudianteData.idGrado) {
        const categoriasData = await LogroService.obtenerCategoriasPorGrado(estudianteData.idGrado)
        
        const categoriasFormatted = categoriasData.map(cat => ({
          id: cat.idCategoria,
          title: cat.nombre,
          achievements: cat.logros.map(logro => ({
            id: logro.idLogro,
            description: logro.descripcion,
            value: null as boolean | null
          }))
        }))
        
        setCategories(categoriasFormatted)
      }
      
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setToast({ message: "Error al cargar los datos", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const toggleAchievement = (categoryId: string, achievementId: string, value: boolean) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat
      return {
        ...cat,
        achievements: cat.achievements.map(ach => {
          if (ach.id !== achievementId) return ach
          return {
            ...ach,
            value: ach.value === value ? null : value
          }
        })
      }
    }))
  }

  const todosLosLogrosEvaluados = (): boolean => {
    return categories.every(cat => 
      cat.achievements.every(achievement => achievement.value !== null)
    )
  }

  const getCalificacion = (category: AchievementCategory): string => {
    // Si algún logro no está evaluado (null), mostrar "Sin calificación"
    const hayNulls = category.achievements.some(a => a.value === null)
    if (hayNulls) return "Sin calificación"
    
    const totalLogros = category.achievements.length
    const logrosAlcanzados = category.achievements.filter(a => a.value === true).length
    const porcentaje = (logrosAlcanzados / totalLogros) * 100
    
    if (porcentaje >= 90) return "Superior"
    if (porcentaje >= 75) return "Alto"
    if (porcentaje >= 60) return "Básico"
    return "Bajo"
  }

  const handleSave = async () => {
    if (!periodoSeleccionado) {
      setToast({ message: "Selecciona un período académico", type: "error" })
      return
    }

    if (!todosLosLogrosEvaluados()) {
      setToast({ message: "Debes evaluar todos los logros antes de guardar", type: "error" })
      return
    }

    try {
      setSaving(true)
      
      const evaluacion = {
        idEstudiante: studentId,
        idPeriodo: periodoSeleccionado,
        categorias: categories.map(cat => ({
          idCategoria: cat.id,
          logrosAlcanzados: cat.achievements.filter(a => a.value === true).map(a => a.id),
          calificacion: getCalificacion(cat)
        }))
      }
      
      await LogroService.registrarEvaluacion(evaluacion)
      
      setToast({ message: `Logros de ${studentName} guardados exitosamente`, type: "success" })
      setTimeout(() => {
        onClose()
      }, 1500)
      
    } catch (error) {
      console.error('Error al guardar:', error)
      setToast({ message: "Error al guardar los logros", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-300">
          <div className="sticky top-0 bg-gradient-to-r from-navy-600 via-navy-700 to-brown-600 rounded-t-2xl p-6 flex justify-between items-center shadow-lg z-10">
            <div className="relative">
              <h2 className="text-2xl font-bold text-white">Evaluación de Logros</h2>
              <p className="text-beige-200 mt-1">Estudiante: {studentName}</p>
              <div className="h-1 w-32 bg-gradient-to-r from-coral-400 to-transparent rounded-full mt-2"></div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-coral-400 p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-90"
              disabled={saving}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Selector de período */}
            <div className="bg-beige-50 border-2 border-beige-300 rounded-xl p-4">
              <label className="block text-sm font-bold text-navy-700 mb-2">Período Académico:</label>
              <select
                value={periodoSeleccionado}
                onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                className="w-full px-4 py-2 border-2 border-navy-600 rounded-xl font-semibold text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-500"
                disabled={loading || saving}
              >
                <option value="">Seleccionar período</option>
                {periodos.map(periodo => (
                  <option key={periodo.idPeriodo} value={periodo.idPeriodo}>
                    {periodo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-navy-600" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl">No hay categorías de logros disponibles</p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border-2 border-beige-300 p-5 bg-gradient-to-br from-beige-50/50 to-beige-100/30 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-bold text-navy-700 mb-4">{category.title}</h3>

                  <div className="space-y-3 mb-4">
                    {category.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors duration-200"
                      >
                        <span className="text-navy-700 flex-1">{achievement.description}</span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleAchievement(category.id, achievement.id, true)}
                            disabled={saving}
                            className={`p-2 border-2 rounded-xl transition-all duration-200 ${
                              achievement.value === true
                                ? "bg-green-500 border-green-600 text-white scale-110 shadow-lg shadow-green-500/30"
                                : "border-green-500 text-green-600 hover:bg-green-50 hover:scale-105"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <Check className="h-5 w-5" strokeWidth={3} />
                          </button>

                          <button
                            onClick={() => toggleAchievement(category.id, achievement.id, false)}
                            disabled={saving}
                            className={`p-2 border-2 rounded-xl transition-all duration-200 ${
                              achievement.value === false
                                ? "bg-red-500 border-red-600 text-white scale-110 shadow-lg shadow-red-500/30"
                                : "border-red-500 text-red-600 hover:bg-red-50 hover:scale-105"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <X className="h-5 w-5" strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-beige-300">
                    <span className="text-brown-600 font-semibold">Calificación:</span>
                    <span className="px-4 py-1 border-2 border-navy-700 rounded-xl font-bold text-navy-700 bg-white shadow-sm">
                      {getCalificacion(category)}
                    </span>
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button
                onClick={onClose}
                disabled={saving}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !periodoSeleccionado || categories.length === 0 || !todosLosLogrosEvaluados()}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                {saving ? "Guardando..." : "Guardar Logros"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
