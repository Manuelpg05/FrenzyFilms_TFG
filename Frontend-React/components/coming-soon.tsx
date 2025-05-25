"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

// Datos de ejemplo para próximos estrenos
const upcomingMovies = [
  {
    id: "101",
    title: "Avatar 3",
    releaseDate: "20 Dic 2024",
    poster: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "102",
    title: "Guardianes de la Galaxia Vol. 4",
    releaseDate: "5 May 2025",
    poster: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "103",
    title: "John Wick 5",
    releaseDate: "23 Mar 2025",
    poster: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "104",
    title: "Jurassic World 4",
    releaseDate: "7 Jul 2025",
    poster: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "105",
    title: "Fast & Furious 11",
    releaseDate: "2 Abr 2025",
    poster: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "106",
    title: "Black Panther 3",
    releaseDate: "11 Nov 2025",
    poster: "/placeholder.svg?height=600&width=400",
  },
]

export default function ComingSoon() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollButtons)
      // Verificar inicialmente
      checkScrollButtons()
      return () => scrollElement.removeEventListener("scroll", checkScrollButtons)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
              Próximos Estrenos
            </span>
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {upcomingMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[220px] bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-red-600/20 hover:shadow-xl"
            >
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-[300px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
