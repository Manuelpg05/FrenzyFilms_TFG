"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import ProgressBar from "@/components/progress-bar"

// Datos de ejemplo para las sesiones
const sessions = {
  movie: {
    id: "1",
    title: "Dune: Parte Dos",
    poster: "/placeholder.svg?height=600&width=400",
  },
  dates: [
    { id: "1", date: "22 Mayo, 2024", day: "Miércoles" },
    { id: "2", date: "23 Mayo, 2024", day: "Jueves" },
    { id: "3", date: "24 Mayo, 2024", day: "Viernes" },
    { id: "4", date: "25 Mayo, 2024", day: "Sábado" },
    { id: "5", date: "26 Mayo, 2024", day: "Domingo" },
  ],
  times: [
    { id: "1", time: "16:30", format: "2D" },
    { id: "2", time: "18:45", format: "3D" },
    { id: "3", time: "20:30", format: "2D" },
    { id: "4", time: "22:15", format: "IMAX" },
  ],
}

export default function SessionsPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(sessions.dates[0].id)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <ProgressBar currentStep={1} totalSteps={2} />

        <h1 className="text-3xl font-bold text-white mb-8 mt-8 text-center">Selecciona una sesión</h1>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Información de la película */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="p-4">
                <img
                  src={sessions.movie.poster || "/placeholder.svg"}
                  alt={sessions.movie.title}
                  className="w-full h-auto rounded-md mb-4"
                />
                <h2 className="text-xl font-bold text-white mb-2">{sessions.movie.title}</h2>
              </div>
            </Card>
          </div>

          {/* Selección de sesiones */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Selección de fecha */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-red-600" />
                Selecciona una fecha
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {sessions.dates.map((date) => (
                  <button
                    key={date.id}
                    onClick={() => setSelectedDate(date.id)}
                    className={`p-3 rounded-md text-center transition-all ${
                      selectedDate === date.id ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <div className="font-bold">{date.day}</div>
                    <div className="text-sm">{date.date}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selección de hora */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-red-600" />
                Selecciona un horario
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {sessions.times.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => setSelectedTime(time.id)}
                    className={`p-3 rounded-md text-center transition-all ${
                      selectedTime === time.id ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <div className="font-bold">{time.time}</div>
                    <div className="text-xs bg-gray-700 rounded px-2 py-0.5 inline-block mt-1">{time.format}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de continuar */}
            <div className="flex justify-end">
              <Button
                asChild={!!(selectedDate && selectedTime)}
                disabled={!selectedDate || !selectedTime}
                size="lg"
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700"
              >
                {selectedDate && selectedTime ? (
                  <Link href={`/pelicula/${params.id}/butacas?date=${selectedDate}&time=${selectedTime}`}>
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
