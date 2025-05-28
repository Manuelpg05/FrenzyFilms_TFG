"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, UserIcon, UserCog, LogIn, LogOut, Settings, Shield, Ticket } from "lucide-react"
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
import { getUserProfile } from "@/lib/api"
import { Roles } from "@/lib/enums"

type CinemaUser = {
  id: string
  name: string
  username: string
  email?: string
  isAdmin?: boolean
}

export default function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<CinemaUser | null>(null)
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const profile = await getUserProfile(token)
          setUser({
            id: profile.id,
            name: profile.nombre || profile.username,
            username: profile.username,
            email: profile.email,
            isAdmin: profile.rol === Roles.ADMIN,
          })
          setIsLoggedIn(true)
        } catch (error) {
          console.error("Error al obtener perfil del usuario:", error)
          setUser(null)
          setIsLoggedIn(false)
        }
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
    }

    fetchUser()
    window.addEventListener("storage", fetchUser)

    return () => {
      window.removeEventListener("storage", fetchUser)
    }
  }, [])

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsLoggedIn(false)

    window.dispatchEvent(new Event("storage"))
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/frenzy-films-logo.png" alt="FrenzyFilms Logo" className="h-14 w-14 object-contain" />
            <span className="text-lg font-bold text-white">FrenzyFilms</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white">
            Cartelera
          </Link>

          {isLoggedIn && user ? (
            <>
              {!user.isAdmin ? (
                <>
                  <Link href="/perfil?seccion=entradas" className="text-sm font-medium text-gray-300 hover:text-white">
                    Mis Entradas
                  </Link>
                  <Link href="/perfil?seccion=historial" className="text-sm font-medium text-gray-300 hover:text-white">
                    Historial
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/admin/pendiente1" className="text-sm font-medium text-gray-300 hover:text-white">
                    Admin Panel 1
                  </Link>
                  <Link href="/admin/pendiente2" className="text-sm font-medium text-gray-300 hover:text-white">
                    Admin Panel 2
                  </Link>
                </>
              )}
            </>
          ) : null}
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  {user.isAdmin ? (
                    <>
                      <UserCog className="h-5 w-5 text-gray-300 outline outline-1 outline-offset-8 outline-white rounded-full" />
                      <Shield className="absolute -top-1 -right-1 h-3.5 w-3.5 text-blue-600 bg-black outline outline-1 outline-offset-0 outline-white rounded-full p-0.5 shadow" />
                    </>
                  ) : (
                    <UserIcon className="h-5 w-5 text-gray-300 outline outline-1 outline-offset-8 outline-white rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800 text-white">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate max-w-[140px]">{user.name}</p>
                      {user.isAdmin && (
                        <span className="bg-blue-600 text-white text-xs px-1 py-0.5 rounded-md whitespace-nowrap">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-800" />
                {!user.isAdmin && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => router.push("/perfil?seccion=entradas")}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      Mis Entradas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => router.push("/perfil?seccion=historial")}
                    >
                      <Film className="mr-2 h-4 w-4" />
                      Historial
                    </DropdownMenuItem>
                  </>
                )}
                {user.isAdmin && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => router.push("/admin/pendiente1")}
                    >
                      <Film className="mr-2 h-4 w-4" />
                      Admin Panel 1
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => router.push("/admin/pendiente2")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel 2
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-800"
                  onClick={() => router.push("/perfil")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
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
