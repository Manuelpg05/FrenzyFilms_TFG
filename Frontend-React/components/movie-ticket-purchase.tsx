"use client"

import { useState, useEffect } from "react"
import { Film, Clock, Calendar, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// Datos de ejemplo para la película
const movieData = {
  id: "1",
  title: "Dune: Parte Dos",
  director: "Denis Villeneuve",
  duration: "166 min",
  genre: "Ciencia ficción, Aventura",
  releaseDate: "2024",
  poster: "/placeholder.svg?height=600&width=400",
  description:
    "Paul Atreides se une a los Fremen y comienza un viaje espiritual y político para convertirse en Muad'Dib, mientras busca venganza contra los conspiradores que destruyeron a su familia. Enfrentando una elección entre el amor de su vida y el destino del universo conocido, se esfuerza por evitar un futuro terrible que solo él puede prever.",
  showtime: "20:30",
  date: "22 Mayo, 2024",
  room: "Sala 3",
  price: 9.5,
}

// Tipo para las butacas
type Seat = {
  id: string
  row: number
  section: "left" | "center" | "right"
  number: number
  status: "available" | "selected" | "occupied"
  isAccessible?: boolean
}

// Función para generar butacas según el layout de la imagen
const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  const totalRows = 13

  // Configuración de asientos por sección y fila
  const seatLayout = {
    left: {
      seatsPerRow: 6,
      // Filas que tienen menos asientos o configuraciones especiales
      specialRows: {},
    },
    center: {
      seatsPerRow: 14,
      specialRows: {
        1: { count: 8, skip: [4, 5, 6, 7, 8] }, // Fila 1 tiene 8 asientos, con huecos para accesibilidad
      },
    },
    right: {
      seatsPerRow: 6,
      specialRows: {
        12: { count: 3 }, // Fila 12 solo tiene 3 asientos
        7: { count: 3 }, // Fila 7 solo tiene 3 asientos
        6: { count: 3 }, // Fila 6 solo tiene 3 asientos
        5: { count: 3 }, // Fila 5 solo tiene 3 asientos
        4: { count: 3 }, // Fila 4 solo tiene 3 asientos
        3: { count: 3 }, // Fila 3 solo tiene 3 asientos
        2: { count: 3 }, // Fila 2 solo tiene 3 asientos
        1: { count: 2, isAccessible: [1, 2] }, // Fila 1 tiene 2 asientos accesibles
      },
    },
  }

  // Generar asientos para cada sección y fila
  for (let row = 1; row <= totalRows; row++) {
    // Sección izquierda
    const leftConfig = seatLayout.left.specialRows[row] || { count: seatLayout.left.seatsPerRow }
    for (let i = 1; i <= leftConfig.count; i++) {
      const isAccessible = leftConfig.isAccessible && leftConfig.isAccessible.includes(i)
      const status = Math.random() < 0.2 ? "occupied" : "available"
      seats.push({
        id: `left-${row}-${i}`,
        row,
        section: "left",
        number: i,
        status,
        isAccessible,
      })
    }

    // Sección central
    const centerConfig = seatLayout.center.specialRows[row] || { count: seatLayout.center.seatsPerRow }
    for (let i = 1; i <= centerConfig.count; i++) {
      // Saltar asientos específicos (para accesibilidad u otros propósitos)
      if (centerConfig.skip && centerConfig.skip.includes(i)) {
        seats.push({
          id: `center-${row}-${i}`,
          row,
          section: "center",
          number: i,
          status: "occupied",
          isAccessible: true,
        })
        continue
      }

      const isAccessible = centerConfig.isAccessible && centerConfig.isAccessible.includes(i)
      const status = Math.random() < 0.2 ? "occupied" : "available"
      seats.push({
        id: `center-${row}-${i}`,
        row,
        section: "center",
        number: i,
        status,
        isAccessible,
      })
    }

    // Sección derecha
    const rightConfig = seatLayout.right.specialRows[row] || { count: seatLayout.right.seatsPerRow }
    for (let i = 1; i <= rightConfig.count; i++) {
      const isAccessible = rightConfig.isAccessible && rightConfig.isAccessible.includes(i)
      const status = Math.random() < 0.2 ? "occupied" : "available"
      seats.push({
        id: `right-${row}-${i}`,
        row,
        section: "right",
        number: i,
        status,
        isAccessible,
      })
    }
  }

  return seats
}

