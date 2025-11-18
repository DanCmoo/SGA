"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Toast } from "@/components/toast"
import { EmptyState } from "@/components/empty-state"

interface PreregisteredStudent {
  id: number
  name: string
  grade: string
  status: "pending" | "accepted" | "rejected"
}

export default function CoordinadorPage() {
  const router = useRouter()
  const [students, setStudents] = useState<PreregisteredStudent[]>([
    { id: 1, name: "Ana Perez", grade: "Parvulos", status: "pending" },
    { id: 2, name: "Juanito", grade: "Caminadores", status: "pending" },
    { id: 3, name: "Debas", grade: "Pre-Jardin", status: "pending" },
    { id: 4, name: "Daniel", grade: "Parvulos", status: "pending" },
  ])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const handleAccept = (id: number, name: string) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, status: "accepted" as const } : student)))
    setToast({ message: `${name} ha sido aceptado exitosamente`, type: "success" })
  }

  const handleReject = (id: number, name: string) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, status: "rejected" as const } : student)))
    setToast({ message: `${name} ha sido rechazado`, type: "error" })
  }

  const pendingStudents = students.filter((s) => s.status === "pending")

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200 p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-navy-700 hover:bg-navy-100/50 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-5xl font-bold text-navy-800 tracking-tight">Panel de Coordinador</h1>
              <div className="h-1 w-48 bg-gradient-to-r from-coral-500 to-transparent rounded-full mt-2"></div>
            </div>
          </div>
          <Button
            onClick={() => router.push("/coordinador/crear-grupos")}
            className="bg-gradient-to-r from-navy-700 to-brown-700 px-10 py-7 text-lg font-bold text-white hover:from-brown-700 hover:to-navy-700 rounded-2xl shadow-[0_8px_30px_-4px_rgba(37,52,64,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(37,52,64,0.5)] transition-all duration-300 transform hover:scale-105"
          >
            Creación Grupos
          </Button>
        </div>
        {/* </CHANGE> */}

        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] p-12 border border-beige-300/50">
          <h2 className="mb-10 font-serif text-3xl font-bold text-navy-800">LISTADO DE ESTUDIANTES PREINSCRITOS</h2>

          {pendingStudents.length === 0 ? (
            <EmptyState
              title="No hay estudiantes pendientes"
              description="Todos los estudiantes preinscritos han sido procesados"
            />
          ) : (
            <div className="space-y-6">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-b-2 border-beige-300 pb-6 last:border-b-0 hover:bg-beige-50/50 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-navy-800">{student.name}</p>
                    <p className="text-base text-brown-700 mt-1">Grado: {student.grade}</p>
                  </div>

                  <div className="flex gap-5">
                    {student.status === "pending" && (
                      <>
                        <Button
                          onClick={() => handleAccept(student.id, student.name)}
                          className="border-2 border-navy-700 bg-white px-10 py-3 text-navy-700 hover:bg-navy-700 hover:text-white rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_-4px_rgba(37,52,64,0.3)] transform hover:scale-105"
                        >
                          Aceptar
                        </Button>
                        <Button
                          onClick={() => handleReject(student.id, student.name)}
                          className="border-2 border-burgundy-700 bg-white px-10 py-3 text-burgundy-700 hover:bg-burgundy-700 hover:text-white rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_-4px_rgba(99,32,36,0.3)] transform hover:scale-105"
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    {student.status === "accepted" && (
                      <span className="rounded-xl bg-green-100 px-8 py-3 font-bold text-green-700 shadow-md border border-green-200 animate-in fade-in zoom-in-95 duration-300">
                        ✓ Aceptado
                      </span>
                    )}
                    {student.status === "rejected" && (
                      <span className="rounded-xl bg-red-100 px-8 py-3 font-bold text-red-700 shadow-md border border-red-200 animate-in fade-in zoom-in-95 duration-300">
                        ✗ Rechazado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* </CHANGE> */}
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* </CHANGE> */}
    </div>
  )
}
