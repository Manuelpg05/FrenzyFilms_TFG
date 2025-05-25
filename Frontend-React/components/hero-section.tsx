"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star } from "lucide-react"
import Link from "next/link"

const featuredMovies = [
  {
    id: "1",
    title: "Dune: Parte Dos",
    description:
      "Paul Atreides se une a los Fremen y comienza un viaje espiritual y político para convertirse en Muad'Dib, mientras busca venganza contra los conspiradores que destruyeron a su familia.",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    rating: 4.7,
  },
  {
    id: "2",
    title: "Gladiador II",
    description:
      "La historia del general que se convirtió en esclavo, el esclavo que se convirtió en gladiador y el gladiador que desafió a un imperio continúa en esta épica secuela.",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    rating: 4.5,
  },
  {
    id: "3",
    title: "Furiosa: De la Saga Mad Max",
    description:
      "La historia de origen de la guerrera Furiosa antes de los eventos de Mad Max: Fury Road, cuando fue secuestrada del Lugar Verde de las Muchas Madres.",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    rating: 4.6,
  },
]

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const currentMovie = featuredMovies[currentIndex]

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Fondo con efecto de desenfoque */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${currentMovie.backdrop})`, opacity: 0.6 }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      {/* Contenido */}
      <div className="relative h-full container mx-auto flex flex-col justify-end pb-16 px-4">
        <div className="max-w-3xl mb-8 transition-all duration-500 transform translate-y-0">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{currentMovie.title}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <div className="relative flex items-center justify-center">
                <Star className="h-10 w-10 fill-yellow-500 text-yellow-500 drop-shadow-md" />
                <span className="absolute text-black font-bold text-xs">{currentMovie.rating}</span>
              </div>
              <span className="text-gray-300 ml-2">Estreno destacado</span>
            </div>
          </div>
          <p className="text-gray-300 text-lg mb-6">{currentMovie.description}</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href={`/pelicula/${currentMovie.id}`}>
                Comprar Entradas
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Ver Trailer
            </Button>
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center space-x-2 mt-8">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-red-600" : "w-4 bg-gray-500"
              }`}
              aria-label={`Ver película ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
}
