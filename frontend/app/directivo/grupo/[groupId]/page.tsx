"use client"

import { useParams, useRouter } from "next/navigation"
import { Eye, FileText, Loader2 } from "lucide-react"
import { AchievementsHistoryModal } from "@/components/achievements-history-modal"
import { StudentProfileModal } from "@/components/student-profile-modal"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useToast } from "@/components/toast"
import { useState, useEffect } from "react"
import { DirectivoService, type GrupoDTO, type EstudianteDTO } from "@/lib/services/directivo.service"

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string
  const { showToast, ToastContainer } = useToast()

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<{ nombre: string; idEstudiante: string } | null>(null)
  const [grupo, setGrupo] = useState<GrupoDTO | null>(null)
  const [estudiantes, setEstudiantes] = useState<EstudianteDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [groupId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Cargar estudiantes del grupo
      const estudiantesData = await DirectivoService.obtenerEstudiantesDeGrupo(groupId)
      setEstudiantes(estudiantesData)
      
      // Obtener información del grupo desde los estudiantes (asumiendo que todos tienen el mismo grupo)
      if (estudiantesData.length > 0) {
        const primerEstudiante = estudiantesData[0]
        // Cargar todos los grados para obtener el grupo
        const grados = await DirectivoService.obtenerGrados()
        for (const grado of grados) {
          const grupos = await DirectivoService.obtenerGruposPorGrado(grado.idGrado)
          const grupoEncontrado = grupos.find(g => g.idGrupo === groupId)
          if (grupoEncontrado) {
            setGrupo(grupoEncontrado)
            break
          }
        }
      }
    } catch (err) {
      console.error('Error al cargar datos del grupo:', err)
      setError('Error al cargar los datos del grupo')
      showToast('Error al cargar los datos del grupo', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewStudent = (estudiante: EstudianteDTO) => {
    const nombreCompleto = `${estudiante.nombre}${estudiante.nombre2 ? ' ' + estudiante.nombre2 : ''} ${estudiante.apellido}${estudiante.apellido2 ? ' ' + estudiante.apellido2 : ''}`
    setSelectedStudent({ 
      nombre: nombreCompleto, 
      idEstudiante: estudiante.idEstudiante 
    })
    setIsProfileModalOpen(true)
  }

  const handleViewDocuments = (estudiante: EstudianteDTO) => {
    const nombreCompleto = `${estudiante.nombre}${estudiante.nombre2 ? ' ' + estudiante.nombre2 : ''} ${estudiante.apellido}${estudiante.apellido2 ? ' ' + estudiante.apellido2 : ''}`
    setSelectedStudent({ 
      nombre: nombreCompleto, 
      idEstudiante: estudiante.idEstudiante 
    })
    setIsHistoryModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
        <Loader2 className="h-12 w-12 animate-spin text-navy-600" />
      </div>
    )
  }

  if (error || !grupo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
        <div className="rounded-lg border-4 border-navy-700 bg-white p-8">
          <p className="text-xl text-navy-700">{error || 'Grupo no encontrado'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
      <ToastContainer />

      <div className="mx-auto max-w-4xl p-8">
        <Breadcrumbs items={[{ label: "Directivo", href: "/directivo" }, { label: grupo.nombre }]} />

        <div className="rounded-2xl border-2 border-navy-700 bg-white/95 backdrop-blur-sm p-8 shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] transition-all duration-300 hover:shadow-[0_25px_70px_-15px_rgba(37,52,64,0.4)]">
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-navy-700 to-brown-600 bg-clip-text text-transparent mb-2">
              {grupo.nombre}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-coral-500 to-coral-600 rounded-full"></div>
          </div>

          <div className="mb-8 rounded-xl border-2 border-brown-600 bg-gradient-to-br from-beige-100/50 to-beige-50/30 p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-lg text-navy-800">
              <span className="font-bold text-brown-700">Director de Grupo:</span>{" "}
              <span className="font-semibold">{grupo.nombreProfesor || 'No asignado'}</span>
            </p>
            <p className="text-lg text-navy-800 mt-2">
              <span className="font-bold text-brown-700">Total de Estudiantes:</span>{" "}
              <span className="font-semibold">{estudiantes.length}</span>
            </p>
          </div>

          {/* Students List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-brown-700 mb-4">Listado de estudiantes</h2>
            {estudiantes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No hay estudiantes en este grupo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {estudiantes.map((estudiante) => (
                  <div
                    key={estudiante.idEstudiante}
                    className="flex items-center justify-between rounded-xl border-2 border-brown-600 bg-white p-5 shadow-sm hover:shadow-[0_8px_30px_-4px_rgba(111,77,56,0.25)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-lg font-semibold text-navy-800">
                      {estudiante.nombre}{estudiante.nombre2 ? ' ' + estudiante.nombre2 : ''} {estudiante.apellido}{estudiante.apellido2 ? ' ' + estudiante.apellido2 : ''}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewStudent(estudiante)}
                        className="rounded-xl border-2 border-navy-700 bg-gradient-to-br from-navy-600 to-navy-700 text-white p-3 transition-all duration-300 hover:from-navy-700 hover:to-navy-800 shadow-md shadow-navy-600/30 hover:shadow-xl hover:shadow-navy-600/40 hover:scale-110"
                        title="Ver información del estudiante"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleViewDocuments(estudiante)}
                        className="rounded-xl border-2 border-coral-500 bg-gradient-to-br from-coral-500 to-coral-600 text-white p-3 transition-all duration-300 hover:from-coral-600 hover:to-coral-700 shadow-md shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 hover:scale-110"
                        title="Ver historial de logros"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedStudent && (
        <>
          <StudentProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => {
              setIsProfileModalOpen(false)
              loadData() // Recargar datos después de editar
            }}
            studentName={selectedStudent.nombre}
            studentId={selectedStudent.idEstudiante}
          />
          <AchievementsHistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            studentName={selectedStudent.nombre}
            studentId={selectedStudent.idEstudiante}
          />
        </>
      )}
    </div>
  )
}
