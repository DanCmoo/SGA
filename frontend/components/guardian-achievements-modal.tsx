"use client"
import { X, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { AcudienteService } from "@/lib/services/acudiente.service"
import type { HistoricoLogroDTO, PeriodoAcademicoDTO } from "@/lib/services/logro.service"
import { LogroService } from "@/lib/services/logro.service"
import { BoletinService } from "@/lib/services/boletin.service"

interface GuardianAchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  studentId: string
  idAcudiente: string
}

export function GuardianAchievementsModal({ 
  isOpen, 
  onClose, 
  studentName, 
  studentId,
  idAcudiente 
}: GuardianAchievementsModalProps) {
  const [loading, setLoading] = useState(true)
  const [historico, setHistorico] = useState<HistoricoLogroDTO[]>([])
  const [periodos, setPeriodos] = useState<PeriodoAcademicoDTO[]>([])
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("")
  const [descargandoPDF, setDescargandoPDF] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, studentId, idAcudiente])

  const loadData = async () => {
    setLoading(true)
    try {
      const [historicoData, periodosData] = await Promise.all([
        AcudienteService.obtenerHistoricoEstudiante(idAcudiente, studentId),
        LogroService.obtenerPeriodos()
      ])
      
      setHistorico(historicoData)
      setPeriodos(periodosData)
      if (periodosData.length > 0) {
        setPeriodoSeleccionado(periodosData[0].idPeriodo)
      }
    } catch (error) {
      console.error("Error cargando histórico:", error)
    } finally {
      setLoading(false)
    }
  }

  const evaluacionSeleccionada = historico.find(h => h.periodo.idPeriodo === periodoSeleccionado)

  const handleDescargarBoletin = async () => {
    if (!periodoSeleccionado || !studentId) return
    
    setDescargandoPDF(true)
    try {
      await BoletinService.descargarYGuardarBoletin(studentId, periodoSeleccionado, studentName)
    } catch (error) {
      console.error("Error descargando boletín:", error)
      alert("Error al descargar el boletín. Por favor intente nuevamente.")
    } finally {
      setDescargandoPDF(false)
    }
  }

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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-navy-600" />
            </div>
          ) : historico.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No hay evaluaciones registradas para este estudiante</p>
            </div>
          ) : (
            <>
              {/* Selector de período y botón de descarga */}
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-navy-700">Período Académico:</label>
                  <select
                    value={periodoSeleccionado}
                    onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-brown-400 rounded-xl bg-white text-navy-700 font-medium shadow-sm hover:border-brown-600 focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all"
                  >
                    {periodos.map((periodo) => (
                      <option key={periodo.idPeriodo} value={periodo.idPeriodo}>
                        {periodo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleDescargarBoletin}
                  disabled={descargandoPDF || !periodoSeleccionado}
                  className="bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {descargandoPDF ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Descargando...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Descargar Boletín
                    </>
                  )}
                </Button>
              </div>

              {evaluacionSeleccionada && (
                <>
                  {/* Información del período */}
                  <div className="bg-gradient-to-r from-beige-50 to-beige-100/50 rounded-xl p-4 border-2 border-brown-400">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-semibold text-brown-700">Fecha Inicio:</span>
                        <p className="text-navy-700 font-medium">
                          {new Date(evaluacionSeleccionada.periodo.fechaInicio).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-brown-700">Fecha Fin:</span>
                        <p className="text-navy-700 font-medium">
                          {new Date(evaluacionSeleccionada.periodo.fechaFin).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Categorías y logros */}
                  <div className="space-y-6">
                    {evaluacionSeleccionada.categorias.map((categoria) => (
                      <div
                        key={categoria.idCategoria}
                        className="space-y-4 pb-6 border-b-2 border-brown-300 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-navy-700">{categoria.nombreCategoria}</h3>
                          <span className="px-4 py-2 bg-navy-600 text-white rounded-xl font-bold text-lg shadow-md">
                            {categoria.calificacion}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-brown-700">
                            Logros Alcanzados ({categoria.logrosAlcanzados.length} de {categoria.totalLogros}):
                          </p>
                          {categoria.logrosAlcanzados.length > 0 ? (
                            <ul className="space-y-2 ml-4">
                              {categoria.logrosAlcanzados.map((logro) => (
                                <li key={logro.idLogro} className="flex items-start gap-2 text-navy-700">
                                  <span className="text-coral-500 mt-1">✓</span>
                                  <span>{logro.descripcion}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 italic ml-4">No hay logros alcanzados en esta categoría</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
