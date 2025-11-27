"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { Toast } from "@/components/toast"
import { GrupoService, GradoDTO, ProfesorDTO, EstudianteAprobadoDTO } from "@/lib/services/grupo.service"

interface Student {
  id: string
  name: string
  selected: boolean
}

export default function CrearGruposPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [grados, setGrados] = useState<GradoDTO[]>([])
  const [profesores, setProfesores] = useState<ProfesorDTO[]>([])
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<EstudianteAprobadoDTO[]>([])
  
  const [selectedGradeId, setSelectedGradeId] = useState<string>("")
  const [groupName, setGroupName] = useState("")
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("")
  const [students, setStudents] = useState<Student[]>([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    // Filtrar estudiantes cuando cambia el grado seleccionado
    if (selectedGradeId && estudiantesDisponibles.length > 0) {
      const gradoSeleccionado = grados.find(g => g.idGrado === selectedGradeId)
      if (gradoSeleccionado) {
        const estudiantesFiltrados = estudiantesDisponibles.filter(
          est => est.gradoSolicitado === gradoSeleccionado.nombreGrado
        )
        
        const studentsUI = estudiantesFiltrados.map(est => ({
          id: est.idEstudiante,
          name: `${est.nombre} ${est.nombre2 || ''} ${est.apellido} ${est.apellido2 || ''}`.trim(),
          selected: false
        }))
        setStudents(studentsUI)
      }
    }
  }, [selectedGradeId, estudiantesDisponibles, grados])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [gradosData, profesoresData, estudiantesData] = await Promise.all([
        GrupoService.obtenerGrados(),
        GrupoService.obtenerProfesores(),
        GrupoService.obtenerEstudiantesAprobados()
      ])

      setGrados(gradosData)
      setProfesores(profesoresData)
      setEstudiantesDisponibles(estudiantesData)

      // Seleccionar primer grado y profesor por defecto
      if (gradosData.length > 0) setSelectedGradeId(gradosData[0].idGrado)
      if (profesoresData.length > 0) setSelectedTeacherId(profesoresData[0].idUsuario)
    } catch (error) {
      console.error("Error cargando datos:", error)
      setToast({ message: "Error al cargar los datos", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const toggleStudent = (id: string) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, selected: !student.selected } : student)))
  }

  const handleSave = async () => {
    const selectedStudents = students.filter((s) => s.selected)

    if (!groupName.trim()) {
      setToast({ message: "Debes ingresar un nombre para el grupo", type: "error" })
      return
    }

    if (!selectedGradeId) {
      setToast({ message: "Debes seleccionar un grado", type: "error" })
      return
    }

    if (!selectedTeacherId) {
      setToast({ message: "Debes seleccionar un profesor", type: "error" })
      return
    }

    if (selectedStudents.length === 0) {
      setToast({ message: "Debes seleccionar al menos un estudiante", type: "error" })
      return
    }

    try {
      setSaving(true)
      
      // Crear el grupo
      const nuevoGrupo = await GrupoService.crearGrupo({
        nombre: groupName,
        idGrado: selectedGradeId,
        idProfesor: selectedTeacherId
      })

      // Asignar estudiantes al grupo
      for (const student of selectedStudents) {
        await GrupoService.asignarEstudianteAGrupo(student.id, nuevoGrupo.idGrupo)
      }

      setToast({
        message: `Grupo ${groupName} creado exitosamente con ${selectedStudents.length} estudiantes`,
        type: "success",
      })

      setTimeout(() => {
        router.push("/coordinador")
      }, 1500)
    } catch (error) {
      console.error("Error creando grupo:", error)
      setToast({ message: "Error al crear el grupo", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200 p-8">
      <div className="mx-auto max-w-4xl">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-navy-700 hover:bg-navy-100/50 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Volver
        </Button>

        <Card className="border-2 border-navy-700 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)]">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-navy-800">Creación de Grupos</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-coral-500 to-transparent rounded-full mt-2 mx-auto"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-navy-700" />
            </div>
          ) : (
            <>
              {/* Grade and Group Name Selection */}
              <div className="mb-8 grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block font-semibold text-navy-800">GRADO:</label>
                  <select
                    value={selectedGradeId}
                    onChange={(e) => setSelectedGradeId(e.target.value)}
                    className="w-full border-2 border-navy-700 bg-white rounded-xl px-4 py-2 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500/30 shadow-sm hover:border-brown-600 transition-all duration-200"
                  >
                    {grados.map((grado) => (
                      <option key={grado.idGrado} value={grado.idGrado}>
                        {grado.nombreGrado}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-navy-800">NOMBRE DEL GRUPO:</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Ej: A, B, Margaritas, etc."
                    className="w-full border-2 border-navy-700 bg-white rounded-xl px-4 py-2 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500/30 shadow-sm hover:border-brown-600 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Teacher Selection */}
              <div className="mb-8">
                <label className="mb-2 block font-semibold text-navy-800">Profesor Director:</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full border-2 border-navy-700 bg-white rounded-xl px-4 py-2 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500/30 shadow-sm hover:border-brown-600 transition-all duration-200"
                >
                  {profesores.map((profesor) => (
                    <option key={profesor.idUsuario} value={profesor.idUsuario}>
                      {profesor.nombre} {profesor.nombre2 || ''} {profesor.apellido} {profesor.apellido2 || ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Available Students */}
              <div className="mb-8">
                <h3 className="mb-4 font-semibold text-navy-800">
                  Estudiantes disponibles ({students.length}):
                </h3>
                {students.length === 0 ? (
                  <p className="text-gray-500 italic">No hay estudiantes aprobados sin grupo asignado</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center gap-3">
                        <button
                          onClick={() => toggleStudent(student.id)}
                          className={`flex h-6 w-6 items-center justify-center border-2 rounded transition-all duration-200 shadow-sm ${
                            student.selected
                              ? "border-green-600 bg-green-600 shadow-[0_2px_10px_-2px_rgba(34,197,94,0.4)]"
                              : "border-navy-700 bg-white hover:border-green-500"
                          }`}
                        >
                          {student.selected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                        </button>
                        <label
                          onClick={() => toggleStudent(student.id)}
                          className="cursor-pointer text-lg text-navy-800 hover:text-navy-600 transition-colors"
                        >
                          {student.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSave}
                  disabled={saving || students.length === 0}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-12 py-6 text-lg font-semibold text-white rounded-xl shadow-[0_8px_30px_-4px_rgba(34,197,94,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Grupo"
                  )}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
