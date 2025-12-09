"use client"

import { useState } from "react"
import Link from "next/link"
import { PreinscriptionModal } from "./preinscription-modal"

export function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b-4 border-navy-600 shadow-lg shadow-navy-600/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-navy-600 to-brown-600 flex items-center justify-center rounded-xl shadow-md shadow-navy-600/30 transform hover:scale-105 transition-transform duration-300">
              <svg className="w-9 h-9 text-coral-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-navy-700 tracking-tight">FIS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-navy-600 text-navy-700 font-semibold rounded-xl hover:bg-navy-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-navy-600/20 transform hover:scale-105"
            >
              Login
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-coral-500 to-burgundy-600 text-white font-semibold rounded-xl hover:from-burgundy-600 hover:to-coral-500 transition-all duration-300 shadow-md shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 transform hover:scale-105"
            >
              Preinscríbete
            </button>
          </div>
        </div>
      </nav>
      {/* </CHANGE> */}
      <PreinscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
