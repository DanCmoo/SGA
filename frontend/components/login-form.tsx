"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Lock, User } from "lucide-react"
import { FirstTimeModal } from "./first-time-modal"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { username, password })
    const isFirstTime = true
    if (isFirstTime) {
      setShowFirstTimeModal(true)
    }
  }

  return (
    <>
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-navy-500/20 overflow-hidden border border-beige-200/50">
          <div className="bg-gradient-to-br from-navy-600 via-navy-700 to-brown-600 p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-beige-400 to-coral-500 rounded-2xl mb-6 shadow-xl shadow-coral-500/30 transform hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-navy-800" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Sistema Escolar</h1>
            <p className="text-beige-200 text-base font-medium">Gestión Académica</p>
          </div>
          <div className="p-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-navy-700 mb-3">Bienvenido</h2>
              <p className="text-brown-600 text-base">Ingresa tus credenciales para continuar</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold text-navy-700">
                  Usuario
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-500 transition-colors group-focus-within:text-navy-600" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-14 border-2 border-beige-300 rounded-xl focus-visible:border-navy-500 focus-visible:ring-4 focus-visible:ring-navy-500/10 transition-all duration-300 bg-white hover:border-brown-400 shadow-sm shadow-beige-200/50"
                    placeholder="Ingresa tu usuario"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-navy-700">
                  Contraseña
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-500 transition-colors group-focus-within:text-navy-600" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-14 border-2 border-beige-300 rounded-xl focus-visible:border-navy-500 focus-visible:ring-4 focus-visible:ring-navy-500/10 transition-all duration-300 bg-white hover:border-brown-400 shadow-sm shadow-beige-200/50"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-coral-500 to-burgundy-600 hover:from-burgundy-600 hover:to-coral-500 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-8"
              >
                Ingresar
              </Button>
            </form>
          </div>
        </div>
        {/* </CHANGE> */}
      </div>
      <FirstTimeModal isOpen={showFirstTimeModal} onClose={() => setShowFirstTimeModal(false)} />
    </>
  )
}
