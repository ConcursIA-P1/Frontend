"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Home, MessageSquare, Target, TrendingUp, User, LogOut, Users } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export function StudentNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loadFromStorage, logout } = useAuth()

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navItems = [
    { href: "/aluno", icon: Home, label: "Início" },
    { href: "/aluno/turmas", icon: Users, label: "Turmas" },
    { href: "/aluno/assistente", icon: MessageSquare, label: "Assistente IA" },
    { href: "/aluno/simulados", icon: Target, label: "Simulados" },
    { href: "/aluno/desempenho", icon: TrendingUp, label: "Desempenho" },
  ]

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <Link href="/aluno" className="flex items-center gap-2">
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user && (
            <DropdownMenuItem disabled>
              <span className="text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground ml-1">({user.email})</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}