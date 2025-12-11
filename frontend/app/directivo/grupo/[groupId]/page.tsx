"use client"

import { useParams, useRouter } from "next/navigation"
import { Eye, FileText, Loader2, Download, Users, TrendingUp, BarChart } from "lucide-react"
import { AchievementsHistoryModal } from "@/components/achievements-history-modal"
import { StudentProfileModal } from "@/components/student-profile-modal"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useToast } from "@/components/toast"
import { useState, useEffect } from "react"
import { DirectivoService, type GrupoDTO, type EstudianteDTO } from "@/lib/services/directivo.service"

interface EstadisticasGrupo {
  totalEstudiantes: number
  estudiantesActivos: number
  estudiantesInactivos: number
  porcentajeActivos: number
}

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
  const [estadisticas, setEstadisticas] = useState<EstadisticasGrupo>({
    totalEstudiantes: 0,
    estudiantesActivos: 0,
    estudiantesInactivos: 0,
    porcentajeActivos: 0
  })
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
      
      // Calcular estadísticas
      const activos = estudiantesData.filter(e => e.estado !== false).length
      const inactivos = estudiantesData.length - activos
      setEstadisticas({
        totalEstudiantes: estudiantesData.length,
        estudiantesActivos: activos,
        estudiantesInactivos: inactivos,
        porcentajeActivos: estudiantesData.length > 0 ? Math.round((activos / estudiantesData.length) * 100) : 0
      })
      
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

  const handleExportarLista = () => {
    if (estudiantes.length === 0) {
      showToast('No hay estudiantes para exportar', 'error')
      return
    }

    // Crear CSV
    const headers = ['Nombre Completo', 'Documento', 'Estado']
    const rows = estudiantes.map(e => {
      const nombreCompleto = `${e.nombre}${e.nombre2 ? ' ' + e.nombre2 : ''} ${e.apellido}${e.apellido2 ? ' ' + e.apellido2 : ''}`
      return [nombreCompleto, e.numeroDocumento, e.estado !== false ? 'Activo' : 'Inactivo']
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `lista_estudiantes_${grupo?.nombre || 'grupo'}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast('Lista exportada exitosamente', 'success')
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

          {/* Estadísticas del Grupo */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-white/80 text-sm font-medium">Total Estudiantes</p>
              <p className="text-3xl font-bold text-white">{estadisticas.totalEstudiantes}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">Estudiantes Activos</p>
              <p className="text-3xl font-bold text-white">{estadisticas.estudiantesActivos}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-white/80 text-sm font-medium">% Activos</p>
              <p className="text-3xl font-bold text-white">{estadisticas.porcentajeActivos}%</p>
            </div>
          </div>

          <div className="mb-8 rounded-xl border-2 border-brown-600 bg-gradient-to-br from-beige-100/50 to-beige-50/30 p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg text-navy-800">
                  <span className="font-bold text-brown-700">Director de Grupo:</span>{" "}
                  <span className="font-semibold">{grupo.nombreProfesor || 'No asignado'}</span>
                </p>
                <p className="text-lg text-navy-800 mt-2">
                  <span className="font-bold text-brown-700">Grado:</span>{" "}
                  <span className="font-semibold">{grupo.nombreGrado}</span>
                </p>
              </div>
              <button
                onClick={handleExportarLista}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Download className="h-5 w-5" />
                Exportar Lista
              </button>
            </div>
          </div>

          <h2 className="mb-4 text-2xl font-bold text-navy-800">Lista de Estudiantes</h2>
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
