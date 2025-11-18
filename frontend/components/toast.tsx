"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
  }

  const colors = {
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30",
    error: "bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white shadow-lg shadow-burgundy-600/30",
    info: "bg-gradient-to-r from-navy-600 to-navy-700 text-white shadow-lg shadow-navy-600/30",
    warning: "bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-lg shadow-coral-500/30",
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl px-6 py-4 backdrop-blur-sm transition-all duration-300 ${
        colors[type]
      } ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      {icons[type]}
      <p className="font-semibold">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-2 rounded-lg p-1 hover:bg-white/20 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([])

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </>
  )

  return { showToast, ToastContainer }
}
