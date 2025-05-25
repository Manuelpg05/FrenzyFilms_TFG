"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Clock, Calendar, Star, Film } from "lucide-react"
import Link from "next/link"
import ActorCard from "@/components/actor-card"
import { useState, useEffect } from "react"

// Datos de ejemplo para la película
const movieDetails = {
  id: "1",
  title: "Dune: Parte Dos",
  director: "Denis Villeneuve",
  genre: ["Ciencia ficción", "Aventura"],
  duration: "166 min",
  releaseDate: "2024",
  rating: 4.7,
  poster: "/placeholder.svg?height=600&width=400",
  backdrop: "/placeholder.svg?height=1080&width=1920",
  description:
    "Paul Atreides se une a los Fremen y comienza un viaje espiritual y político para convertirse en Muad'Dib, mientras busca venganza contra los conspiradores que destruyeron a su familia. Enfrentando una elección entre el amor de su vida y el destino del universo conocido, se esfuerza por evitar un futuro terrible que solo él puede prever.",
  cast: [
    {
      id: "1",
      name: "Timothée Chalamet",
      character: "Paul Atreides",
      photo: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "2",
      name: "Zendaya",
      character: "Chani",
      photo: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "3",
      name: "Rebecca Ferguson",
      character: "Lady Jessica",
      photo: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "4",
      name: "Javier Bardem",
      character: "Stilgar",
      photo: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "5",
      name: "Josh Brolin",
      character: "Gurney Halleck",
      photo: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "6",
      name: "Austin Butler",
      character: "Feyd-Rautha Harkonnen",
      photo: "/placeholder.svg?height=300&width=300",
    },
  ],
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Comprobar si el usuario es administrador
    const storedUser = localStorage.getItem("cinema-user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setIsAdmin(user.isAdmin === true)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black">
      {/* Hero con imagen de fondo */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movieDetails.backdrop})`, opacity: 0.4 }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 relative -mt-40 md:-mt-60 z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Póster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="rounded-lg overflow-hidden border-2 border-red-800 shadow-lg shadow-red-900/30">
              <img
                src={movieDetails.poster || "/placeholder.svg"}
                alt={movieDetails.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Detalles */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{movieDetails.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="relative flex items-center justify-center">
                <Star className="h-12 w-12 fill-yellow-500 text-yellow-500 drop-shadow-md" />
                <span className="absolute text-black font-bold text-sm">{movieDetails.rating}</span>
              </div>

              <div className="flex items-center text-gray-300">
                <Clock className="h-4 w-4 mr-1" />
                <span>{movieDetails.duration}</span>
              </div>

              <div className="flex items-center text-gray-300">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{movieDetails.releaseDate}</span>
              </div>

              <div className="flex items-center text-gray-300">
                <Film className="h-4 w-4 mr-1" />
                <span>Dir. {movieDetails.director}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movieDetails.genre.map((g) => (
                <Badge key={g} className="bg-red-600 text-white">
                  {g}
                </Badge>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Sinopsis</h2>
              <p className="text-gray-300 leading-relaxed">{movieDetails.description}</p>
            </div>

            {isAdmin ? (
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/admin/pelicula/${params.id}/sesiones`}>
                  Ver Sesiones
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href={`/pelicula/${params.id}/sesiones`}>
                  Comprar Entradas
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Reparto */}
        <div className="mt-16 mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Reparto Principal</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movieDetails.cast.slice(0, 10).map((actor) => (
              <ActorCard key={actor.id} actor={actor} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
