"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import ProgressBar from "@/components/progress-bar"
import { getSesionesFuturasPorPelicula, getPeliculaById, getUserProfile } from "@/lib/api"
import { Formato } from "@/lib/enums"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/es"

dayjs.extend(customParseFormat)
dayjs.locale("es")

export default function SessionsPageClient({ peliculaId }: { peliculaId: string }) {
  const [sesiones, setSesiones] = useState<any[]>([])
  const [pelicula, setPelicula] = useState<any | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSesion, setSelectedSesion] = useState<any | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      getUserProfile(token)
        .then((profile) => {
          if (profile.rol === "ADMIN") {
            router.push(`/pelicula/${peliculaId}`)
          } else {
            setLoadingAuth(false)
          }
        })
        .catch((err) => {
          console.error("Error al obtener perfil:", err)
          setLoadingAuth(false)
        })
    } else {
      setLoadingAuth(false)
    }
  }, [peliculaId, router])

  useEffect(() => {
    if (!loadingAuth) {
      getSesionesFuturasPorPelicula(peliculaId)
        .then((data) => {
          const ordenadas = data.sort((a: any, b: any) => {
            const dateA = dayjs(`${a.fecha} ${a.horaInicio}`, "DD-MM-YYYY HH:mm:ss")
            const dateB = dayjs(`${b.fecha} ${b.horaInicio}`, "DD-MM-YYYY HH:mm:ss")
            return dateA.diff(dateB)
          })
          setSesiones(ordenadas)
          if (ordenadas.length > 0) {
            setSelectedDate(ordenadas[0].fecha)
          }
        })
        .catch((err) => console.error(err))

      getPeliculaById(peliculaId)
        .then((data) => setPelicula(data))
        .catch((err) => console.error(err))
    }
  }, [peliculaId, loadingAuth])

  const uniqueDates = Array.from(new Set(sesiones.map((s) => s.fecha)))
    .sort((a, b) => dayjs(a, "DD-MM-YYYY").diff(dayjs(b, "DD-MM-YYYY")))
    .slice(0, 7)

  const sesionesPorFecha = (fecha: string) =>
    sesiones
      .filter((s) => s.fecha === fecha)
      .sort((a, b) => dayjs(a.horaInicio, "HH:mm:ss").diff(dayjs(b.horaInicio, "HH:mm:ss")))

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <span className="text-white">Cargando...</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <ProgressBar currentStep={1} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            {pelicula?.titulo || "Cargando..."}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card className="bg-gray-900 overflow-hidden border-2 border-red-600">
              <img
                src={pelicula?.cartel || "/placeholder.svg"}
                alt={pelicula?.titulo || "Película"}
                className="w-full h-auto object-cover"
              />
            </Card>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Selección de fecha */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-red-600" />
                Selecciona una fecha
              </h3>
              {uniqueDates.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {uniqueDates.map((fecha) => {
                    const fechaObj = dayjs(fecha, "DD-MM-YYYY")
                    return (
                      <button
                        key={fecha}
                        onClick={() => setSelectedDate(fecha)}
                        className={`p-3 rounded-md text-center transition-all ${
                          selectedDate === fecha
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <div className="font-bold">{fechaObj.format("dddd")}</div>
                        <div className="text-sm">{fechaObj.format("DD MMMM YYYY")}</div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-400 mt-4">
                  🎬 No hay fechas disponibles para esta película.
                </div>
              )}
            </div>

            {/* Selección de horario */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-red-600" />
                Selecciona un horario
              </h3>
              {sesionesPorFecha(selectedDate || "").length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {sesionesPorFecha(selectedDate || "").map((sesion) => (
                    <button
                      key={sesion.id}
                      onClick={() => setSelectedSesion(sesion)}
                      className={`p-3 rounded-md text-center transition-all ${
                        selectedSesion?.id === sesion.id
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <div className="font-bold">{sesion.horaInicio.slice(0, 5)}</div>
                      <div className="text-xs bg-gray-700 rounded px-2 py-0.5 inline-block mt-1">
                        {Formato[sesion.formato as keyof typeof Formato]}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 mt-4">
                  🎬 No hay horarios disponibles para esta fecha.
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <Button asChild size="lg" className="bg-gray-700 hover:bg-gray-600 text-white">
                <Link href={`/pelicula/${peliculaId}`}>
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Volver
                </Link>
              </Button>

              <Button
                asChild={!!(selectedDate && selectedSesion)}
                disabled={!selectedDate || !selectedSesion}
                size="lg"
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white"
              >
                {selectedDate && selectedSesion ? (
                  <Link href={`/pelicula/${peliculaId}/butacas?sesion=${selectedSesion.id}`}>
                    Continuar
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <span>
                    Continuar
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
