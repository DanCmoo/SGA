"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

interface PreinscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PreinscriptionModal({ isOpen, onClose }: PreinscriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Form submitted")
    setIsSubmitting(false)
    onClose()
  }
  // </CHANGE>

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-beige-300">
            <div>
              <h2 className="text-3xl font-bold text-navy-700">Modal de preinscripción</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-coral-500 to-transparent rounded-full mt-2"></div>
            </div>
            <button
              onClick={onClose}
              className="text-burgundy-700 hover:text-white hover:bg-burgundy-700 p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>
          {/* </CHANGE> */}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-navy-700 pb-2 border-b-2 border-navy-700">Datos acudiente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Identificación"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-navy-700 pb-2 border-b-2 border-navy-700">Datos estudiante</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Grado a cursar"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Documento de identidad"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl border-2 border-burgundy-700 text-burgundy-700 font-semibold hover:bg-burgundy-700 hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-coral-500 to-burgundy-600 text-white font-semibold hover:from-burgundy-600 hover:to-coral-500 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </div>
            {/* </CHANGE> */}
          </form>
        </div>
      </div>
    </div>
  )
}
