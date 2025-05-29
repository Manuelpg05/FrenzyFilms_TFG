"use client"

import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft, ArrowRight, Star, Plus } from "lucide-react"
import { importarPeliculaDesdeTmdb, searchPeliculasTmdb } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

type TmdbSearchResult = {
    id: number
    title: string
    release_date: string
    poster_path: string
    vote_average: number
    overview: string
}

type BuscadorPeliculasProps = {
    onImportar: (pelicula: any) => void
}

export default function BuscadorPeliculas({ onImportar }: BuscadorPeliculasProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<TmdbSearchResult[]>([])
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchPage, setSearchPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const searchTimeout = useRef<NodeJS.Timeout | null>(null)
    const searchContainerRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

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
        if (searchTimeout.current) clearTimeout(searchTimeout.current)
        searchTimeout.current = setTimeout(() => handleSearch(term, 1), 400)
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
        <div ref={searchContainerRef} className="relative mb-8 max-w-xl mx-auto w-full">
            <div className="flex flex-wrap items-center border border-gray-700 rounded-lg bg-gray-900 overflow-hidden gap-2 p-2">
                <div className="px-2 text-gray-400">
                    <Search className="h-5 w-5" />
                </div>
                <Input
                    type="text"
                    placeholder="Buscar películas en TMDb..."
                    value={searchTerm}
                    onChange={(e) => handleSearchDebounced(e.target.value)}
                    onFocus={() => {
                        if (searchTerm.length >= 2 && searchResults.length > 0) setIsSearchOpen(true)
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
                            <div key={movie.id} className="flex flex-col sm:flex-row items-center justify-between p-3 gap-3 hover:bg-gray-800 border-b border-gray-800 last:border-0">
                                <div className="flex items-center gap-3 w-full">
                                    <img
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "/placeholder.svg"}
                                        alt={movie.title}
                                        className="w-20 h-28 object-cover rounded mx-auto sm:mx-0"
                                    />
                                    <div className="flex-1">
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
                                    className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem("token")
                                            if (!token) throw new Error("No estás autenticado")
                                            const nuevaPelicula = await importarPeliculaDesdeTmdb(movie.id, token)
                                            onImportar(nuevaPelicula)
                                            setIsSearchOpen(false)
                                            toast({ title: "Película importada", description: `"${nuevaPelicula.titulo}" fue importada correctamente.` })
                                        } catch (error: any) {
                                            toast({ title: "Error al importar", description: error.message || "Ocurrió un error al importar la película.", variant: "destructive" })
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
    )
}
