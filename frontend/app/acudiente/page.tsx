"use client"

import { useState } from "react"
import { FileText, Download, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GuardianAchievementsModal } from "@/components/guardian-achievements-modal"
import { Toast } from "@/components/toast"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"

const guardianData = {
  name: "Laura Sofía Perez Perez",
  students: [
    { id: 1, name: "Vanessa Rodriguez", grade: "5to Grado" },
    { id: 2, name: "Sebastian Bedoya", grade: "3er Grado" },
  ],
}

export default function AcudientePage() {
  const router = useRouter()
  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleViewDocuments = (studentId: number, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName })
    setIsModalOpen(true)
  }

  const handleDownloadReport = async (studentId: number, studentName: string) => {
    setIsLoading(true)
    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setToast({ message: `Reporte de ${studentName} descargado exitosamente`, type: "success" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100/30 to-navy-50/20">
      <header className="bg-gradient-to-r from-navy-600 via-navy-700 to-brown-600 text-white py-8 px-8 shadow-xl shadow-navy-600/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative container mx-auto max-w-5xl flex items-center gap-4">
          <Button onClick={() => router.push("/")} variant="ghost" className="text-white hover:bg-white/10 rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Portal del Acudiente</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-coral-400 to-transparent rounded-full mt-2"></div>
          </div>
        </div>
      </header>
      {/* </CHANGE> */}

      <main className="container mx-auto px-6 py-16 max-w-5xl">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-navy-500/15 p-12 border border-beige-200/50">
          <div className="mb-10 pb-8 border-b-2 border-brown-400">
            <h2 className="text-3xl font-bold text-navy-700">Acudiente: {guardianData.name}</h2>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-navy-700 mb-8">Estudiantes a Cargo:</h3>

            {isLoading ? (
              <LoadingSkeleton count={2} />
            ) : guardianData.students.length === 0 ? (
              <EmptyState
                title="No hay estudiantes asignados"
                description="Actualmente no tienes estudiantes a tu cargo"
              />
            ) : (
              <div className="space-y-6">
                {guardianData.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-beige-50 to-beige-100/50 rounded-2xl border-2 border-brown-400 hover:shadow-xl hover:shadow-beige-300/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex-1">
                      <p className="text-xl font-bold text-navy-700">{student.name}</p>
                      <p className="text-base text-brown-600 mt-1">{student.grade}</p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleViewDocuments(student.id, student.name)}
                        className="bg-navy-600 hover:bg-navy-700 text-white p-4 rounded-xl transition-all duration-300 shadow-md shadow-navy-600/30 hover:shadow-xl hover:shadow-navy-600/40 transform hover:scale-110"
                        title="Ver documentos"
                      >
                        <FileText className="h-6 w-6" />
                      </Button>

                      <Button
                        onClick={() => handleDownloadReport(student.id, student.name)}
                        disabled={isLoading}
                        className="bg-coral-500 hover:bg-coral-600 text-white p-4 rounded-xl transition-all duration-300 shadow-md shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Descargar reporte"
                      >
                        <Download className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* </CHANGE> */}
          </div>

          <div className="mt-10 pt-8 border-t-2 border-brown-400">
            <p className="text-base text-brown-600">
              Puede ver los documentos y descargar reportes de cada estudiante usando los botones correspondientes.
            </p>
          </div>
        </div>
      </main>

      {selectedStudent && (
        <GuardianAchievementsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          studentName={selectedStudent.name}
          studentId={selectedStudent.id}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* </CHANGE> */}
    </div>
  )
}
