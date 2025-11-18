"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Users } from "lucide-react"
import Link from "next/link"

interface Group {
  id: string
  name: string
  studentCount: number
}

interface Grade {
  id: string
  name: string
  groups: Group[]
}

const grades: Grade[] = [
  {
    id: "parvulos",
    name: "PARVULOS",
    groups: [
      { id: "parvulos-a", name: "parvulos a", studentCount: 15 },
      { id: "parvulos-b", name: "parvulos b", studentCount: 18 },
      { id: "parvulos-c", name: "parvulos c", studentCount: 16 },
    ],
  },
  {
    id: "caminadores",
    name: "CAMINADORES",
    groups: [
      { id: "caminadores-a", name: "caminadores a", studentCount: 20 },
      { id: "caminadores-b", name: "caminadores b", studentCount: 19 },
      { id: "caminadores-c", name: "caminadores c", studentCount: 21 },
    ],
  },
  {
    id: "pre-jardin",
    name: "PRE-JARDIN",
    groups: [
      { id: "pre-jardin-a", name: "pre-jardin a", studentCount: 22 },
      { id: "pre-jardin-b", name: "pre-jardin b", studentCount: 20 },
      { id: "pre-jardin-c", name: "pre-jardin c", studentCount: 23 },
    ],
  },
]

export default function DirectivoPage() {
  const [expandedGrades, setExpandedGrades] = useState<string[]>([])

  const toggleGrade = (gradeId: string) => {
    setExpandedGrades((prev) => (prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [...prev, gradeId]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
      <div className="mx-auto max-w-5xl p-10">
        <div className="rounded-3xl bg-white/95 backdrop-blur-sm p-12 shadow-[0_20px_60px_-15px_rgba(37,52,64,0.3)] border border-beige-300/50">
          <h1 className="mb-12 text-center text-4xl font-bold text-navy-800 tracking-tight">GRADOS Y GRUPOS</h1>

          <div className="space-y-6">
            {grades.map((grade) => {
              const isExpanded = expandedGrades.includes(grade.id)

              return (
                <div
                  key={grade.id}
                  className="rounded-2xl border-2 border-brown-600 bg-gradient-to-r from-beige-200/40 to-beige-100/30 shadow-[0_4px_20px_-4px_rgba(111,77,56,0.2)] hover:shadow-[0_8px_30px_-4px_rgba(111,77,56,0.3)] transition-all duration-300"
                >
                  <button
                    onClick={() => toggleGrade(grade.id)}
                    className="flex w-full items-center justify-between p-6 text-left transition-all duration-300 hover:bg-beige-200/50 rounded-2xl"
                  >
                    <span className="text-2xl font-bold text-navy-800">{grade.name}</span>
                    <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm transition-transform duration-300 shadow-sm">
                      {isExpanded ? (
                        <ChevronDown className="h-7 w-7 text-navy-700" />
                      ) : (
                        <ChevronRight className="h-7 w-7 text-navy-700" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t-2 border-brown-600 bg-white/60 backdrop-blur-sm p-6 rounded-b-2xl">
                      <div className="space-y-4">
                        {grade.groups.map((group) => (
                          <Link
                            key={group.id}
                            href={`/directivo/grupo/${group.id}`}
                            className="flex items-center justify-between rounded-xl border-2 border-navy-700 bg-white p-5 transition-all duration-300 hover:border-coral-500 hover:bg-coral-50/50 hover:shadow-[0_4px_20px_-4px_rgba(246,120,145,0.3)] transform hover:scale-[1.02]"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-beige-200/50 rounded-lg shadow-sm">
                                <Users className="h-6 w-6 text-brown-700" />
                              </div>
                              <span className="font-bold text-navy-800 text-lg">{group.name}</span>
                            </div>
                            <span className="text-base text-brown-700 font-medium">Citar estudiantes</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
