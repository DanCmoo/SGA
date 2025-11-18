"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/toast"

interface Achievement {
  id: string
  description: string
  value: "check" | "x" | null
}

interface AchievementCategory {
  title: string
  achievements: Achievement[]
  score: number
}

interface AchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  studentId: number
}

export function AchievementsModal({ isOpen, onClose, studentName, studentId }: AchievementsModalProps) {
  const [categories, setCategories] = useState<AchievementCategory[]>([
    {
      title: "Logros Psicosociales",
      score: 0,
      achievements: [
        { id: "ps1", description: "Se comunica con otros estudiantes", value: null },
        { id: "ps2", description: "Trabaja en equipo efectivamente", value: null },
        { id: "ps3", description: "Muestra empatía con sus compañeros", value: null },
      ],
    },
    {
      title: "Logros Psicomotores",
      score: 0,
      achievements: [
        { id: "pm1", description: "Sabe usar las manos con facilidad", value: null },
        { id: "pm2", description: "Tiene buena coordinación motora", value: null },
        { id: "pm3", description: "Realiza actividades físicas correctamente", value: null },
      ],
    },
    {
      title: "Logros Cognitivos",
      score: 0,
      achievements: [
        { id: "cg1", description: "Usa razonamiento lógico", value: null },
        { id: "cg2", description: "Resuelve problemas de forma creativa", value: null },
        { id: "cg3", description: "Comprende conceptos abstractos", value: null },
      ],
    },
    {
      title: "Logros Procedimentales",
      score: 0,
      achievements: [
        { id: "pr1", description: "Sabe hacer cosas de forma autónoma", value: null },
        { id: "pr2", description: "Sigue instrucciones correctamente", value: null },
        { id: "pr3", description: "Completa tareas asignadas", value: null },
      ],
    },
  ])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const toggleAchievement = (categoryIndex: number, achievementId: string, value: "check" | "x") => {
    setCategories((prev) => {
      const newCategories = [...prev]
      const category = newCategories[categoryIndex]
      const achievement = category.achievements.find((a) => a.id === achievementId)

      if (achievement) {
        achievement.value = achievement.value === value ? null : value
      }

      const checkCount = category.achievements.filter((a) => a.value === "check").length
      const totalAchievements = category.achievements.length
      category.score = Math.round((checkCount / totalAchievements) * 100)

      return newCategories
    })
  }

  const getTotalScore = () => {
    return Math.round(categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length)
  }

  const handleSave = () => {
    console.log("[v0] Saving achievements for student", studentId, categories)
    setToast({ message: `Logros de ${studentName} guardados exitosamente`, type: "success" })
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-300">
          <div className="sticky top-0 bg-gradient-to-r from-navy-600 via-navy-700 to-brown-600 rounded-t-2xl p-6 flex justify-between items-center shadow-lg z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold text-white">Gestión de Logros</h2>
              <p className="text-beige-200 mt-1">Estudiante: {studentName}</p>
              <div className="h-1 w-32 bg-gradient-to-r from-coral-400 to-transparent rounded-full mt-2"></div>
            </div>
            <button
              onClick={onClose}
              className="relative text-white/80 hover:text-coral-400 p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-90"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {categories.map((category, categoryIndex) => (
              <div
                key={category.title}
                className="rounded-2xl border-2 border-beige-300 p-5 bg-gradient-to-br from-beige-50/50 to-beige-100/30 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-bold text-navy-700 mb-4">{category.title}:</h3>

                <div className="space-y-3 mb-4">
                  {category.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-white/50 transition-colors duration-200"
                    >
                      <span className="text-navy-700 flex-1">{achievement.description}</span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleAchievement(categoryIndex, achievement.id, "check")}
                          className={`p-2 border-2 rounded-xl transition-all duration-200 ${
                            achievement.value === "check"
                              ? "bg-green-500 border-green-600 text-white scale-110 shadow-lg shadow-green-500/30"
                              : "border-green-500 text-green-600 hover:bg-green-50 hover:scale-105"
                          }`}
                        >
                          <Check className="h-5 w-5" strokeWidth={3} />
                        </button>

                        <button
                          onClick={() => toggleAchievement(categoryIndex, achievement.id, "x")}
                          className={`p-2 border-2 rounded-xl transition-all duration-200 ${
                            achievement.value === "x"
                              ? "bg-burgundy-700 border-burgundy-700 text-white scale-110 shadow-lg shadow-burgundy-700/30"
                              : "border-burgundy-700 text-burgundy-700 hover:bg-red-50 hover:scale-105"
                          }`}
                        >
                          <X className="h-5 w-5" strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-beige-300">
                  <span className="text-brown-600 font-semibold">Puntuación:</span>
                  <input
                    type="text"
                    value={category.score}
                    readOnly
                    className="w-20 px-3 py-1 border-2 border-navy-700 rounded-xl text-center font-bold text-navy-700 bg-white shadow-sm"
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t-4 border-navy-700 rounded-xl">
              <span className="text-xl font-bold text-navy-700">Puntuación total:</span>
              <input
                type="text"
                value={getTotalScore()}
                readOnly
                className="w-24 px-4 py-2 border-4 border-navy-700 rounded-xl text-center text-xl font-bold text-navy-700 bg-gradient-to-br from-coral-500/20 to-coral-500/10 shadow-lg"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-2 border-green-600 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Guardar Logros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
