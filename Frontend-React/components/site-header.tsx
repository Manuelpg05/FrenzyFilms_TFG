"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, UserIcon, LogIn, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

type CinemaUser = {
  id: string
  name: string
  email: string
  avatar?: string
  isAdmin?: boolean
}

export default function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<CinemaUser | null>(null)
  const router = useRouter()
  const { theme } = useTheme()

  // Simular verificación de autenticación
  useEffect(() => {
    // Comprobar si hay un usuario en localStorage (simulación)
    const checkUser = () => {
      const storedUser = localStorage.getItem("cinema-user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
        setIsLoggedIn(true)
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
    }

    // Verificar al cargar el componente
    checkUser()

    // Añadir un event listener para detectar cambios en localStorage
    window.addEventListener("storage", checkUser)

    // Verificar cada segundo (como fallback)
    const interval = setInterval(checkUser, 1000)

    return () => {
      window.removeEventListener("storage", checkUser)
      clearInterval(interval)
    }
  }, [])

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    localStorage.removeItem("cinema-user")
    setUser(null)
    setIsLoggedIn(false)
    router.push("/")

    // Disparar un evento de storage para que otros componentes se enteren
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/frenzy-films-logo.png" alt="FrenzyFilms Logo" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold text-white">FrenzyFilms</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white">
            Cartelera
          </Link>
          <Link href="/promociones" className="text-sm font-medium text-gray-300 hover:text-white">
            Promociones
          </Link>
          <Link href="/cines" className="text-sm font-medium text-gray-300 hover:text-white">
            Nuestros Cines
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-gray-300 hover:text-white">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn && user?.isAdmin && (
            <Button
              onClick={() => router.push("/admin/peliculas")}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600 mr-2"
            >
              <Film className="mr-2 h-4 w-4" />
              Gestionar Películas
            </Button>
          )}
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-gray-300" />
                  )}
                  {user.isAdmin && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1 py-0.5 rounded-md">
                      Admin
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800 text-white">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <div className="flex items-center">
                      <p className="font-medium">{user.name}</p>
                      {user.isAdmin && (
                        <span className="ml-2 bg-blue-600 text-white text-xs px-1 py-0.5 rounded-md">Admin</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-800"
                  onClick={() => router.push("/perfil/entradas")}
                >
                  Mis Entradas
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-800"
                  onClick={() => router.push("/perfil/ajustes")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ajustes</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-800" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} variant="outline" size="sm" className="border-red-600 text-red-600">
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
