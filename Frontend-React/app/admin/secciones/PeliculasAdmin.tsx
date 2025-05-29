
"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Calendar, Clock, User, Tag } from "lucide-react"
import { getPeliculas } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import EditarEstado from "@/components/buttons/change-movie-state"
import EliminarPelicula from "@/components/buttons/delete-movie"
import BuscadorPeliculas from "@/components/movie-search-bar"

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

export default function PeliculasAdmin() {
    const [peliculas, setPeliculas] = useState<Pelicula[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")
                if (!token) throw new Error("No estás autenticado")
                const data = await getPeliculas(token)
                setPeliculas(data)
            } catch (error: any) {
                toast({ title: "Error", description: error.message })
            } finally {
                setLoading(false)
            }
        }

        fetchPeliculas()
    }, [])

    return (
        <>
            <h1 className="text-3xl font-bold text-center text-white mb-8">Administrar Películas</h1>

            <BuscadorPeliculas onImportar={(pelicula) => {
                setPeliculas((prev) => [pelicula, ...prev])
            }} />

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin h-10 w-10 text-red-600" />
                </div>
            ) : peliculas.length > 0 ? (
                <div className="flex flex-col items-center space-y-6">
                    {peliculas.slice().sort((a, b) => b.id - a.id).map((pelicula) => (
                        <PeliculaCard key={pelicula.id} pelicula={pelicula} setPeliculas={setPeliculas} />
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

function PeliculaCard({ pelicula, setPeliculas }: any) {
    return (
        <Card className="bg-gray-900 border-gray-800 w-full max-w-xl mx-auto p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0 flex justify-center">
                    <img src={pelicula.cartel} alt={pelicula.titulo} className="w-32 h-48 object-cover rounded" />
                </div>

                <div className="sm:h-48 sm:w-px bg-gray-700 hidden sm:block" />

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

                    <div className="flex flex-wrap items-center justify-end pt-2 border-t border-gray-800 mt-2 gap-2">
                        <EditarEstado
                            id={pelicula.id}
                            estadoActual={pelicula.estado}
                            onUpdate={(nuevoEstado) => {
                                setPeliculas((prev: any) =>
                                    prev.map((p: any) => p.id === pelicula.id ? { ...p, estado: nuevoEstado } : p))
                            }}
                        />
                        <EliminarPelicula
                            id={pelicula.id}
                            titulo={pelicula.titulo}
                            onDelete={() => {
                                setPeliculas((prev: any) => prev.filter((p: any) => p.id !== pelicula.id))
                            }}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}
