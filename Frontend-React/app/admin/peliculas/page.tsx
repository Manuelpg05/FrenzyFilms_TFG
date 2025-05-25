"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Film, Plus, Clock, Calendar, Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Tipo para las películas
type Movie = {
  id: string
  title: string
  director: string
  genre: string[]
  duration: string
  durationMinutes: number
  releaseDate: string
  rating: number
  poster: string
  backdrop?: string
  description: string
  cast?: {
    id: string
    name: string
    character: string
    photo: string
  }[]
}

// Datos de ejemplo para la búsqueda de películas (simulando una API externa)
const externalMovies: Movie[] = [
  {
    id: "ext-1",
    title: "Megalópolis",
    director: "Francis Ford Coppola",
    genre: ["Drama", "Ciencia ficción"],
    duration: "138 min",
    durationMinutes: 138,
    releaseDate: "2024",
    rating: 4.2,
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    description:
      "En una Nueva York futurista, un arquitecto busca reconstruir la ciudad como una utopía tras una devastadora catástrofe, enfrentándose al alcalde corrupto que prefiere mantener el statu quo.",
    cast: [
      {
        id: "cast-1",
        name: "Adam Driver",
        character: "César Catilina",
        photo: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "cast-2",
        name: "Giancarlo Esposito",
        character: "Alcalde Franklyn Cicero",
        photo: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  {
    id: "ext-2",
    title: "Nosferatu",
    director: "Robert Eggers",
    genre: ["Terror", "Fantasía"],
    duration: "115 min",
    durationMinutes: 115,
    releaseDate: "2024",
    rating: 4.5,
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    description:
      "Remake del clásico de terror de 1922, que narra la obsesión del vampiro Conde Orlok con una mujer joven en la Alemania del siglo XIX, llevando consigo muerte y destrucción.",
    cast: [
      {
        id: "cast-1",
        name: "Bill Skarsgård",
        character: "Conde Orlok",
        photo: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "cast-2",
        name: "Lily-Rose Depp",
        character: "Ellen Hutter",
        photo: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  {
    id: "ext-3",
    title: "Beetlejuice Beetlejuice",
    director: "Tim Burton",
    genre: ["Comedia", "Fantasía"],
    duration: "104 min",
    durationMinutes: 104,
    releaseDate: "2024",
    rating: 4.3,
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    description:
      "Secuela de la película de 1988, donde la familia Deetz regresa a Winter River tras una tragedia familiar, desatando nuevamente al caótico bio-exorcista Beetlejuice cuando accidentalmente abren una puerta al más allá.",
    cast: [
      {
        id: "cast-1",
        name: "Michael Keaton",
        character: "Beetlejuice",
        photo: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "cast-2",
        name: "Winona Ryder",
        character: "Lydia Deetz",
        photo: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  {
    id: "ext-4",
    title: "Venom: The Last Dance",
    director: "Kelly Marcel",
    genre: ["Acción", "Ciencia ficción"],
    duration: "112 min",
    durationMinutes: 112,
    releaseDate: "2024",
    rating: 3.9,
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    description:
      "Tercera entrega de la saga Venom, donde Eddie Brock y el simbionte alienígena se enfrentan a su desafío final mientras son perseguidos por las autoridades y nuevas amenazas extraterrestres.",
    cast: [
      {
        id: "cast-1",
        name: "Tom Hardy",
        character: "Eddie Brock / Venom",
        photo: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "cast-2",
        name: "Juno Temple",
        character: "Dra. Payne",
        photo: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
  {
    id: "ext-5",
    title: "Kraven el Cazador",
    director: "J.C. Chandor",
    genre: ["Acción", "Aventura"],
    duration: "120 min",
    durationMinutes: 120,
    releaseDate: "2024",
    rating: 3.8,
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    description:
      "Origen del villano de Spider-Man, Sergei Kravinoff, un cazador obsesionado con demostrar que es el mayor depredador del mundo, cuya búsqueda lo lleva a un camino de venganza y autodescubrimiento.",
    cast: [
      {
        id: "cast-1",
        name: "Aaron Taylor-Johnson",
        character: "Sergei Kravinoff / Kraven",
        photo: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "cast-2",
        name: "Russell Crowe",
        character: "Nikolai Kravinoff",
        photo: "/placeholder.svg?height=300&width=300",
      },
    ],
  },
]

export default function AdminMoviesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Comprobar si el usuario es administrador
    const storedUser = localStorage.getItem("cinema-user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.isAdmin) {
        setIsAdmin(true)
      } else {
        // Redirigir si no es administrador
        router.push("/")
      }
    } else {
      // Redirigir si no hay usuario
      router.push("/login")
    }
  }, [router])

  // Función para buscar películas
  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (term.length < 2) {
      setSearchResults([])
      setIsSearchOpen(false)
      return
    }

    // Filtrar películas que coincidan con el término de búsqueda
    const results = externalMovies.filter((movie) => movie.title.toLowerCase().includes(term.toLowerCase()))

    setSearchResults(results)
    setIsSearchOpen(results.length > 0)
  }

  // Función para seleccionar una película
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie)
    setSearchTerm(movie.title)
    setIsSearchOpen(false)
  }

  // Función para importar la película
  const handleImportMovie = () => {
    if (!selectedMovie) return

    // Aquí se enviaría la información a la base de datos
    // Simulamos el proceso con un toast
    toast({
      title: "Película importada",
      description: `"${selectedMovie.title}" ha sido añadida a la cartelera.`,
    })

    // Redirigir a la página de la película
    setTimeout(() => {
      router.push(`/pelicula/${selectedMovie.id}`)
    }, 1500)
  }

  if (!isAdmin) {
    return null // No mostrar nada mientras se verifica o redirige
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Gestión de Películas</h1>

        {/* Barra de búsqueda */}
        <div className="relative mb-8">
          <div className="flex items-center border border-gray-700 rounded-lg bg-gray-900 overflow-hidden">
            <div className="px-3 py-2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Buscar películas para añadir a la cartelera..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-white"
            />
          </div>

          {/* Resultados de búsqueda */}
          {isSearchOpen && (
            <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0"
                    onClick={() => handleSelectMovie(movie)}
                  >
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded mr-3"
                    />
                    <div>
                      <h3 className="text-white font-medium">{movie.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {movie.director} • {movie.releaseDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-400 text-center">No se encontraron resultados</div>
              )}
            </div>
          )}
        </div>

        {/* Detalles de la película seleccionada */}
        {selectedMovie ? (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Póster */}
                <div className="w-full md:w-1/4 flex-shrink-0">
                  <img
                    src={selectedMovie.poster || "/placeholder.svg"}
                    alt={selectedMovie.title}
                    className="w-full h-auto object-cover rounded-lg border border-gray-800"
                  />
                </div>

                {/* Detalles */}
                <div className="w-full md:w-3/4">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedMovie.title}</h2>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="relative flex items-center justify-center">
                      <Star className="h-12 w-12 fill-yellow-500 text-yellow-500 drop-shadow-md" />
                      <span className="absolute text-black font-bold text-sm">{selectedMovie.rating}</span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{selectedMovie.duration}</span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{selectedMovie.releaseDate}</span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Film className="h-4 w-4 mr-1" />
                      <span>Dir. {selectedMovie.director}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMovie.genre.map((g) => (
                      <Badge key={g} className="bg-red-600 text-white">
                        {g}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">Sinopsis</h3>
                    <p className="text-gray-300">{selectedMovie.description}</p>
                  </div>

                  {/* Reparto */}
                  {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Reparto principal</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedMovie.cast.slice(0, 4).map((actor) => (
                          <div key={actor.id} className="flex items-center gap-2">
                            <img
                              src={actor.photo || "/placeholder.svg"}
                              alt={actor.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-white text-sm">{actor.name}</p>
                              <p className="text-gray-400 text-xs">{actor.character}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón para importar */}
              <div className="mt-6 flex justify-end">
                <Button onClick={handleImportMovie} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Importar a cartelera
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Busca una película para añadir</h2>
            <p className="text-gray-400 mb-4">
              Utiliza la barra de búsqueda para encontrar películas y añadirlas a la cartelera.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
