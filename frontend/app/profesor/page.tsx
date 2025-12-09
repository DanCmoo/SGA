"use client"

import { useState, useEffect } from "react"
import { Eye, FileText, Star, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AchievementsModal } from "@/components/achievements-modal"
import { AchievementsHistoryModal } from "@/components/achievements-history-modal"
import { StudentProfileModal } from "@/components/student-profile-modal"
import { useToast } from "@/components/toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LogroService, EstudianteDTO } from "@/lib/services/logro.service"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function ProfesorPage() {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<EstudianteDTO[]>([])
  const [teacherData, setTeacherData] = useState({ name: "", group: "", idGrupo: "" })
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [modalType, setModalType] = useState<"view" | "document" | "star" | null>(null)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedStudentName, setSelectedStudentName] = useState("")
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()
  const { logout, user } = useAuth()

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      
      if (!user || !user.profesor?.grupoAsignado) {
        showToast("No tienes un grupo asignado", "error")
        setLoading(false)
        return
      }

      // Cargar información del profesor
      const nombreCompleto = `${user.nombre} ${user.nombre2 || ''} ${user.apellido} ${user.apellido2 || ''}`.trim()
      
      // Cargar estudiantes del grupo
      const estudiantesData = await LogroService.obtenerEstudiantesGrupo(user.profesor.grupoAsignado)
      
      setTeacherData({
        name: nombreCompleto,
        group: estudiantesData[0]?.nombreGrupo || "Sin grupo",
        idGrupo: user.profesor.grupoAsignado
      })
      
      setStudents(estudiantesData)
      showToast(`Bienvenido, ${nombreCompleto}`, "success")
    } catch (error) {
      console.error('Error al cargar datos:', error)
      showToast("Error al cargar los datos", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (studentId: string, type: "view" | "document" | "star") => {
    setSelectedStudent(studentId)
    setModalType(type)
    const student = students.find((s) => s.idEstudiante === studentId)
    if (student) {
      const nombreCompleto = `${student.nombre} ${student.nombre2 || ''} ${student.apellido} ${student.apellido2 || ''}`.trim()
      setSelectedStudentName(nombreCompleto)
      if (type === "star") {
        setIsAchievementsModalOpen(true)
        showToast(`Evaluando logros de ${nombreCompleto}`, "info")
      } else if (type === "document") {
        setIsHistoryModalOpen(true)
        showToast(`Cargando historial de ${nombreCompleto}`, "info")
      } else if (type === "view") {
        setIsProfileModalOpen(true)
        showToast(`Cargando perfil de ${nombreCompleto}`, "info")
      }
    }
  }

  if (loading) {
    return <LoadingSkeleton />
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
            {students.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl">No hay estudiantes asignados a este grupo</p>
              </div>
            ) : (
              students.map((student) => {
                const nombreCompleto = `${student.nombre} ${student.nombre2 || ''} ${student.apellido} ${student.apellido2 || ''}`.trim()
                return (
                  <div
                    key={student.idEstudiante}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-beige-50 to-beige-100/50 border-2 border-beige-300 rounded-2xl hover:shadow-lg hover:shadow-beige-300/50 hover:border-brown-400 transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-xl font-bold text-navy-700">{nombreCompleto}</span>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleAction(student.idEstudiante, "view")}
                        className="bg-navy-600 hover:bg-navy-700 text-white border-2 border-navy-600 p-4 h-auto rounded-xl shadow-md shadow-navy-600/30 hover:shadow-xl hover:shadow-navy-600/40 transition-all duration-300 transform hover:scale-110"
                        title="Ver información del estudiante"
                      >
                        <Eye className="h-6 w-6" />
                      </Button>

                      <Button
                        onClick={() => handleAction(student.idEstudiante, "document")}
                        className="bg-coral-500 hover:bg-coral-600 text-white border-2 border-coral-500 p-4 h-auto rounded-xl shadow-md shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 transition-all duration-300 transform hover:scale-110"
                        title="Ver historial de evaluaciones"
                      >
                        <FileText className="h-6 w-6" />
                      </Button>

                      <Button
                        onClick={() => handleAction(student.idEstudiante, "star")}
                        className="bg-brown-600 hover:bg-brown-700 text-white border-2 border-brown-600 p-4 h-auto rounded-xl shadow-md shadow-brown-600/30 hover:shadow-xl hover:shadow-brown-600/40 transition-all duration-300 transform hover:scale-110"
                        title="Evaluar logros"
                      >
                        <Star className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      {selectedStudent && (
        <>
          <StudentProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            studentName={selectedStudentName}
            studentId={selectedStudent}
          />
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
