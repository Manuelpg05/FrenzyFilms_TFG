"use client"

import { useEffect, useState } from "react"
import { getPeliculaById, getUserProfile } from "@/lib/api"
import { Roles } from "@/lib/enums"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Clock, Calendar, Star, Film } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ActorCard from "@/components/actor-card"
import AgeRatingBadge from "@/components/age-rating-badge"
import { cn } from "@/lib/utils"

export default function MovieDetailClient({ peliculaId }: { peliculaId: string }) {
    const [pelicula, setPelicula] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        getPeliculaById(peliculaId)
            .then((data) => setPelicula(data))
            .catch((error) => console.error("Error al obtener película:", error))

        const token = localStorage.getItem("token")
        if (token) {
            getUserProfile(token)
                .then((profile) => setIsAdmin(profile.rol === Roles.ADMIN))
                .catch((error) => {
                    console.error("Error al obtener perfil:", error)
                    setIsAdmin(false)
                })
        }
    }, [peliculaId])

    if (!pelicula) {
        return <div className="text-white text-center mt-20">Cargando película...</div>
    }

    const actores = pelicula.actores ? pelicula.actores.split(", ").slice(0, 10) : []

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <div className="relative h-[50vh] md:h-[70vh]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${pelicula.banner})`, opacity: 0.4 }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 relative flex-1 flex flex-col justify-between -mt-40 md:-mt-60 z-10 pb-16">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                        <div className="rounded-lg overflow-hidden border-2 border-red-800 shadow-lg shadow-red-900/30">
                            <img
                                src={pelicula.cartel || "/placeholder.svg"}
                                alt={pelicula.titulo}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{pelicula.titulo} <AgeRatingBadge rating={pelicula.clasificacionEdad} /></h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="relative flex items-center justify-center">
                                <Star className="h-12 sm:h-14 w-12 sm:w-14 fill-yellow-500 text-yellow-500 drop-shadow-md" />
                                <span className="absolute text-black font-bold text-xs sm:text-sm">
                                    {pelicula.calificacionTmdb ? pelicula.calificacionTmdb.toFixed(1) : "N/A"}
                                </span>
                            </div>

                            <div className="flex items-center text-gray-300">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{pelicula.duracion} min</span>
                            </div>

                            <div className="flex items-center text-gray-300">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{pelicula.fechaEstreno}</span>
                            </div>

                            <div className="flex items-center text-gray-300 gap-2">
                                <Film className="h-4 w-4" />
                                <span>Dir. {pelicula.director}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {pelicula.genero?.split(", ").map((g: string) => (
                                <Badge
                                    key={g}
                                    className="bg-red-600 text-white hover:bg-red-600 cursor-auto"
                                >
                                    {g}
                                </Badge>
                            ))}
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-white mb-2">Sinopsis</h2>
                            <p className="text-gray-300 leading-relaxed">{pelicula.sinopsis}</p>
                        </div>

                        <Button
                            asChild
                            size="lg"
                            className={cn(
                                "text-white",
                                isAdmin ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
                            )}
                        >
                            <Link href={isAdmin ? `/admin?seccion=sesiones&&idPelicula=${pelicula.id}` : `/pelicula/${pelicula.id}/sesiones`}>
                                {isAdmin ? "Crear Sesiones" : "Comprar Entradas"}
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent inline-flex items-center space-x-2">
                            <span>Reparto Principal</span>
                            <img
                                src="/images/frenzy-films-logo.png"
                                alt="FrenzyFilms Logo"
                                className="h-16 w-16 object-contain"
                            />
                        </span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {actores.map((nombre: string, index: number) => (
                            <ActorCard
                                key={index}
                                actor={{
                                    id: String(index),
                                    name: nombre,
                                    character: "Desconocido",
                                    photo: "/placeholder.svg",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
