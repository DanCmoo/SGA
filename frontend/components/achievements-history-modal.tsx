"use client"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { LogroService, type HistoricoLogroDTO, type PeriodoAcademicoDTO } from "@/lib/services/logro.service"

interface AchievementsHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  studentId: string
}

export function AchievementsHistoryModal({ isOpen, onClose, studentName, studentId }: AchievementsHistoryModalProps) {
  const [loading, setLoading] = useState(true)
  const [historico, setHistorico] = useState<HistoricoLogroDTO[]>([])
  const [periodos, setPeriodos] = useState<PeriodoAcademicoDTO[]>([])
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, studentId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [historicData, periodosData] = await Promise.all([
        LogroService.obtenerHistoricoLogros(studentId),
        LogroService.obtenerPeriodos()
      ])
      
      // Filtrar categorías duplicadas en cada período
      const historicoLimpio = historicData.map(h => ({
        ...h,
        categorias: h.categorias.filter((cat, index, self) => 
          index === self.findIndex(c => c.idCategoria === cat.idCategoria)
        )
      }))
      
      setHistorico(historicoLimpio)
      setPeriodos(periodosData)
      if (periodosData.length > 0) {
        setPeriodoSeleccionado(periodosData[0].idPeriodo)
      }
    } catch (error: any) {
      console.error("Error cargando histórico:", error)
      console.error("Detalles del error:", {
        message: error?.message,
        status: error?.status,
        error: error?.error
      })
    } finally {
      setLoading(false)
    }
  }

  const evaluacionSeleccionada = historico.find(h => h.periodo.idPeriodo === periodoSeleccionado)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-0 transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-navy-600 via-navy-700 to-brown-600 rounded-t-2xl p-6 flex justify-between items-center shadow-lg z-10">
          <div className="relative">
            <h2 className="text-2xl font-bold text-white">Histórico de Logros</h2>
            <p className="text-beige-200 mt-1">Estudiante: {studentName}</p>
            <div className="h-1 w-32 bg-gradient-to-r from-coral-400 to-transparent rounded-full mt-2"></div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white/80 hover:text-coral-400 hover:bg-transparent p-2 h-auto transition-all duration-200 hover:scale-110 hover:rotate-90"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selector de período */}
          <div className="bg-beige-50 border-2 border-beige-300 rounded-xl p-4">
            <label className="block text-sm font-bold text-navy-700 mb-2">Período Académico:</label>
            <select
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border-2 border-navy-600 rounded-xl font-semibold text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-500"
              disabled={loading}
            >
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
          ) : !evaluacionSeleccionada ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No hay evaluaciones para este período</p>
            </div>
          ) : (
            <>
              {/* Fechas del período */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-beige-300">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Fecha inicio:</label>
                  <input
                    type="text"
                    value={new Date(evaluacionSeleccionada.periodo.fechaInicio).toLocaleDateString('es-CO')}
                    readOnly
                    className="w-full px-4 py-2 border-2 border-beige-300 rounded-xl bg-beige-50 text-navy-700 font-medium shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Fecha fin:</label>
                  <input
                    type="text"
                    value={new Date(evaluacionSeleccionada.periodo.fechaFin).toLocaleDateString('es-CO')}
                    readOnly
                    className="w-full px-4 py-2 border-2 border-beige-300 rounded-xl bg-beige-50 text-navy-700 font-medium shadow-sm"
                  />
                </div>
              </div>

              {/* Categorías evaluadas */}
              {evaluacionSeleccionada.categorias.map((categoria) => (
                <div
                  key={categoria.idCategoria}
                  className="space-y-3 p-5 rounded-2xl border-2 border-beige-300 bg-gradient-to-br from-beige-50/50 to-beige-100/30 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-navy-700">{categoria.nombreCategoria}</h3>
                  <p className="text-navy-600 text-sm">
                    Esta categoría contiene {categoria.totalLogros} logros evaluados
                  </p>
                  <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-beige-300">
                    <span className="text-brown-600 font-semibold">Calificación:</span>
                    <span className="px-4 py-1 border-2 border-navy-700 rounded-xl font-bold text-navy-700 bg-white shadow-sm">
                      {categoria.calificacion}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

