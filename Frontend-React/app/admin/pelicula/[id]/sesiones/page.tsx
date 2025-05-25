"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Calendar, Clock, Film, MapPin, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Datos de ejemplo para la película
const movieData = {
  id: "1",
  title: "Dune: Parte Dos",
  director: "Denis Villeneuve",
  duration: "166 min",
  poster: "/placeholder.svg?height=600&width=400",
}

// Datos de ejemplo para las sesiones
const initialSessions = [
  {
    id: "1",
    date: "22 Mayo, 2024",
    time: "16:30",
    room: "Sala 1",
    format: "2D",
    capacity: 120,
    availableSeats: 87,
  },
  {
    id: "2",
    date: "22 Mayo, 2024",
    time: "19:45",
    room: "Sala 3",
    format: "3D",
    capacity: 150,
    availableSeats: 102,
  },
  {
    id: "3",
    date: "22 Mayo, 2024",
    time: "22:30",
    room: "Sala 2",
    format: "2D",
    capacity: 130,
    availableSeats: 95,
  },
  {
    id: "4",
    date: "23 Mayo, 2024",
    time: "17:15",
    room: "Sala 1",
    format: "2D",
    capacity: 120,
    availableSeats: 120,
  },
  {
    id: "5",
    date: "23 Mayo, 2024",
    time: "20:30",
    room: "Sala 3",
    format: "IMAX",
    capacity: 150,
    availableSeats: 150,
  },
  {
    id: "6",
    date: "24 Mayo, 2024",
    time: "18:00",
    room: "Sala 2",
    format: "3D",
    capacity: 130,
    availableSeats: 130,
  },
]

export default function AdminSessionsPage({ params }: { params: { id: string } }) {
  const [sessions, setSessions] = useState(initialSessions)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (sessionToDelete) {
      const updatedSessions = sessions.filter((session) => session.id !== sessionToDelete)
      setSessions(updatedSessions)

      toast({
        title: "Sesión eliminada",
        description: "La sesión ha sido eliminada correctamente.",
      })

      setIsDeleteDialogOpen(false)
      setSessionToDelete(null)
    }
  }

  if (!isAdmin) {
    return null // No mostrar nada mientras se verifica o redirige
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Sesiones de {movieData.title}</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/pelicula/${params.id}`}>
              <Film className="mr-2 h-4 w-4" />
              Ver detalles de película
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Información de la película */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="p-4">
                <img
                  src={movieData.poster || "/placeholder.svg"}
                  alt={movieData.title}
                  className="w-full h-auto rounded-md mb-4"
                />
                <h2 className="text-xl font-bold text-white mb-2">{movieData.title}</h2>
                <p className="text-gray-400">Director: {movieData.director}</p>
                <p className="text-gray-400">Duración: {movieData.duration}</p>
                <div className="mt-4">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href={`/admin/pelicula/${params.id}/nueva-sesion`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir nueva sesión
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Lista de sesiones */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h2 className="text-xl font-bold text-white mb-4">Todas las sesiones</h2>

            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <Card key={session.id} className="bg-gray-900 border-gray-800">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded mr-2">{session.format}</div>
                          <h3 className="text-lg font-bold text-white">{session.room}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(session.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{session.room}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                        <div className="text-sm text-gray-400">Capacidad: {session.capacity} butacas</div>
                        <div className="text-sm font-medium text-white">
                          Disponibles: {session.availableSeats} butacas
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No hay sesiones programadas para esta película.</p>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href={`/admin/pelicula/${params.id}/nueva-sesion`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir nueva sesión
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Eliminar sesión</DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer.
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
    </main>
  )
}
