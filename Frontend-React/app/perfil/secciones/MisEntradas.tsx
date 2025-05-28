"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, Clock, Film, MapPin, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { getEntradasUsuarioDetallado, deleteEntrada } from "@/lib/api"
import { useRouter } from "next/navigation"

type EntradaDetallada = {
  idEntrada: number
  numFila: number
  numAsiento: number
  idSesion: number
  fecha: string
  horaInicio: string
  precioEntrada: number
  formato: string
  numSala: number
  tituloPelicula: string
  cartelPelicula: string
}

export default function Entradas({ modo = "futuras" }: { modo?: "futuras" | "historial" }) {
  const [entradas, setEntradas] = useState<EntradaDetallada[]>([])
  const [loading, setLoading] = useState(true)
  const [posterCache, setPosterCache] = useState<Map<string, string>>(new Map())
  const [ticketToDelete, setTicketToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
          toast({ title: "Debes iniciar sesión para ver tus entradas" })
          router.push("/login")
          return
        }

        const data: EntradaDetallada[] = await getEntradasUsuarioDetallado(token)

        let entradasFiltradas = data
        const ahora = new Date()

        if (modo === "futuras") {
          entradasFiltradas = data.filter((entrada) => {
            const fechaHoraSesion = new Date(`${entrada.fecha}T${entrada.horaInicio}`)
            return fechaHoraSesion > ahora
          })
        }

        entradasFiltradas.sort((a, b) => {
          const fechaHoraA = new Date(`${a.fecha}T${a.horaInicio}`).getTime()
          const fechaHoraB = new Date(`${b.fecha}T${b.horaInicio}`).getTime()
          return fechaHoraA - fechaHoraB
        })

        const cache = new Map<string, string>()
        entradasFiltradas.forEach((entrada) => {
          if (!cache.has(entrada.tituloPelicula)) {
            cache.set(entrada.tituloPelicula, entrada.cartelPelicula)
          }
        })

        setPosterCache(cache)
        setEntradas(entradasFiltradas)
      } catch (error: any) {
        toast({
          title: "Error al cargar entradas",
          description: error.message,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [modo])

  const getPosterForMovie = (tituloPelicula: string) => {
    return posterCache.get(tituloPelicula) || ""
  }

  const handleDeleteClick = (entradaId: number) => {
    const entrada = entradas.find((e) => e.idEntrada === entradaId)
    if (!entrada) return

    const ahora = new Date()
    const fechaHoraSesion = new Date(`${entrada.fecha}T${entrada.horaInicio}`)
    const tiempoRestante = (fechaHoraSesion.getTime() - ahora.getTime()) / (1000 * 60)

    if (tiempoRestante < 60) {
      toast({
        title: "No se puede cancelar",
        description: "No se puede eliminar una entrada con menos de 1 hora de antelación.",
      })
      return
    }

    setTicketToDelete(entradaId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (ticketToDelete !== null) {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No estás autenticado")

        await deleteEntrada(ticketToDelete, token)

        setEntradas((prev) => prev.filter((e) => e.idEntrada !== ticketToDelete))

        toast({ title: "Entrada eliminada correctamente" })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
        })
      } finally {
        setIsDeleteDialogOpen(false)
        setTicketToDelete(null)
      }
    }
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-10 w-10 text-red-600" />
        </div>
      ) : entradas.length > 0 ? (
        <div className="flex flex-col items-center space-y-6">
          {entradas.map((entrada) => {
            const ahora = new Date()
            const fechaHoraSesion = new Date(`${entrada.fecha}T${entrada.horaInicio}`)
            const tiempoRestante = (fechaHoraSesion.getTime() - ahora.getTime()) / (1000 * 60)
            const puedeEliminar = tiempoRestante >= 60

            return (
              <Card
                key={entrada.idEntrada}
                className="bg-gray-900 border-gray-800 w-full max-w-xl mx-auto p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={getPosterForMovie(entrada.tituloPelicula)}
                      alt={entrada.tituloPelicula}
                      className="w-24 h-36 object-cover rounded"
                    />
                  </div>

                  <div className="h-36 w-px bg-gray-700" />

                  <div className="flex-1 flex flex-col justify-between text-gray-300 text-sm">
                    <div>
                      <h2 className="text-lg font-bold text-white">{entrada.tituloPelicula}</h2>
                      <p className="text-gray-400 text-xs mb-2">{entrada.formato}</p>

                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 mr-2 text-red-600" />
                        <span>
                          {fechaHoraSesion.toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 mr-2 text-red-600" />
                        <span>
                          {fechaHoraSesion.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mb-1">
                        <MapPin className="h-4 w-4 mr-2 text-red-600" />
                        <span>Sala {entrada.numSala}</span>
                      </div>
                      <div className="flex items-center">
                        <Film className="h-4 w-4 mr-2 text-red-600" />
                        <span>Fila {entrada.numFila}, Asiento {entrada.numAsiento}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800 mt-2">
                      <span className="text-xs text-gray-400">
                        Precio: {entrada.precioEntrada.toFixed(2)}€
                      </span>
                      {puedeEliminar && modo === "futuras" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(entrada.idEntrada)}
                          className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-400 mb-4">No tienes entradas para mostrar</h3>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/">Ver cartelera</Link>
          </Button>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Eliminar entrada</DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar esta entrada? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
