"use client"

import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { getUserProfile } from "@/lib/api"
import { Roles } from "@/lib/enums"

export default function SiteFooter() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

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

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <img src="/images/frenzy-films-logo.png" alt="FrenzyFilms Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold text-white">FrenzyFilms</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Tu destino cinematográfico preferido, con las mejores películas, la mejor experiencia y el mejor servicio.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Cartelera
                </Link>
              </li>

              {isLoggedIn && user ? (
                <>
                  {!user.isAdmin ? (
                    <>
                      <li>
                        <Link href="/perfil?seccion=entradas" className="text-gray-400 hover:text-white">
                          Mis Entradas
                        </Link>
                      </li>
                      <li>
                        <Link href="/perfil?seccion=historial" className="text-gray-400 hover:text-white">
                          Historial
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/admin?seccion=salas" className="text-gray-400 hover:text-white">
                          Salas
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin?seccion=peliculas" className="text-gray-400 hover:text-white">
                          Películas
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin?seccion=sesiones" className="text-gray-400 hover:text-white">
                          Sesiones
                        </Link>
                      </li>
                    </>
                  )}
                </>
              ) : null}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Información Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="shrink-0 h-4 w-4 mr-2 text-red-600" />
                <span>Av. del Cine 123, Écija</span>
              </li>
              <li className="flex items-center">
                <Phone className="shrink-0 h-4 w-4 mr-2 text-red-600" />
                <span>+34 912 345 678</span>
              </li>
              <li className="flex items-center">
                <Mail className="shrink-0 h-4 w-4 mr-2 text-red-600" />
                <span className="truncate max-w-[200px] sm:max-w-full break-all">
                  noreply.frenzyfilms@gmail.com
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FrenzyFilms. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
