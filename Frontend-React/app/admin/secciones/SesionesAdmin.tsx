"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { BadgeCheck, Calendar as CalendarIcon, Clock, Film, MapPin, Plus, Star, Tag, Ticket } from "lucide-react"
import { getPeliculasCartelera, getSesionesFuturasPorPelicula, getSalaBySesionId, getSalas } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { parse } from "date-fns"
import CreateSessionButton from "@/components/buttons/create-session"
import EditarSesionButton from "@/components/buttons/edit-session"
import DeleteSessionButton from "@/components/buttons/delete-session"
import { useSearchParams } from "next/navigation"



type Pelicula = {
    id: number
    titulo: string
    cartel: string
    banner: string
    genero: string
    fechaEstreno: string
    calificacionTmdb: number
    estado: string
    sesiones: any[]
}

type Sesion = {
    id: number
    fecha: string
    horaInicio: string
    precioEntrada: number
    formato: string
    entradas: any[]
    sala?: { numSala: number }
}

type Sala = {
    id: number
    numSala: number
}

export default function SesionesAdmin() {
    const searchParams = useSearchParams();
    const idPeliculaParam = searchParams.get("idPelicula");
    const [peliculas, setPeliculas] = useState<Pelicula[]>([])
    const [sesiones, setSesiones] = useState<Sesion[]>([])
    const [salas, setSalas] = useState<Sala[]>([])
    const [selectedPelicula, setSelectedPelicula] = useState<Pelicula | null>(null)
    const [searchOpen, setSearchOpen] = useState(false)

    const { toast } = useToast()
    const searchContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataPeliculas = await getPeliculasCartelera();
                setPeliculas(dataPeliculas);

                const token = localStorage.getItem("token");
                if (!token) throw new Error("No estás autenticado");
                const dataSalas = await getSalas(token);
                setSalas(dataSalas);

                if (idPeliculaParam) {
                    const peliSeleccionada = dataPeliculas.find(
                        (p : any) => p.id.toString() === idPeliculaParam
                    );
                    if (peliSeleccionada) {
                        handleSelectPelicula(peliSeleccionada);
                    }
                }
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            }
        };

        fetchData();
    }, [idPeliculaParam]);

    const handleSelectPelicula = async (peli: Pelicula) => {
        try {
            const sesionesData = await getSesionesFuturasPorPelicula(peli.id.toString())

            const sesionesConSala: Sesion[] = await Promise.all(
                sesionesData.map(async (sesion: Sesion) => {
                    try {
                        const sala = await getSalaBySesionId(sesion.id.toString())
                        return { ...sesion, sala }
                    } catch (error) {
                        console.error("Error al obtener sala para sesión:", error)
                        return sesion
                    }
                })
            )

            setSelectedPelicula(peli)
            setSesiones(sesionesConSala)
            setSearchOpen(false)
        } catch (error: any) {
            toast({ title: "Error al obtener sesiones", description: error.message })
            setSesiones([])
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSearchOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-white mb-8">Administrar Sesiones</h1>

            <div ref={searchContainerRef} className="relative mb-8 w-full">
                <Button
                    className="w-full bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 hover:border-red-600 hover:text-red-500 transition-colors"
                    onClick={() => setSearchOpen(!searchOpen)}
                >
                    {selectedPelicula ? `Película seleccionada: ${selectedPelicula.titulo}` : "Selecciona una película"}
                </Button>

                {searchOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        {peliculas.length > 0 ? (
                            peliculas
                                .slice()
                                .sort((a, b) => (b.calificacionTmdb || 0) - (a.calificacionTmdb || 0))
                                .map((peli) => (
                                    <div
                                        key={peli.id}
                                        className="relative p-3 hover:bg-gray-800 border-b border-gray-700 cursor-pointer"
                                        onClick={() => handleSelectPelicula(peli)}
                                        style={{
                                            backgroundImage: peli.banner
                                                ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${peli.banner})`
                                                : undefined,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        <div className="flex items-center gap-3 bg-gray-900/70 rounded p-3">
                                            <img src={peli.cartel || "/placeholder.svg"} alt={peli.titulo} className="w-20 h-28 object-cover rounded" />
                                            <div className="flex-1 text-white text-sm flex flex-col gap-1">
                                                <h3 className="text-base font-medium">{peli.titulo}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Film className="shrink-0 h-4 w-4 text-purple-400" />
                                                    <span>Género: {peli.genero}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BadgeCheck className="shrink-0 h-4 w-4 text-green-600" />
                                                    <span>Estado: {peli.estado}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Star className="shrink-0 h-4 w-4 text-yellow-500" />
                                                    <span>Calificación: {peli.calificacionTmdb?.toFixed(1) || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="shrink-0 h-4 w-4 text-red-600" />
                                                    <span>Sesiones: {peli.sesiones?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="shrink-0 h-4 w-4 text-blue-600" />
                                                    <span>Estreno: {peli.fechaEstreno}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="p-3 text-gray-400 text-center">No hay películas disponibles</div>
                        )}
                    </div>
                )}
            </div>

            {selectedPelicula && (
                <>
                    <div
                        key={selectedPelicula.id}
                        className="rounded-md relative p-3 hover:bg-gray-800 border border-red-600"
                        style={{
                            backgroundImage: selectedPelicula.banner
                                ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${selectedPelicula.banner})`
                                : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="flex items-center gap-3 bg-gray-900/70 rounded p-3">
                            <img src={selectedPelicula.cartel || "/placeholder.svg"} alt={selectedPelicula.titulo} className="w-20 h-28 object-cover rounded" />
                            <div className="flex-1 text-white text-sm flex flex-col gap-1">
                                <h3 className="text-base font-medium">{selectedPelicula.titulo}</h3>
                                <div className="flex items-center gap-2">
                                    <Film className="shrink-0 h-4 w-4 text-purple-400" />
                                    <span>Género: {selectedPelicula.genero}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="shrink-0 h-4 w-4 text-green-600" />
                                    <span>Estado: {selectedPelicula.estado}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="shrink-0 h-4 w-4 text-yellow-500" />
                                    <span>Calificación: {selectedPelicula.calificacionTmdb?.toFixed(1) || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Ticket className="shrink-0 h-4 w-4 text-red-600" />
                                    <span>Sesiones: {selectedPelicula.sesiones?.length || 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="shrink-0 h-4 w-4 text-blue-600" />
                                    <span>Estreno: {selectedPelicula.fechaEstreno}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CreateSessionButton
                        selectedPelicula={selectedPelicula}
                        salas={salas}
                        onSesionCreada={(nuevaSesion) => setSesiones((prev) => [...prev, nuevaSesion])}
                    />


                    <h2 className="text-lg text-white font-semibold mb-2">Sesiones para: {selectedPelicula.titulo}</h2>
                    {sesiones.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {sesiones
                                .slice()
                                .sort((a, b) =>
                                    parse(a.fecha, "dd-MM-yyyy", new Date()).getTime() -
                                    parse(b.fecha, "dd-MM-yyyy", new Date()).getTime()
                                )
                                .map((sesion) => (
                                    <Card key={sesion.id} className="bg-gray-900 border-gray-800 p-4 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-lg font-bold">Sesión ID: {sesion.id}</h2>
                                            <div className="flex gap-2">
                                                <EditarSesionButton
                                                    sesion={sesion}
                                                    onSesionActualizada={(sesionActualizada) =>
                                                        setSesiones((prev) =>
                                                            prev.map((s) => (s.id === sesionActualizada.id ? { ...s, ...sesionActualizada } : s))
                                                        )
                                                    }
                                                />

                                                <DeleteSessionButton
                                                    sesionId={sesion.id}
                                                    sesionLabel={`ID ${sesion.id}`}
                                                    onSesionEliminada={(idEliminado) =>
                                                        setSesiones((prev) => prev.filter((s) => s.id !== idEliminado))
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300 max-w-md">
                                            <div className="flex flex-col gap-2 sm:pr-4 sm:border-r sm:border-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                                                    <span>Fecha: {sesion.fecha}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-yellow-600" />
                                                    <span>Hora: {sesion.horaInicio.slice(0, 5)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-green-600" />
                                                    <span>Formato: {sesion.formato}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 sm:pl-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-orange-900" />
                                                    <span>Sala: {sesion.sala?.numSala || "Desconocida"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Film className="h-4 w-4 text-purple-400" />
                                                    <span>Precio: {sesion.precioEntrada}€</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="h-4 w-4 text-red-600" />
                                                    <span>Entradas vendidas: {sesion.entradas?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center mt-4">No hay sesiones para mostrar.</p>
                    )}
                </>
            )}
        </div>
    )
}
