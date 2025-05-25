"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import ProgressBar from "@/components/progress-bar"
import { useSearchParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Tipo para las butacas
type Seat = {
  id: string
  row: number
  section: "left" | "center" | "right"
  number: number
  status: "available" | "selected" | "occupied"
  isAccessible?: boolean
}

// Modificar la función generateSeats para eliminar las butacas de minusválidos
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
      specialRows: {},
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
        1: { count: 2 }, // Fila 1 tiene 2 asientos
      },
    },
  }

  // Generar asientos para cada sección y fila
  for (let row = 1; row <= totalRows; row++) {
    // Sección izquierda
    const leftConfig = seatLayout.left.specialRows[row] || { count: seatLayout.left.seatsPerRow }
    for (let i = 1; i <= leftConfig.count; i++) {
      const status = Math.random() < 0.2 ? "occupied" : "available"
      seats.push({
        id: `left-${row}-${i}`,
        row,
        section: "left",
        number: i,
        status,
      })
    }

    // Sección central
    const centerConfig = seatLayout.center.specialRows[row] || { count: seatLayout.center.seatsPerRow }
    for (let i = 1; i <= centerConfig.count; i++) {
      const status = Math.random() < 0.2 ? "occupied" : "available"
      seats.push({
        id: `center-${row}-${i}`,
        row,
        section: "center",
        number: i,
        status,
      })
    }

    // Sección derecha
    const rightConfig = seatLayout.right.specialRows[row] || { count: seatLayout.right.seatsPerRow }
    for (let i = 1; i <= rightConfig.count; i++) {
      const status = Math.random() < 0.2 ? "occupied" : "available"
      seats.push({
        id: `right-${row}-${i}`,
        row,
        section: "right",
        number: i,
        status,
      })
    }
  }

  return seats
}

// Datos de ejemplo para la película
const movieData = {
  id: "1",
  title: "Dune: Parte Dos",
  poster: "/placeholder.svg?height=600&width=400",
  price: 9.5,
}

