"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { Toast } from "@/components/toast"

interface StudentProfileModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  studentId: number
}

export function StudentProfileModal({ isOpen, onClose, studentName, studentId }: StudentProfileModalProps) {
  const [studentData, setStudentData] = useState({
    name: studentName,
    guardian: "Laura Sofía Perez Perez",
    medicalData: ["miopia"],
    learningObservations: ["se distrae"],
  })

  const [newMedicalData, setNewMedicalData] = useState("")
  const [newObservation, setNewObservation] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const handleAddMedicalData = () => {
    if (newMedicalData.trim()) {
      setStudentData({
        ...studentData,
        medicalData: [...studentData.medicalData, newMedicalData.trim()],
      })
      setNewMedicalData("")
      setToast({ message: "Dato médico agregado exitosamente", type: "success" })
    }
  }

  const handleAddObservation = () => {
    if (newObservation.trim()) {
      setStudentData({
        ...studentData,
        learningObservations: [...studentData.learningObservations, newObservation.trim()],
      })
      setNewObservation("")
      setToast({ message: "Observación agregada exitosamente", type: "success" })
    }
  }

  const handleSaveChanges = () => {
    console.log("[v0] Guardando cambios:", studentData)
    setToast({ message: "Cambios guardados exitosamente", type: "success" })
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl shadow-2xl bg-white p-8 transform transition-all animate-in zoom-in-95 duration-300">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl border-2 border-burgundy-700 p-1 text-burgundy-700 transition-all duration-200 hover:bg-burgundy-700 hover:text-white hover:scale-110 hover:rotate-90"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-navy-700 pb-4 border-b-2 border-beige-300">HOJA DE VIDA</h2>
            <div className="h-1 w-32 bg-gradient-to-r from-coral-500 to-transparent rounded-full mt-2 mx-auto"></div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-lg font-semibold text-navy-700">Nombre:</label>
              <div className="rounded-xl border-2 border-beige-300 bg-gradient-to-br from-beige-50/50 to-beige-100/30 p-3 shadow-sm">
                <p className="text-navy-700 font-medium">{studentData.name}</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-lg font-semibold text-navy-700">Acudiente:</label>
              <div className="rounded-xl border-2 border-beige-300 bg-gradient-to-br from-beige-50/50 to-beige-100/30 p-3 shadow-sm">
                <p className="text-navy-700 font-medium">{studentData.guardian}</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-lg font-semibold text-navy-700">Datos Médicos:</label>
              <div className="space-y-2">
                {studentData.medicalData.map((data, index) => (
                  <div
                    key={index}
                    className="rounded-xl border-2 border-beige-300 bg-gradient-to-br from-beige-50/50 to-beige-100/30 p-2 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <p className="text-navy-700">{data}</p>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMedicalData}
                    onChange={(e) => setNewMedicalData(e.target.value)}
                    placeholder="Añadir"
                    className="flex-1 rounded-xl border-2 border-beige-300 bg-white px-4 py-2 text-navy-700 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                    onKeyPress={(e) => e.key === "Enter" && handleAddMedicalData()}
                  />
                  <button
                    onClick={handleAddMedicalData}
                    className="rounded-xl border-2 border-green-500 bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 font-semibold text-white transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-lg font-semibold text-navy-700">Observaciones de Aprendizaje:</label>
              <div className="space-y-2">
                {studentData.learningObservations.map((observation, index) => (
                  <div
                    key={index}
                    className="rounded-xl border-2 border-beige-300 bg-gradient-to-br from-beige-50/50 to-beige-100/30 p-2 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <p className="text-navy-700">{observation}</p>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newObservation}
                    onChange={(e) => setNewObservation(e.target.value)}
                    placeholder="Añadir"
                    className="flex-1 rounded-xl border-2 border-beige-300 bg-white px-4 py-2 text-navy-700 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                    onKeyPress={(e) => e.key === "Enter" && handleAddObservation()}
                  />
                  <button
                    onClick={handleAddObservation}
                    className="rounded-xl border-2 border-green-500 bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 font-semibold text-white transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleSaveChanges}
                className="w-full max-w-md rounded-xl border-2 border-green-500 bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-lg font-bold text-white transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
