"use client"

import { useState } from "react"
import { Eye, FileText, Star, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AchievementsModal } from "@/components/achievements-modal"
import { AchievementsHistoryModal } from "@/components/achievements-history-modal"
import { useToast } from "@/components/toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

const teacherData = {
  name: "María González",
  group: "5to Grado A",
}

const students = [
  { id: 1, name: "Ana Martínez" },
  { id: 2, name: "Luis Rodríguez" },
  { id: 3, name: "José Hernández" },
  { id: 4, name: "Carmen Silva" },
  { id: 5, name: "Pedro Ramírez" },
]

export default function ProfesorPage() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [modalType, setModalType] = useState<"view" | "document" | "star" | null>(null)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedStudentName, setSelectedStudentName] = useState("")
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()
  const { logout } = useAuth()

  const handleAction = (studentId: number, type: "view" | "document" | "star") => {
    setSelectedStudent(studentId)
    setModalType(type)
    const student = students.find((s) => s.id === studentId)
    if (student) {
      setSelectedStudentName(student.name)
      if (type === "star") {
        setIsAchievementsModalOpen(true)
        showToast(`Evaluando logros de ${student.name}`, "info")
      } else if (type === "document") {
        setIsHistoryModalOpen(true)
        showToast(`Cargando historial de ${student.name}`, "info")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100/30 to-navy-50/20">
      <ToastContainer />

      <header className="bg-gradient-to-r from-navy-600 via-navy-700 to-brown-600 text-white py-8 px-8 shadow-xl shadow-navy-600/20 border-b-4 border-brown-600 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-1">Portal del Profesor</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-coral-400 to-coral-500 rounded-full"></div>
          </div>
          <Button
            onClick={() => {
              showToast("Cerrando sesión...", "info")
              setTimeout(() => logout(), 1000)
            }}
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-navy-700 transition-all duration-300 rounded-xl px-6 py-3 font-semibold shadow-lg shadow-white/10 hover:scale-105 flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-navy-500/10 p-10 mb-10 border border-beige-200/50 hover:shadow-2xl hover:shadow-navy-500/15 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-brown-600 text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                <span className="h-2 w-2 bg-brown-600 rounded-full"></span>
                PROFESOR
              </p>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-navy-700 to-navy-900 bg-clip-text text-transparent">
                {teacherData.name}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-brown-600 text-sm font-bold mb-2 uppercase tracking-wider flex items-center justify-end gap-2">
                <span className="h-2 w-2 bg-brown-600 rounded-full"></span>
                GRUPO A CARGO
              </p>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-brown-600 to-brown-800 bg-clip-text text-transparent">
                {teacherData.group}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-navy-500/10 p-10 border border-beige-200/50">
          <h3 className="text-3xl font-bold text-navy-700 mb-8 pb-6 border-b-2 border-beige-300">
            Listado de Estudiantes
          </h3>

          <div className="space-y-5">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-6 bg-gradient-to-r from-beige-50 to-beige-100/50 border-2 border-beige-300 rounded-2xl hover:shadow-lg hover:shadow-beige-300/50 hover:border-brown-400 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-xl font-bold text-navy-700">{student.name}</span>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleAction(student.id, "view")}
                    className="bg-navy-600 hover:bg-navy-700 text-white border-2 border-navy-600 p-4 h-auto rounded-xl shadow-md shadow-navy-600/30 hover:shadow-xl hover:shadow-navy-600/40 transition-all duration-300 transform hover:scale-110"
                    title="Ver información del estudiante"
                  >
                    <Eye className="h-6 w-6" />
                  </Button>

                  <Button
                    onClick={() => handleAction(student.id, "document")}
                    className="bg-coral-500 hover:bg-coral-600 text-white border-2 border-coral-500 p-4 h-auto rounded-xl shadow-md shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 transition-all duration-300 transform hover:scale-110"
                    title="Ver documentos y notas"
                  >
                    <FileText className="h-6 w-6" />
                  </Button>

                  <Button
                    onClick={() => handleAction(student.id, "star")}
                    className="bg-brown-600 hover:bg-brown-700 text-white border-2 border-brown-600 p-4 h-auto rounded-xl shadow-md shadow-brown-600/30 hover:shadow-xl hover:shadow-brown-600/40 transition-all duration-300 transform hover:scale-110"
                    title="Calificaciones y destacados"
                  >
                    <Star className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedStudent && (
        <>
          <AchievementsModal
            isOpen={isAchievementsModalOpen}
            onClose={() => setIsAchievementsModalOpen(false)}
            studentName={selectedStudentName}
            studentId={selectedStudent}
          />
          <AchievementsHistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            studentName={selectedStudentName}
            studentId={selectedStudent}
          />
        </>
      )}
    </div>
  )
}
