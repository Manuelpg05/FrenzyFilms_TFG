"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Film, DollarSign, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo para la película
const getMovieData = (id: string) => ({
  id,
  title: "Dune: Parte Dos",
  director: "Denis Villeneuve",
  genre: ["Ciencia ficción", "Aventura"],
  duration: "166 min",
  durationMinutes: 166,
  releaseDate: "2024",
  rating: 4.7,
  poster: "/placeholder.svg?height=600&width=400",
})

export default function NewSessionPage({ params }: { params: { id: string } }) {
  const [movieData, setMovieData] = useState(getMovieData(params.id))
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    daysFromNow: "1",
    startTime: "18:00",
    endTime: "",
    price: "9.50",
    room: "1",
    format: "2D",
  })
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

  // Calcular la hora de finalización basada en la hora de inicio y la duración de la película
  useEffect(() => {
    if (formData.startTime) {
      const [hours, minutes] = formData.startTime.split(":").map(Number)
      const startMinutes = hours * 60 + minutes
      const endMinutes = startMinutes + movieData.durationMinutes

      const endHours = Math.floor(endMinutes / 60) % 24
      const endMins = endMinutes % 60

      const formattedEndHours = endHours.toString().padStart(2, "0")
      const formattedEndMins = endMins.toString().padStart(2, "0")

      setFormData((prev) => ({
        ...prev,
        endTime: `${formattedEndHours}:${formattedEndMins}`,
      }))
    }
  }, [formData.startTime, movieData.durationMinutes])

  // Manejar cambios en el formulario
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Calcular la fecha basada en los días a partir de hoy
  const getSessionDate = (daysFromNow: number) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Manejar la creación de la sesión
  const handleCreateSession = () => {
    // Aquí se enviaría la información a la base de datos
    const sessionData = {
      movieId: params.id,
      date: getSessionDate(Number.parseInt(formData.daysFromNow)),
      startTime: formData.startTime,
      endTime: formData.endTime,
      price: Number.parseFloat(formData.price),
      room: `Sala ${formData.room}`,
      format: formData.format,
    }

    console.log("Nueva sesión:", sessionData)

    toast({
      title: "Sesión creada",
      description: `Se ha creado una nueva sesión para ${movieData.title} el ${sessionData.date} a las ${sessionData.startTime}.`,
    })

    // Redirigir a la página de sesiones
    setTimeout(() => {
      router.push(`/admin/pelicula/${params.id}/sesiones`)
    }, 1500)
  }

  if (!isAdmin) {
    return null // No mostrar nada mientras se verifica o redirige
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Nueva Sesión</h1>

        {/* Información de la película */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Póster */}
              <div className="w-full sm:w-1/6 flex-shrink-0">
                <img
                  src={movieData.poster || "/placeholder.svg"}
                  alt={movieData.title}
                  className="w-full h-auto object-cover rounded-lg border border-gray-800"
                />
              </div>

              {/* Detalles */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{movieData.title}</h2>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{movieData.duration}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{movieData.releaseDate}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Film className="h-4 w-4 mr-1" />
                    <span>Dir. {movieData.director}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movieData.genre.map((g) => (
                    <Badge key={g} className="bg-red-600 text-white">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Formulario para crear sesión */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Detalles de la sesión</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha (días a partir de hoy) */}
              <div className="space-y-2">
                <Label htmlFor="daysFromNow" className="text-white">
                  Fecha
                </Label>
                <Select value={formData.daysFromNow} onValueChange={(value) => handleChange("daysFromNow", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Seleccionar fecha" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {[...Array(14)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i === 0 ? "Hoy" : i === 1 ? "Mañana" : getSessionDate(i)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-400 text-sm">
                  {formData.daysFromNow === "0"
                    ? "Hoy"
                    : formData.daysFromNow === "1"
                      ? "Mañana"
                      : getSessionDate(Number.parseInt(formData.daysFromNow))}
                </p>
              </div>

              {/* Sala */}
              <div className="space-y-2">
                <Label htmlFor="room" className="text-white">
                  Sala
                </Label>
                <Select value={formData.room} onValueChange={(value) => handleChange("room", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Seleccionar sala" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="1">Sala 1</SelectItem>
                    <SelectItem value="2">Sala 2</SelectItem>
                    <SelectItem value="3">Sala 3</SelectItem>
                    <SelectItem value="4">Sala 4</SelectItem>
                    <SelectItem value="5">Sala 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hora de inicio */}
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-white">
                  Hora de inicio
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Hora de finalización (calculada automáticamente) */}
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-white">
                  Hora de finalización
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white opacity-70 cursor-not-allowed"
                />
                <p className="text-gray-400 text-sm">Calculada automáticamente según la duración</p>
              </div>

              {/* Formato */}
              <div className="space-y-2">
                <Label htmlFor="format" className="text-white">
                  Formato
                </Label>
                <Select value={formData.format} onValueChange={(value) => handleChange("format", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Seleccionar formato" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="2D">2D</SelectItem>
                    <SelectItem value="3D">3D</SelectItem>
                    <SelectItem value="IMAX">IMAX</SelectItem>
                    <SelectItem value="DBOX">D-BOX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">
                  Precio (€)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.50"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Botón para crear sesión */}
            <div className="mt-8 flex justify-end">
              <Button onClick={handleCreateSession} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Crear Sesión
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
