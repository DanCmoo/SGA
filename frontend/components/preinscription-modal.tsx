"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { api } from "@/lib/api"

interface PreinscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  nombre1Acudiente: string
  nombre2Acudiente: string
  apellido1Acudiente: string
  apellido2Acudiente: string
  cedulaAcudiente: string
  fechaNacimientoAcudiente: string
  telefonoAcudiente: string
  correoAcudiente: string
  nombre1Estudiante: string
  nombre2Estudiante: string
  apellido1Estudiante: string
  apellido2Estudiante: string
  fechaNacimiento: string
  documentoIdentidad: string
  gradoSolicitado: string
}

export function PreinscriptionModal({ isOpen, onClose }: PreinscriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nombre1Acudiente: "",
    nombre2Acudiente: "",
    apellido1Acudiente: "",
    apellido2Acudiente: "",
    cedulaAcudiente: "",
    fechaNacimientoAcudiente: "",
    telefonoAcudiente: "",
    correoAcudiente: "",
    nombre1Estudiante: "",
    nombre2Estudiante: "",
    apellido1Estudiante: "",
    apellido2Estudiante: "",
    fechaNacimiento: "",
    documentoIdentidad: "",
    gradoSolicitado: "",
  })

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.post("/admisiones/preinscripcion", formData)
      alert("Preinscripción enviada exitosamente. Pronto nos comunicaremos contigo.")
      onClose()
      setFormData({
        nombre1Acudiente: "",
        nombre2Acudiente: "",
        apellido1Acudiente: "",
        apellido2Acudiente: "",
        cedulaAcudiente: "",
        fechaNacimientoAcudiente: "",
        telefonoAcudiente: "",
        correoAcudiente: "",
        nombre1Estudiante: "",
        nombre2Estudiante: "",
        apellido1Estudiante: "",
        apellido2Estudiante: "",
        fechaNacimiento: "",
        documentoIdentidad: "",
        gradoSolicitado: "",
      })
    } catch (error) {
      console.error("Error al enviar preinscripción:", error)
      alert("Error al enviar la preinscripción. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
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
                  name="nombre1Acudiente"
                  value={formData.nombre1Acudiente}
                  onChange={handleChange}
                  placeholder="Primer nombre"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="text"
                  name="nombre2Acudiente"
                  value={formData.nombre2Acudiente}
                  onChange={handleChange}
                  placeholder="Segundo nombre (opcional)"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                />
                <input
                  type="text"
                  name="apellido1Acudiente"
                  value={formData.apellido1Acudiente}
                  onChange={handleChange}
                  placeholder="Primer apellido"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="text"
                  name="apellido2Acudiente"
                  value={formData.apellido2Acudiente}
                  onChange={handleChange}
                  placeholder="Segundo apellido (opcional)"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                />
                <input
                  type="text"
                  name="cedulaAcudiente"
                  value={formData.cedulaAcudiente}
                  onChange={handleChange}
                  placeholder="Identificación"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="date"
                  name="fechaNacimientoAcudiente"
                  value={formData.fechaNacimientoAcudiente}
                  onChange={handleChange}
                  placeholder="Fecha de nacimiento"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="tel"
                  name="telefonoAcudiente"
                  value={formData.telefonoAcudiente}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="email"
                  name="correoAcudiente"
                  value={formData.correoAcudiente}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500 md:col-span-2"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-navy-700 pb-2 border-b-2 border-navy-700">Datos estudiante</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nombre1Estudiante"
                  value={formData.nombre1Estudiante}
                  onChange={handleChange}
                  placeholder="Primer nombre"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="text"
                  name="nombre2Estudiante"
                  value={formData.nombre2Estudiante}
                  onChange={handleChange}
                  placeholder="Segundo nombre (opcional)"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                />
                <input
                  type="text"
                  name="apellido1Estudiante"
                  value={formData.apellido1Estudiante}
                  onChange={handleChange}
                  placeholder="Primer apellido"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="text"
                  name="apellido2Estudiante"
                  value={formData.apellido2Estudiante}
                  onChange={handleChange}
                  placeholder="Segundo apellido (opcional)"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                />
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  placeholder="Fecha de nacimiento"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <input
                  type="text"
                  name="documentoIdentidad"
                  value={formData.documentoIdentidad}
                  onChange={handleChange}
                  placeholder="Documento de identidad"
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500"
                  required
                />
                <select
                  name="gradoSolicitado"
                  value={formData.gradoSolicitado}
                  onChange={handleChange}
                  className="border-2 border-beige-300 rounded-xl px-4 py-3 focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all duration-200 hover:border-brown-500 md:col-span-2"
                  required
                >
                  <option value="">Seleccionar grado</option>
                  <option value="PARVULOS">Párvulos</option>
                  <option value="CAMINADORES">Caminadores</option>
                  <option value="PRE-JARDIN">Pre-jardín</option>
                </select>
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
