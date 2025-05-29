"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, Calendar, Clock, User, Tag, ArrowLeft, ArrowRight, Plus, Star } from "lucide-react"
import { getPeliculas, importarPeliculaDesdeTmdb, searchPeliculasTmdb } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

type Pelicula = {
    id: number
    titulo: string
    clasificacionEdad: string
    fechaEstreno: string
    duracion: number
    genero: string
    director: string
    actores: string
    sinopsis: string
    cartel: string
    calificacionTmdb: number
    estado: string
}

type TmdbSearchResult = {
    id: number
    title: string
    release_date: string
    poster_path: string
    vote_average: number
    overview: string
}

export default function PeliculasAdmin() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([])
    const [nuevasImportaciones, setNuevasImportaciones] = useState<Pelicula[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<TmdbSearchResult[]>([])
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchPage, setSearchPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const searchTimeout = useRef<NodeJS.Timeout | null>(null)
    const searchContainerRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")
                if (!token) throw new Error("No estás autenticado")

                const data: Pelicula[] = await getPeliculas(token)
                setPeliculas(data)
            } catch (error: any) {
                toast({ title: "Error", description: error.message })
            } finally {
                setLoading(false)
            }
        }

        fetchPeliculas()
    }, [])

    const handleSearch = async (term: string, page: number = 1) => {
        setSearchTerm(term)

        if (term.length < 2) {
            setSearchResults([])
            setIsSearchOpen(false)
            return
        }

        try {
            const data = await searchPeliculasTmdb(term, page)

            setSearchResults(data.results || [])
            setTotalPages(data.total_pages || 1)
            setIsSearchOpen((data.results || []).length > 0)
        } catch (error: any) {
            toast({ title: "Error al buscar", description: error.message })
        }
    }

    const handleSearchDebounced = (term: string) => {
        setSearchTerm(term)
        setSearchPage(1)

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current)
        }

        searchTimeout.current = setTimeout(() => {
            handleSearch(term, 1)
        }, 400)
    }

    const handleChangePage = (delta: number) => {
        const newPage = Math.max(1, searchPage + delta)
        setSearchPage(newPage)
        handleSearch(searchTerm, newPage)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            <div ref={searchContainerRef} className="relative mb-8 max-w-xl mx-auto w-full">
                <div className="flex items-center border border-gray-700 rounded-lg bg-gray-900 overflow-hidden">
                    <div className="px-3 py-2 text-gray-400">
                        <Search className="h-5 w-5" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Buscar películas en TMDb..."
                        value={searchTerm}
                        onChange={(e) => handleSearchDebounced(e.target.value)}
                        onFocus={() => {
                            if (searchTerm.length >= 2 && searchResults.length > 0) {
                                setIsSearchOpen(true)
                            }
                        }}
                        className="flex-1 bg-transparent border-0 focus-visible:ring-5 text-white"
                    />
                </div>

                {isSearchOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        <div className="flex justify-between items-center p-2 border-b border-gray-700">
                            <Button size="icon" variant="ghost" onClick={() => handleChangePage(-1)} disabled={searchPage <= 1}>
                                <ArrowLeft className="h-4 w-4 text-white" />
                            </Button>
                            <span className="text-white text-sm">Página {searchPage} / {totalPages}</span>
                            <Button size="icon" variant="ghost" onClick={() => handleChangePage(1)} disabled={searchPage >= totalPages}>
                                <ArrowRight className="h-4 w-4 text-white" />
                            </Button>
                        </div>

                        {searchResults.length > 0 ? (
                            searchResults.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 border-b border-gray-800 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "/placeholder.svg"}
                                            alt={movie.title}
                                            className="w-12 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="text-white font-medium">{movie.title}</h3>
                                            <p className="text-gray-400 text-sm flex items-center">
                                                {movie.release_date}
                                                <span className="flex items-center ml-2">
                                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                    {movie.vote_average.toFixed(1)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        onClick={async () => {
                                            try {
                                                const token = localStorage.getItem("token")
                                                if (!token) throw new Error("No estás autenticado")

                                                const nuevaPelicula: Pelicula = await importarPeliculaDesdeTmdb(movie.id, token)
                                                setNuevasImportaciones((prev) => [nuevaPelicula, ...prev])
                                                setIsSearchOpen(false)

                                                toast({
                                                    title: "Película importada",
                                                    description: `"${nuevaPelicula.titulo}" fue importada correctamente.`,
                                                })
                                            } catch (error: any) {
                                                toast({
                                                    title: "Error al importar",
                                                    description: error.message || "Ocurrió un error al importar la película.",
                                                    variant: "destructive",
                                                })
                                            }
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Importar
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-400 text-center">No se encontraron resultados</div>
                        )}
                    </div>
                )}
            </div>

            {nuevasImportaciones.length > 0 && (
                <div className="flex flex-col items-center space-y-6 w-full max-w-xl mx-auto mb-8">
                    <h2 className="text-xl font-bold text-white">Películas recien importadas</h2>
                    {nuevasImportaciones.map((pelicula) => (
                        <Card
                            key={pelicula.id}
                            className="bg-gray-900 border-gray-800 w-full max-w-xl mx-auto p-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={pelicula.cartel}
                                        alt={pelicula.titulo}
                                        className="w-24 h-36 object-cover rounded"
                                    />
                                </div>

                                <div className="h-36 w-px bg-gray-700" />

                                <div className="flex-1 flex flex-col justify-between text-gray-300 text-sm">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{pelicula.titulo}</h2>
                                        <p className="text-gray-400 text-xs mb-2">{pelicula.genero} · {pelicula.clasificacionEdad}</p>

                                        <div className="flex items-center mb-1">
                                            <Calendar className="h-4 w-4 mr-2 text-red-600" />
                                            <span>Estreno: {new Date(pelicula.fechaEstreno).toLocaleDateString("es-ES")}</span>
                                        </div>
                                        <div className="flex items-center mb-1">
                                            <Clock className="h-4 w-4 mr-2 text-red-600" />
                                            <span>Duración: {pelicula.duracion} min</span>
                                        </div>
                                        <div className="flex items-center mb-1">
                                            <User className="h-4 w-4 mr-2 text-red-600" />
                                            <span>Director: {pelicula.director}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Tag className="h-4 w-4 mr-2 text-red-600" />
                                            <span>Calificación: {pelicula.calificacionTmdb.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-2 border-t border-gray-800 mt-2 gap-2">
                                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                            Editar
                                        </Button>
                                        <Button size="sm" variant="destructive">
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <hr className="w-full border-t border-red-600" />
                </div>
            )}

            {/* Listado de películas actuales */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin h-10 w-10 text-red-600" />
                </div>
            ) : peliculas.length > 0 ? (
                <div className="flex flex-col items-center space-y-6">
                    {peliculas.map((pelicula) => (
                        <Card
                            key={pelicula.id}
                            className="bg-gray-900 border-gray-800 w-full max-w-xl mx-auto p-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={pelicula.cartel}
                                        alt={pelicula.titulo}
                                        className="w-24 h-36 object-cover rounded"
                                    />
                                </div>

                                <div className="h-36 w-px bg-gray-700" />

                                <div className="flex-1 flex flex-col justify-between text-gray-300 text-sm">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{pelicula.titulo}</h2>
                                        <p className="text-gray-400 text-xs mb-2">{pelicula.genero} · {pelicula.clasificacionEdad}</p>

                                        <div className="flex items-center mb-1">
                                            <Calendar className="h-4 w-4 mr-2 text-red-600" />
                                            <span>Estreno: {new Date(pelicula.fechaEstreno).toLocaleDateString("es-ES")}</span>
                                        </div>
                                        <div className="flex items-center mb-1">
                                            <Clock className="h-4 w-4 mr-2 text-red-600" />
                                            <span>Duración: {pelicula.duracion} min</span>
                                        </div>
                                        <div className="flex items-center mb-1">
                                            <User className="h-4 w-4 mr-2 text-red-600" />
                                            <span>Director: {pelicula.director}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Tag className="h-4 w-4 mr-2 text-red-600" />
                                            <span>Calificación: {pelicula.calificacionTmdb.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-2 border-t border-gray-800 mt-2 gap-2">
                                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                            Editar
                                        </Button>
                                        <Button size="sm" variant="destructive">
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-xl text-gray-400 mb-4">No hay películas disponibles</h3>
                </div>
            )}
        </>
    )
}
