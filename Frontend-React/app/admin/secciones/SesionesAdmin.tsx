"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { BadgeCheck, Calendar as CalendarIcon, Clock, Film, MapPin, Plus, Star, Tag, Ticket } from "lucide-react"
import { getPeliculasCartelera, getSesionesFuturasPorPelicula, getSalaBySesionId, createSesion, getSalas } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Formato } from "@/lib/enums"

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
    const [peliculas, setPeliculas] = useState<Pelicula[]>([])
    const [sesiones, setSesiones] = useState<Sesion[]>([])
    const [salas, setSalas] = useState<Sala[]>([])
    const [selectedPelicula, setSelectedPelicula] = useState<Pelicula | null>(null)
    const [selectedSala, setSelectedSala] = useState<string>("")
    const [searchOpen, setSearchOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const [fecha, setFecha] = useState<Date | undefined>()
    const [hora, setHora] = useState<string>("")
    const [minuto, setMinuto] = useState<string>("")
    const [formato, setFormato] = useState<string>("DIGITAL")
    const [precio, setPrecio] = useState<string>("")

    const { toast } = useToast()
    const searchContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                const data = await getPeliculasCartelera()
                setPeliculas(data)
            } catch (error: any) {
                toast({ title: "Error al obtener películas", description: error.message })
            }
        }

        const fetchSalas = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) throw new Error("No estás autenticado")
                const data = await getSalas(token)
                setSalas(data)
            } catch (error: any) {
                toast({ title: "Error al obtener salas", description: error.message })
            }
        }

        fetchPeliculas()
        fetchSalas()
    }, [])

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

    const handleCrearSesion = async () => {
        if (!fecha || !hora || !minuto || !formato || !precio || !selectedSala) {
            toast({ title: "Completa todos los campos" })
            return
        }

        if (!selectedPelicula) return

        try {
            const idPelicula = selectedPelicula.id.toString()
            const idSala = selectedSala

            const nuevaSesion = {
                fecha: format(fecha, "dd-MM-yyyy"),
                horaInicio: `${hora.padStart(2, "0")}:${minuto.padStart(2, "0")}:00`,
                precioEntrada: parseFloat(precio),
                formato,
            }

            const token = localStorage.getItem("token")
            if (!token) throw new Error("No estás autenticado")

            const creada = await createSesion(nuevaSesion, idPelicula, idSala, token)

            setSesiones((prev) => [...prev, { ...creada, sala: { numSala: parseInt(idSala) }, entradas: [] }])
            setOpenModal(false)
            setFecha(undefined)
            setHora("")
            setMinuto("")
            setFormato("DIGITAL")
            setPrecio("")
            setSelectedSala("")
            toast({ title: "Sesión creada exitosamente" })
        } catch (error: any) {
            toast({ title: "Error al crear sesión", description: error.message, variant: "destructive" })
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
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-center text-white mb-8">Administrar Sesiones</h1>

            <div ref={searchContainerRef} className="relative mb-8 w-full">
                <Button
                    className="w-full bg-gray-900 border border-gray-700 text-white"
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
                                                    <Film className="h-4 w-4 text-purple-400" />
                                                    <span>Género: {peli.genero}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BadgeCheck className="h-4 w-4 text-green-600" />
                                                    <span>Estado: {peli.estado}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-yellow-500" />
                                                    <span>Calificación: {peli.calificacionTmdb?.toFixed(1) || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="h-4 w-4 text-red-600" />
                                                    <span>Sesiones: {peli.sesiones?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-blue-600" />
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
                    <div className="rounded relative p-3 border border-red-600 bg-gray-900/70 backdrop-blur-sm flex items-center gap-3">
                        <img src={selectedPelicula.cartel || "/placeholder.svg"} alt={selectedPelicula.titulo} className="w-20 h-28 object-cover rounded" />
                        <div className="flex-1 text-white text-sm flex flex-col gap-1">
                            <h3 className="text-base font-medium">{selectedPelicula.titulo}</h3>
                            <p>Género: {selectedPelicula.genero}</p>
                            <p>Estado: {selectedPelicula.estado}</p>
                            <p>Calificación: {selectedPelicula.calificacionTmdb?.toFixed(1) || "N/A"}</p>
                            <p>Estreno: {selectedPelicula.fechaEstreno}</p>
                        </div>
                    </div>

                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700 text-white mb-4 mt-4 w-auto flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Crear sesión
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="bg-gray-900 text-white border-gray-700">
                            <DialogHeader>
                                <DialogTitle>Crear sesión</DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-col gap-3">
                                <Label>Selecciona fecha</Label>
                                <Calendar mode="single" selected={fecha} onSelect={setFecha} className="self-center rounded-md border border-gray-700" />

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <Label>Hora</Label>
                                        <Select onValueChange={setHora} value={hora}>
                                            <SelectTrigger className="bg-gray-800">
                                                <SelectValue placeholder="Hora" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <SelectItem key={i} value={i.toString()}>{i.toString().padStart(2, "0")}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <Label>Minuto</Label>
                                        <Select onValueChange={setMinuto} value={minuto}>
                                            <SelectTrigger className="bg-gray-800">
                                                <SelectValue placeholder="Minuto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 60 }, (_, i) => (
                                                    <SelectItem key={i} value={i.toString()}>{i.toString().padStart(2, "0")}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Label>Formato</Label>
                                <Select onValueChange={setFormato} value={formato}>
                                    <SelectTrigger className="bg-gray-800">
                                        <SelectValue placeholder="Selecciona formato" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(Formato).map((f) => (
                                            <SelectItem key={f} value={f}>{f}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Label>Sala</Label>
                                <Select onValueChange={setSelectedSala} value={selectedSala}>
                                    <SelectTrigger className="bg-gray-800">
                                        <SelectValue placeholder="Selecciona sala" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salas.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>Sala {s.numSala}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Label>Precio (€)</Label>
                                <Input type="number" min="0" step="0.5" value={precio} onChange={(e) => setPrecio(e.target.value)} className="bg-gray-800" />
                            </div>

                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button onClick={handleCrearSesion} className="bg-green-600 hover:bg-green-700">Crear sesión</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <h2 className="text-lg text-white font-semibold mb-2">Sesiones para: {selectedPelicula.titulo}</h2>
                    {sesiones.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {sesiones.map((sesion) => (
                                <Card key={sesion.id} className="bg-gray-900 border-gray-800 p-4 text-white">
                                    <h2 className="text-lg font-bold mb-2">Sesión ID: {sesion.id}</h2>
                                    <div className="flex flex-col gap-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                                            <span>Fecha: {sesion.fecha}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-yellow-600" />
                                            <span>Hora: {sesion.horaInicio.slice(0,5)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-green-600" />
                                            <span>Formato: {sesion.formato}</span>
                                        </div>
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
