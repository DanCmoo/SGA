"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        href="/"
        className="flex items-center gap-1 text-navy-600 hover:text-navy-800 transition-colors rounded-lg px-2 py-1 hover:bg-navy-100/50"
      >
        <Home className="h-4 w-4" />
        <span className="font-medium">Inicio</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-brown-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-navy-600 hover:text-navy-800 transition-colors rounded-lg px-2 py-1 hover:bg-navy-100/50 font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-brown-600 font-semibold px-2 py-1">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
