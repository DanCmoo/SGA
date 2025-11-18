"use client"

import { useParams, useRouter } from "next/navigation"
import { Eye, FileText } from "lucide-react"
import { AchievementsHistoryModal } from "@/components/achievements-history-modal"
import { StudentProfileModal } from "@/components/student-profile-modal"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useToast } from "@/components/toast"
import { useState } from "react"

// Mock data - in a real app, this would come from a database
const groupData: Record<string, { name: string; teacher: string; students: string[] }> = {
  "parvulos-a": {
    name: "Parvulos A",
    teacher: "María Fernanda González",
    students: ["Ana María López", "Carlos Rodríguez", "Diana Martínez"],
  },
  "parvulos-b": {
    name: "Parvulos B",
    teacher: "Roberto Jiménez Pérez",
    students: ["Gabriel Torres", "Helena Vargas", "Ignacio Pérez"],
  },
  "parvulos-c": {
    name: "Parvulos C",
    teacher: "Claudia Patricia Ruiz",
    students: ["Laura Sánchez", "Miguel Ángel Castro", "Natalia Rojas"],
  },
  "caminadores-a": {
    name: "Caminadores A",
    teacher: "Jorge Luis Martínez",
    students: ["Quintín Ortiz", "Rosa Delgado", "Sebastián Ruiz"],
  },
  "caminadores-b": {
    name: "Caminadores B",
    teacher: "Andrea Sofía Vargas",
    students: ["Valentina Cruz", "William Flores", "Ximena Gutiérrez"],
  },
  "caminadores-c": {
    name: "Caminadores C",
    teacher: "Fernando Andrés López",
    students: ["Adriana Molina", "Benjamín Cortés", "Camila Ríos"],
  },
  "pre-jardin-a": {
    name: "Pre-Jardin A",
    teacher: "Carolina Méndez Torres",
    students: ["Felipe Medina", "Gabriela Campos", "Héctor Luna"],
  },
  "pre-jardin-b": {
    name: "Pre-Jardin B",
    teacher: "Diego Alejandro Ramírez",
    students: ["Karla Aguilar", "Leonardo Ponce", "Mónica Vera"],
  },
  "pre-jardin-c": {
    name: "Pre-Jardin C",
    teacher: "Valentina Rodríguez Silva",
    students: ["Pablo Serrano", "Quetzal Ibarra", "Raquel Montes"],
  },
}

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string
  const { showToast, ToastContainer } = useToast()

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<{ name: string; id: number } | null>(null)

  const group = groupData[groupId]

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#D5BB93]">
        <div className="rounded-lg border-4 border-[#253440] bg-white p-8">
          <p className="text-xl text-[#253440]">Grupo no encontrado</p>
        </div>
      </div>
    )
  }

  const handleViewStudent = (studentName: string, studentIndex: number) => {
    setSelectedStudent({ name: studentName, id: studentIndex })
    setIsProfileModalOpen(true)
    showToast(`Abriendo perfil de ${studentName}`, "info")
  }

  const handleViewDocuments = (studentName: string, studentIndex: number) => {
    setSelectedStudent({ name: studentName, id: studentIndex })
    setIsHistoryModalOpen(true)
    showToast(`Cargando historial de ${studentName}`, "info")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
      <ToastContainer />

      <div className="mx-auto max-w-4xl p-8">
        <Breadcrumbs items={[{ label: "Directivo", href: "/directivo" }, { label: group.name }]} />

        <div className="rounded-2xl border-2 border-navy-700 bg-white/95 backdrop-blur-sm p-8 shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] transition-all duration-300 hover:shadow-[0_25px_70px_-15px_rgba(37,52,64,0.4)]">
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-navy-700 to-brown-600 bg-clip-text text-transparent mb-2">
              {group.name}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-coral-500 to-coral-600 rounded-full"></div>
          </div>

          <div className="mb-8 rounded-xl border-2 border-brown-600 bg-gradient-to-br from-beige-100/50 to-beige-50/30 p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-lg text-navy-800">
              <span className="font-bold text-brown-700">Profesor:</span>{" "}
              <span className="font-semibold">{group.teacher}</span>
            </p>
          </div>

          {/* Students List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-brown-700 mb-4">Listado de estudiantes</h2>
            <div className="space-y-3">
              {group.students.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border-2 border-brown-600 bg-white p-5 shadow-sm hover:shadow-[0_8px_30px_-4px_rgba(111,77,56,0.25)] transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="text-lg font-semibold text-navy-800">{student}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewStudent(student, index)}
                      className="rounded-xl border-2 border-navy-700 bg-gradient-to-br from-navy-600 to-navy-700 text-white p-3 transition-all duration-300 hover:from-navy-700 hover:to-navy-800 shadow-md shadow-navy-600/30 hover:shadow-xl hover:shadow-navy-600/40 hover:scale-110"
                      title="Ver información del estudiante"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewDocuments(student, index)}
                      className="rounded-xl border-2 border-coral-500 bg-gradient-to-br from-coral-500 to-coral-600 text-white p-3 transition-all duration-300 hover:from-coral-600 hover:to-coral-700 shadow-md shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 hover:scale-110"
                      title="Ver documentos"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <>
          <StudentProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            studentName={selectedStudent.name}
            studentId={selectedStudent.id}
          />
          <AchievementsHistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            studentName={selectedStudent.name}
            studentId={selectedStudent.id}
          />
        </>
      )}
    </div>
  )
}
