"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { getProximosEstrenos } from "@/lib/api"

export default function ComingSoon() {
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    getProximosEstrenos()
      .then((data) => setUpcomingMovies(data))
      .catch((err) => console.error(err))
  }, [])

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 1)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollButtons)
      checkScrollButtons()
      return () => scrollElement.removeEventListener("scroll", checkScrollButtons)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
  if (scrollRef.current) {
    const { clientWidth } = scrollRef.current
    const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })

    setTimeout(checkScrollButtons, 300)
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

        {upcomingMovies.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-lg text-center">
            🎬 No hay próximos estrenos en este momento.
            <br />
            ¡Vuelve pronto para ver las novedades!
          </div>
        ) : (
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
                  src={movie.cartel || "/placeholder.svg"}
                  alt={movie.titulo}
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie.titulo}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(movie.fechaEstreno).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
