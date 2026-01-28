"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Home, FileText, Database, Users, User } from "lucide-react"
import { Button } from "./ui/button"

export function TeacherNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/professor", icon: Home, label: "Início" },
    { href: "/professor/banco-questoes", icon: Database, label: "Banco de Questões" },
    { href: "/professor/criar-prova", icon: FileText, label: "Criar Prova" },
    { href: "/professor/turmas", icon: Users, label: "Turmas" },
  ]

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <Link href="/professor" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">ConcursIA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <Button variant="ghost" size="icon" className="rounded-full">
        <User className="w-5 h-5" />
      </Button>
    </div>
  )
}