export default function MovieTicketPurchase() {
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Cargar las butacas al montar el componente
    setSeats(generateSeats())
  }, [])

  // Reemplazar la función handleSeatClick para usar el nuevo formato de ID
  const handleSeatClick = (seatId: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.id === seatId) {
          if (seat.status === "occupied" || seat.isAccessible) return seat

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
    const total = (selectedSeats.length * movieData.price).toFixed(2)

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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Comprar Entradas</h1>

      {/* Información de la película */}
      <Card className="bg-gray-900 border-gray-800 mb-8">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Póster */}
          <div className="w-full md:w-1/4 flex-shrink-0">
            <div className="rounded-lg overflow-hidden border-2 border-red-800 shadow-lg shadow-red-900/30">
              <img
                src={movieData.poster || "/placeholder.svg"}
                alt={movieData.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Detalles */}
          <div className="w-full md:w-3/4">
            <h2 className="text-2xl font-bold mb-2">{movieData.title}</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-red-700">{movieData.genre}</Badge>
              <Badge className="bg-gray-700">{movieData.duration}</Badge>
              <Badge className="bg-gray-700">{movieData.releaseDate}</Badge>
            </div>

            <p className="text-gray-300 mb-6">{movieData.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span>Hora: {movieData.showtime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span>Fecha: {movieData.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4 text-red-500" />
                <span>{movieData.room}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Selección de butacas */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-6">Selección de butacas</h3>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-6 mb-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-sm"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
            <span>Ocupada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-sm"></div>
            <span>Seleccionada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 0 1 .75.75v.756a49.106 49.106 0 0 1 9.152 1 .75.75 0 0 1-.152 1.485h-1.918l2.474 10.605a.75.75 0 0 1-.734.885A60.47 60.47 0 0 1 12 18.75a60.47 60.47 0 0 1-9.572-1.02.75.75 0 0 1-.734-.885L4.168 6.242H2.25a.75.75 0 0 1-.152-1.485 49.105 49.105 0 0 1 9.152-1V3a.75.75 0 0 1 .75-.75Zm4.878 13.36 1.872-8.028h-1.872v8.028Zm-6.756 0h1.878V6.75H8.25l1.872 8.86Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>Accesibilidad</span>
          </div>
        </div>

        {/* Pantalla */}
        <div className="relative mb-10 mt-16">
          <div className="h-8 bg-white w-full mx-auto rounded-sm shadow-lg flex items-center justify-center text-black font-bold">
            PANTALLA
          </div>
        </div>

        {/* Butacas */}
        <div className="w-full max-w-5xl mx-auto mb-8 overflow-x-auto">
          <div className="min-w-[900px] relative pb-8">
          {Array.from({ length: 13 }, (_, rowIdx) => {
  const rowNumber = 13 - rowIdx;
  const rowSeats = seats
    .filter((seat) => seat.row === rowNumber)
    .sort((a, b) => a.number - b.number);

  return (
    <div key={`row-${rowNumber}`} className="flex justify-center mb-3">
      {/* Etiqueta de fila izquierda */}
      <div className="w-8 flex items-center justify-center font-semibold text-slate-400">
        {rowNumber}
      </div>

      {/* Asientos */}
      <div className="flex gap-2 flex-1 justify-center">
        {rowSeats.map((seat) => {
          const isSelected = seat.status === "selected";
          const isOccupied = seat.status === "occupied";
          const isAccessible = seat.isAccessible;
          const baseColor = isAccessible
            ? "bg-blue-600 cursor-not-allowed"
            : isOccupied
            ? "bg-red-600 cursor-not-allowed opacity-70"
            : isSelected
            ? "bg-yellow-500 hover:bg-yellow-400"
            : "bg-green-600 hover:bg-green-500";

          return (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat.id)}
              disabled={isOccupied || isAccessible}
              className={`w-8 h-8 rounded-sm text-xs flex items-center justify-center transition-all ${baseColor}`}
              aria-label={`Fila ${seat.row}, Asiento ${seat.number}`}
            >
              {seat.number}
            </button>
          );
        })}
      </div>

      {/* Etiqueta de fila derecha */}
      <div className="w-8 flex items-center justify-center font-semibold text-slate-400">
        {rowNumber}
      </div>
    </div>
  );
})}

{/* Números de columnas al pie */}
<div className="flex justify-center mt-6">
  <div className="w-8" /> {/* Espacio lateral izquierdo */}
  <div className="flex gap-2 flex-1 justify-center">
    {Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="w-8 h-6 flex items-center justify-center text-xs text-slate-400"
      >
        {i + 1}
      </div>
    ))}
  </div>
  <div className="w-8" /> {/* Espacio lateral derecho */}
</div>

          </div>
        </div>

        {/* Resumen */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h4 className="font-medium mb-2">Butacas seleccionadas:</h4>
              <p>
                {selectedSeats.length > 0
                  ? selectedSeats
                      .map(
                        (seat) =>
                          `Fila ${seat.row}, Asiento ${seat.number} (${seat.section === "left" ? "Izq." : seat.section === "center" ? "Centro" : "Der."})`,
                      )
                      .join("; ")
                  : "Ninguna butaca seleccionada"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Precio por entrada: {movieData.price.toFixed(2)}€</p>
              <p className="text-xl font-bold text-white">
                Total: {(selectedSeats.length * movieData.price).toFixed(2)}€
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
