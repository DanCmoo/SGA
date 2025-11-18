"use client"

import { FileQuestion, Users, FolderOpen } from "lucide-react"

interface EmptyStateProps {
  icon?: "file" | "users" | "folder"
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon = "file", title, description, action }: EmptyStateProps) {
  const icons = {
    file: <FileQuestion className="h-16 w-16" />,
    users: <Users className="h-16 w-16" />,
    folder: <FolderOpen className="h-16 w-16" />,
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-beige-400 mb-4">{icons[icon]}</div>
      <h3 className="text-2xl font-bold text-navy-700 mb-2">{title}</h3>
      <p className="text-brown-600 text-center mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-gradient-to-r from-coral-500 to-coral-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 transition-all duration-300 hover:scale-105"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
