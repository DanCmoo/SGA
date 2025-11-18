"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"
import { Toast } from "@/components/toast"

interface Student {
  id: number
  name: string
  selected: boolean
}

export default function CrearGruposPage() {
  const router = useRouter()
  const [selectedGrade, setSelectedGrade] = useState("Parvulos")
  const [selectedGroup, setSelectedGroup] = useState("A")
  const [selectedTeacher, setSelectedTeacher] = useState("Santiago")
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Laura", selected: false },
    { id: 2, name: "Mariana", selected: false },
    { id: 3, name: "Vanesa", selected: false },
    { id: 4, name: "Nicolas", selected: false },
  ])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const grades = ["Parvulos", "Caminadores", "Pre-Jardin"]
  const groups = ["A", "B", "C"]
  const teachers = ["Santiago", "María", "Carlos", "Ana"]

  const toggleStudent = (id: number) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, selected: !student.selected } : student)))
  }

  const handleSave = () => {
    const selectedStudents = students.filter((s) => s.selected)

    if (selectedStudents.length === 0) {
      setToast({ message: "Debes seleccionar al menos un estudiante", type: "error" })
      return
    }

    console.log("[v0] Saving group:", {
      grade: selectedGrade,
      group: selectedGroup,
      teacher: selectedTeacher,
      students: selectedStudents,
    })

    setToast({
      message: `Grupo ${selectedGrade} ${selectedGroup} creado con ${selectedStudents.length} estudiantes`,
      type: "success",
    })

    setTimeout(() => {
      router.push("/coordinador")
    }, 1500)
  }
  // </CHANGE>

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
        {/* </CHANGE> */}

        <Card className="border-2 border-navy-700 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)]">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-navy-800">Creación de Grupos</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-coral-500 to-transparent rounded-full mt-2 mx-auto"></div>
          </div>
          {/* </CHANGE> */}

          {/* Grade and Group Selection */}
          <div className="mb-8 grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block font-semibold text-navy-800">GRADO:</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full border-2 border-navy-700 bg-white rounded-xl px-4 py-2 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500/30 shadow-sm hover:border-brown-600 transition-all duration-200"
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-navy-800">GRUPO:</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full border-2 border-navy-700 bg-white rounded-xl px-4 py-2 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500/30 shadow-sm hover:border-brown-600 transition-all duration-200"
              >
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Teacher Selection */}
          <div className="mb-8">
            <label className="mb-2 block font-semibold text-navy-800">Profesor:</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full border-2 border-navy-700 bg-white rounded-xl px-4 py-2 text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500/30 shadow-sm hover:border-brown-600 transition-all duration-200"
            >
              {teachers.map((teacher) => (
                <option key={teacher} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </div>

          {/* Available Students */}
          <div className="mb-8">
            <h3 className="mb-4 font-semibold text-navy-800">Estudiantes disponibles:</h3>
            <div className="space-y-3">
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
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-12 py-6 text-lg font-semibold text-white rounded-xl shadow-[0_8px_30px_-4px_rgba(34,197,94,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-105"
            >
              Agregar
            </Button>
          </div>
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* </CHANGE> */}
    </div>
  )
}