export default function SeatsPage({ params }: { params: { id: string } }) {
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const dateId = searchParams.get("date")
  const timeId = searchParams.get("time")

  // Datos de ejemplo para la sesión seleccionada
  const sessionData = {
    date: "22 Mayo, 2024",
    time: "20:30",
    room: "Sala 3",
  }

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

    setIsConfirmDialogOpen(true)
  }

  // Función para confirmar la compra
  const confirmPurchase = () => {
    // Aquí se enviaría la información a la base de datos
    const ticketData = {
      movieId: params.id,
      movieTitle: movieData.title,
      date: sessionData.date,
      time: sessionData.time,
      room: sessionData.room,
      seats: selectedSeats.map((seat) => ({
        row: seat.row,
        number: seat.number,
        section: seat.section,
      })),
      totalPrice: selectedSeats.length * movieData.price,
    }

    // Guardar en localStorage (simulación)
    const storedTickets = localStorage.getItem("cinema-tickets")
    const tickets = storedTickets ? JSON.parse(storedTickets) : []
    tickets.push({
      id: `ticket-${Date.now()}`,
      ...ticketData,
      purchaseDate: new Date().toISOString(),
    })
    localStorage.setItem("cinema-tickets", JSON.stringify(tickets))

    toast({
      title: "¡Compra realizada!",
      description: `Has comprado ${selectedSeats.length} entradas para ${movieData.title}.`,
    })

    // Cerrar el diálogo y redirigir a la página principal
    setIsConfirmDialogOpen(false)
    router.push("/")
  }

  // Modificar el bloque de información de la película para hacerlo más grande y añadir imagen de fondo
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <ProgressBar currentStep={2} totalSteps={2} />

        <h1 className="text-3xl font-bold text-white mb-8 mt-8 text-center">Selecciona tus butacas</h1>

        {/* Información de la película y sesión - Bloque horizontal con imagen de fondo */}
        <div
          className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.95)), url(${movieData.poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "180px",
          }}
        >
          <div className="flex flex-wrap items-center gap-6">
            <img
              src={movieData.poster || "/placeholder.svg"}
              alt={movieData.title}
              className="w-32 h-48 object-cover rounded-md shadow-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">{movieData.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-300">
                <div className="bg-gray-800/50 p-3 rounded-md">
                  <span className="font-medium text-white block mb-1">Fecha:</span> {sessionData.date}
                </div>
                <div className="bg-gray-800/50 p-3 rounded-md">
                  <span className="font-medium text-white block mb-1">Hora:</span> {sessionData.time}
                </div>
                <div className="bg-gray-800/50 p-3 rounded-md">
                  <span className="font-medium text-white block mb-1">Sala:</span> {sessionData.room}
                </div>
              </div>
            </div>
            <div className="text-right bg-gray-800/50 p-4 rounded-md">
              <p className="text-sm text-gray-400">Precio por entrada:</p>
              <p className="text-xl font-bold text-white">{movieData.price.toFixed(2)}€</p>
            </div>
          </div>
        </div>

        {/* Selección de butacas */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">Selección de butacas</h3>

          {/* Leyenda */}
          <div className="flex flex-wrap gap-6 mb-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
              <span>Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded-sm"></div>
              <span>Seleccionada</span>
            </div>
          </div>

          {/* Butacas */}
          <div className="w-full max-w-5xl mx-auto mb-8 overflow-x-auto">
            <div className="min-w-[900px] relative pb-8">
              {/* Renderizar filas */}
              {Array.from({ length: 13 }, (_, i) => 13 - i).map((rowNum) => {
                // Filtrar asientos por fila
                const rowSeats = seats.filter((seat) => seat.row === rowNum)

                // Agrupar por sección
                const leftSeats = rowSeats.filter((seat) => seat.section === "left").sort((a, b) => a.number - b.number)
                const centerSeats = rowSeats
                  .filter((seat) => seat.section === "center")
                  .sort((a, b) => a.number - b.number)
                const rightSeats = rowSeats
                  .filter((seat) => seat.section === "right")
                  .sort((a, b) => a.number - b.number)

                return (
                  <div key={`row-${rowNum}`} className="flex items-center mb-1">
                    {/* Número de fila (izquierda) */}
                    <div className="w-6 text-center font-bold text-gray-400">{rowNum}</div>

                    {/* Sección izquierda */}
                    <div className="flex gap-1 mr-4">
                      {leftSeats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === "occupied"}
                          className={`
                        w-8 h-8 rounded-sm text-xs flex items-center justify-center transition-all
                        ${
                          seat.status === "available"
                            ? "bg-blue-600 hover:bg-blue-500"
                            : seat.status === "selected"
                              ? "bg-green-600 hover:bg-green-500"
                              : "bg-red-600 cursor-not-allowed opacity-70"
                        }
                      `}
                          aria-label={`Fila ${seat.row}, Asiento ${seat.number}, ${
                            seat.status === "available"
                              ? "disponible"
                              : seat.status === "selected"
                                ? "seleccionado"
                                : "ocupado"
                          }`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                            <path
                              d="M19 9V7C19 5.13077 17.8692 4 16 4H8C6.13077 4 5 5.13077 5 7V9"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <path
                              d="M3 9H21V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V9Z"
                              fill={seat.status === "selected" ? "white" : "none"}
                              stroke="white"
                              strokeWidth="2"
                            />
                            <path d="M5 17V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M19 17V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      ))}
                    </div>

                    {/* Sección central */}
                    <div className="flex gap-1 mr-4">
                      {centerSeats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === "occupied"}
                          className={`
                        w-8 h-8 rounded-sm text-xs flex items-center justify-center transition-all
                        ${
                          seat.status === "available"
                            ? "bg-blue-600 hover:bg-blue-500"
                            : seat.status === "selected"
                              ? "bg-green-600 hover:bg-green-500"
                              : "bg-red-600 cursor-not-allowed opacity-70"
                        }
                      `}
                          aria-label={`Fila ${seat.row}, Asiento ${seat.number}, ${
                            seat.status === "available"
                              ? "disponible"
                              : seat.status === "selected"
                                ? "seleccionado"
                                : "ocupado"
                          }`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                            <path
                              d="M19 9V7C19 5.13077 17.8692 4 16 4H8C6.13077 4 5 5.13077 5 7V9"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <path
                              d="M3 9H21V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V9Z"
                              fill={seat.status === "selected" ? "white" : "none"}
                              stroke="white"
                              strokeWidth="2"
                            />
                            <path d="M5 17V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M19 17V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      ))}
                    </div>

                    {/* Sección derecha */}
                    <div className="flex gap-1">
                      {rightSeats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === "occupied"}
                          className={`
                        w-8 h-8 rounded-sm text-xs flex items-center justify-center transition-all
                        ${
                          seat.status === "available"
                            ? "bg-blue-600 hover:bg-blue-500"
                            : seat.status === "selected"
                              ? "bg-green-600 hover:bg-green-500"
                              : "bg-red-600 cursor-not-allowed opacity-70"
                        }
                      `}
                          aria-label={`Fila ${seat.row}, Asiento ${seat.number}, ${
                            seat.status === "available"
                              ? "disponible"
                              : seat.status === "selected"
                                ? "seleccionado"
                                : "ocupado"
                          }`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                            <path
                              d="M19 9V7C19 5.13077 17.8692 4 16 4H8C6.13077 4 5 5.13077 5 7V9"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <path
                              d="M3 9H21V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V9Z"
                              fill={seat.status === "selected" ? "white" : "none"}
                              stroke="white"
                              strokeWidth="2"
                            />
                            <path d="M5 17V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M19 17V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      ))}
                    </div>

                    {/* Número de fila (derecha) */}
                    <div className="w-6 text-center font-bold text-gray-400 ml-2">{rowNum}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pantalla - Movida debajo de la tabla de selección de asientos */}
          <div className="relative mb-10">
            <div className="h-8 bg-white w-full mx-auto rounded-sm shadow-lg flex items-center justify-center text-black font-bold">
              PANTALLA
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

      {/* Diálogo de confirmación */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Confirmar compra</DialogTitle>
            <DialogDescription className="text-gray-400">
              Estás a punto de comprar entradas para {movieData.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">
              <span className="font-medium">Película:</span> {movieData.title}
            </p>
            <p className="mb-2">
              <span className="font-medium">Fecha:</span> {sessionData.date}
            </p>
            <p className="mb-2">
              <span className="font-medium">Hora:</span> {sessionData.time}
            </p>
            <p className="mb-2">
              <span className="font-medium">Sala:</span> {sessionData.room}
            </p>
            <p className="mb-2">
              <span className="font-medium">Butacas:</span>{" "}
              {selectedSeats
                .map(
                  (seat) =>
                    `Fila ${seat.row}, Asiento ${seat.number} (${seat.section === "left" ? "Izq." : seat.section === "center" ? "Centro" : "Der."})`,
                )
                .join("; ")}
            </p>
            <p className="font-bold text-lg mt-4">Total: {(selectedSeats.length * movieData.price).toFixed(2)}€</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={confirmPurchase}>
              Confirmar compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
