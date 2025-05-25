"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPeliculasCartelera } from "@/lib/api"
import '@/styles/globals.css';
import { Estado } from "@/lib/estados"
import { StarBurst } from "@/components/ui/StarBurst"

export default function MovieGrid() {
  const [peliculas, setPeliculas] = useState<any[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    getPeliculasCartelera()
      .then((data) => {
        console.log("Películas recibidas:", data)
        const filtradas = data.filter((pelicula: any) => {
          if (pelicula.estado === Estado.PROXIMAMENTE) {
            return pelicula.sesiones && pelicula.sesiones.length > 0
          }
          return true
        })
        setPeliculas(filtradas)
      })
      .catch((error) => console.error(error))

    const storedUser = localStorage.getItem("cinema-user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setIsAdmin(user.isAdmin === true)
    }
  }, [])

  if (peliculas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-lg text-center">
        🎬 No hay películas disponibles en cartelera en este momento.
        <br />
        ¡Vuelve pronto para ver las novedades!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-9">
      {peliculas.map((movie) => (
        <div
          key={movie.id}
          className="bg-gray-900 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-red-600/20 hover:shadow-xl"
          onMouseEnter={() => setHoveredId(movie.id.toString())}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative">
            <img
              src={movie.cartel || "/placeholder.svg"}
              alt={movie.titulo}
              className={`w-full object-contain transition-all duration-300 ${hoveredId === movie.id.toString() ? "filter blur-sm brightness-50" : ""
                }`}
            />

            {hoveredId === movie.id.toString() && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button asChild className={isAdmin ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}>
                  <Link href={`/pelicula/${movie.id}`}>
                    {isAdmin ? (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Ver más
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4 text-white" />
                        Comprar Entradas
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            )}
            <div className="absolute top-1 right-3 transform translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative flex items-center justify-center">
                <Star className="h-14 w-14 fill-yellow-500 text-yellow-500 drop-shadow-md" />
                <span className="absolute text-black font-bold text-sm">
                  {movie.calificacionTmdb ? movie.calificacionTmdb.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
            <div className="absolute top-3 left-3 z-20 -translate-x-1/2 -translate-y-1/2">
              {movie.estado === "ESTRENO" && (
                <StarBurst color="text-red-600" />
              )}
            </div>

          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">{movie.titulo}</h3>
            <p className="text-gray-400 text-sm mb-2">Dir. {movie.director}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {movie.genero?.split(",").map((g: string) => (
                <Badge key={g.trim()} variant="outline" className="text-xs">
                  {g.trim()}
                </Badge>
              ))}
            </div>
            <p className="text-gray-400 text-sm mb-2">
              {movie.duracion > 0 ? `${movie.duracion} min` : "Duración no disponible"}
            </p>
            <p className="text-gray-400 text-xs">Estreno: {movie.fechaEstreno}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
