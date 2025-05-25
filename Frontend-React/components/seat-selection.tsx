"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Tipo para las butacas
type Seat = {
  id: string
  row: string
  number: number
  status: "available" | "selected" | "occupied"
}

// Datos de ejemplo para la película y sesión
const sessionData = {
  movie: {
    id: "1",
    title: "Dune: Parte Dos",
    poster: "/placeholder.svg?height=600&width=400",
    price: 9.5,
  },
  date: "22 Mayo, 2024",
  time: "20:30",
  room: "Sala 3",
}

// Función para generar butacas según el layout de la imagen
const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  const rows = ["A", "B", "C", "D", "E", "F"]

  // Configuración de asientos por fila
  const seatsPerRow = {
    A: { left: 7, right: 5 },
    B: { left: 7, right: 5 },
    C: { left: 7, right: 7 },
    D: { left: 7, right: 7 },
    E: { left: 7, right: 7 },
    F: { left: 7, right: 7 },
  }

  // Generar asientos para cada fila
  rows.forEach((row) => {
    // Sección izquierda
    for (let i = 1; i <= seatsPerRow[row as keyof typeof seatsPerRow].left; i++) {
      const status = Math.random() < 0.2 ? "occupied" : "available"
      seats.push({
        id: `${row}-left-${i}`,
        row,
        number: i,
        status,
      })
    }

    // Sección derecha
    for (let i = 1; i <= seatsPerRow[row as keyof typeof seatsPerRow].right; i++) {
      const rightNumber = i + seatsPerRow[row as keyof typeof seatsPerRow].left + 1 // +1 para el pasillo
      const status = Math.random() < 0.2 ? "occupied" : "available"
      seats.push({
        id: `${row}-right-${rightNumber}`,
        row,
        number: rightNumber,
        status,
      })
    }
  })

  return seats
}

export default function SeatSelection() {
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Cargar las butacas al montar el componente
    setSeats(generateSeats())
  }, [])

  // Función para manejar el clic en una butaca
  const handleSeatClick = (seatId: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.id === seatId) {
          if (seat.status === "occupied") return seat

          const newStatus = seat.status === "available" ? "selected" : "available"

          // Actualizar la lista de butacas seleccionadas
          if (newStatus === "selected") {
            setSelectedSeats((prev) => [...prev, seat])
          } else {
            setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id))
          }

          return { ...seat, status: newStatus }
        }
        return seat
      }),
    )
  }

  // Función para manejar la compra
  const handlePurchase = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona al menos una butaca para continuar.",
        variant: "destructive",
      })
      return
    }

    const seatsList = selectedSeats.map((seat) => `${seat.row}${seat.number}`).join(", ")
    const total = (selectedSeats.length * sessionData.movie.price).toFixed(2)

    toast({
      title: "¡Compra realizada!",
      description: `Has comprado ${selectedSeats.length} entradas para las butacas ${seatsList}. Total: ${total}€`,
    })

    // Aquí se enviaría la información a la base de datos
    console.log("Butacas compradas:", selectedSeats)

    // Marcar las butacas como ocupadas
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (selectedSeats.some((s) => s.id === seat.id)) {
          return { ...seat, status: "occupied" }
        }
        return seat
      }),
    )

    // Limpiar selección
    setSelectedSeats([])
  }

  // Agrupar asientos por fila
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = []
      }
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>,
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Selección de Butacas</h1>

      {/* Información de la película y sesión */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <div className="flex flex-wrap items-center gap-6">
          <img
            src={sessionData.movie.poster || "/placeholder.svg"}
            alt={sessionData.movie.title}
            className="w-24 h-36 object-cover rounded-md shadow-lg"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">{sessionData.movie.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-300">
              <div>
                <span className="font-medium text-white block mb-1">Fecha:</span> {sessionData.date}
              </div>
              <div>
                <span className="font-medium text-white block mb-1">Hora:</span> {sessionData.time}
              </div>
              <div>
                <span className="font-medium text-white block mb-1">Sala:</span> {sessionData.room}
              </div>
            </div>
          </div>
          <div className="text-right bg-gray-800/50 p-4 rounded-md">
            <p className="text-sm text-gray-400">Precio por entrada:</p>
            <p className="text-xl font-bold text-white">{sessionData.movie.price.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Selección de butacas */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-6">Selección de butacas</h3>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-6 mb-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
            <span>Ocupada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-sm"></div>
            <span>Seleccionada</span>
          </div>
        </div>

        {/* Pantalla */}
        <div className="relative mb-10">
          <div className="h-8 bg-gray-700 w-full mx-auto rounded-sm shadow-lg flex items-center justify-center text-white font-bold">
            PANTALLA
          </div>
        </div>

        {/* Butacas */}
        <div className="w-full max-w-3xl mx-auto mb-8">
          <TooltipProvider>
            {Object.keys(seatsByRow)
              .sort()
              .map((row) => {
                const rowSeats = seatsByRow[row].sort((a, b) => a.number - b.number)

                return (
                  <div key={`row-${row}`} className="flex items-center mb-3">
                    {/* Etiqueta de fila izquierda */}
                    <div className="w-8 flex items-center justify-center font-semibold text-white">{row}</div>

                    {/* Asientos */}
                    <div className="flex-1 flex justify-center">
                      {rowSeats.map((seat) => {
                        const isSelected = seat.status === "selected"
                        const isOccupied = seat.status === "occupied"

                        // Determinar si hay que añadir espacio para el pasillo
                        const isBeforeAisle = seat.number === 7 && row !== "A" && row !== "B"

                        return (
                          <React.Fragment key={seat.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleSeatClick(seat.id)}
                                  disabled={isOccupied}
                                  className={`
                                  w-8 h-8 rounded-sm m-0.5 flex items-center justify-center transition-all
                                  ${
                                    isOccupied
                                      ? "bg-gray-600 cursor-not-allowed"
                                      : isSelected
                                        ? "bg-green-600 hover:bg-green-500"
                                        : "bg-red-600 hover:bg-red-500"
                                  }
                                `}
                                  aria-label={`Fila ${seat.row}, Asiento ${seat.number}`}
                                >
                                  {seat.number}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Fila {seat.row}, Asiento {seat.number}
                                </p>
                                <p>{isOccupied ? "Ocupado" : isSelected ? "Seleccionado" : "Disponible"}</p>
                              </TooltipContent>
                            </Tooltip>

                            {/* Añadir espacio para el pasillo */}
                            {isBeforeAisle && <div className="w-4"></div>}
                          </React.Fragment>
                        )
                      })}
                    </div>

                    {/* Etiqueta de fila derecha */}
                    <div className="w-8 flex items-center justify-center font-semibold text-white">{row}</div>
                  </div>
                )
              })}
          </TooltipProvider>
        </div>

        {/* Resumen */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h4 className="font-medium mb-2">Butacas seleccionadas:</h4>
              <p>
                {selectedSeats.length > 0
                  ? selectedSeats.map((seat) => `${seat.row}${seat.number}`).join(", ")
                  : "Ninguna butaca seleccionada"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Precio por entrada: {sessionData.movie.price.toFixed(2)}€</p>
              <p className="text-xl font-bold text-white">
                Total: {(selectedSeats.length * sessionData.movie.price).toFixed(2)}€
              </p>
            </div>
          </div>
        </div>

        {/* Botón de compra */}
        <Button
          onClick={handlePurchase}
          disabled={selectedSeats.length === 0}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Comprar entradas ({selectedSeats.length})
        </Button>
      </div>
    </div>
  )
}
