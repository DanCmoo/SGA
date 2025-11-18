"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AchievementsHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  studentId: number
}

// Mock data - esto se reemplazará con datos reales de la base de datos
const mockHistoricalData = {
  startDate: "2024-01-15",
  endDate: "2024-03-15",
  categories: {
    psicosociales: {
      achievements: [
        "Se comunica con otros estudiantes",
        "Trabaja en equipo efectivamente",
        "Muestra empatía con sus compañeros",
      ],
      score: 85,
    },
    psicomotores: {
      achievements: [
        "Sabe usar las manos con facilidad",
        "Coordina movimientos corporales",
        "Realiza actividades físicas adecuadamente",
      ],
      score: 90,
    },
    cognitivos: {
      achievements: ["Usa razonamiento lógico", "Resuelve problemas complejos", "Comprende conceptos abstractos"],
      score: 78,
    },
    procedimentales: {
      achievements: ["Sabe hacer cosas", "Sigue instrucciones correctamente", "Completa tareas asignadas"],
      score: 88,
    },
  },
}

export function AchievementsHistoryModal({ isOpen, onClose, studentName, studentId }: AchievementsHistoryModalProps) {
  if (!isOpen) return null

  const data = mockHistoricalData
  const totalScore = Math.round(
    (data.categories.psicosociales.score +
      data.categories.psicomotores.score +
      data.categories.cognitivos.score +
      data.categories.procedimentales.score) /
      4,
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#253440] to-[#253440]/90 rounded-t-2xl p-6 flex justify-between items-center shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-white">HISTÓRICO DE LOGROS</h2>
            <p className="text-[#D5BB93] mt-1">Estudiante: {studentName}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white/80 hover:text-[#F67891] hover:bg-transparent p-2 h-auto transition-all duration-200 hover:scale-110 hover:rotate-90"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-[#D5BB93]">
            <div>
              <label className="block text-sm font-semibold text-[#253440] mb-2">Fecha inicio:</label>
              <input
                type="text"
                value={data.startDate}
                readOnly
                className="w-full px-4 py-2 border-2 border-[#D5BB93] rounded-xl bg-[#D5BB93]/20 text-[#253440] font-medium shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#253440] mb-2">Fecha fin:</label>
              <input
                type="text"
                value={data.endDate}
                readOnly
                className="w-full px-4 py-2 border-2 border-[#D5BB93] rounded-xl bg-[#D5BB93]/20 text-[#253440] font-medium shadow-sm"
              />
            </div>
          </div>

          {/* Logros Psicosociales */}
          <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-[#D5BB93]/10 to-[#D5BB93]/5">
            <h3 className="text-lg font-bold text-[#253440]">Logros Psicosociales:</h3>
            <ul className="space-y-2 ml-4">
              {data.categories.psicosociales.achievements.map((achievement, index) => (
                <li key={index} className="text-[#253440]">
                  • {achievement}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm font-semibold text-[#253440]">Puntuación:</span>
              <input
                type="text"
                value={data.categories.psicosociales.score}
                readOnly
                className="w-20 px-3 py-1 border-2 border-[#253440] rounded-xl bg-white text-center font-bold text-[#253440] shadow-sm"
              />
            </div>
          </div>

          {/* Logros Psicomotores */}
          <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-[#D5BB93]/10 to-[#D5BB93]/5">
            <h3 className="text-lg font-bold text-[#253440]">Logros Psicomotores:</h3>
            <ul className="space-y-2 ml-4">
              {data.categories.psicomotores.achievements.map((achievement, index) => (
                <li key={index} className="text-[#253440]">
                  • {achievement}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm font-semibold text-[#253440]">Puntuación:</span>
              <input
                type="text"
                value={data.categories.psicomotores.score}
                readOnly
                className="w-20 px-3 py-1 border-2 border-[#253440] rounded-xl bg-white text-center font-bold text-[#253440] shadow-sm"
              />
            </div>
          </div>

          {/* Logros Cognitivos */}
          <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-[#D5BB93]/10 to-[#D5BB93]/5">
            <h3 className="text-lg font-bold text-[#253440]">Logros Cognitivos:</h3>
            <ul className="space-y-2 ml-4">
              {data.categories.cognitivos.achievements.map((achievement, index) => (
                <li key={index} className="text-[#253440]">
                  • {achievement}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm font-semibold text-[#253440]">Puntuación:</span>
              <input
                type="text"
                value={data.categories.cognitivos.score}
                readOnly
                className="w-20 px-3 py-1 border-2 border-[#253440] rounded-xl bg-white text-center font-bold text-[#253440] shadow-sm"
              />
            </div>
          </div>

          {/* Logros Procedimentales */}
          <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-[#D5BB93]/10 to-[#D5BB93]/5">
            <h3 className="text-lg font-bold text-[#253440]">Logros Procedimentales:</h3>
            <ul className="space-y-2 ml-4">
              {data.categories.procedimentales.achievements.map((achievement, index) => (
                <li key={index} className="text-[#253440]">
                  • {achievement}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm font-semibold text-[#253440]">Puntuación:</span>
              <input
                type="text"
                value={data.categories.procedimentales.score}
                readOnly
                className="w-20 px-3 py-1 border-2 border-[#253440] rounded-xl bg-white text-center font-bold text-[#253440] shadow-sm"
              />
            </div>
          </div>

          {/* Total Score */}
          <div className="pt-6 border-t-4 border-[#253440] rounded-xl flex items-center justify-center gap-4">
            <span className="text-xl font-bold text-[#253440]">Puntuación total:</span>
            <input
              type="text"
              value={totalScore}
              readOnly
              className="w-24 px-4 py-2 border-4 border-[#253440] rounded-xl bg-gradient-to-br from-[#F67891]/20 to-[#F67891]/10 text-center text-xl font-bold text-[#253440] shadow-lg"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
