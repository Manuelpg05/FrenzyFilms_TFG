"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, Clock, Film, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Tipo para las entradas
type Ticket = {
  id: string
  movieId: string
  movieTitle: string
  date: string
  time: string
  room: string
  seats: Array<{
    row: number
    number: number
    section: string
  }>
  totalPrice: number
  purchaseDate: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Cargar entradas desde localStorage
    const storedTickets = localStorage.getItem("cinema-tickets")
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets))
    }
  }, [])

  const handleDeleteClick = (ticketId: string) => {
    setTicketToDelete(ticketId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (ticketToDelete) {
      const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketToDelete)
      setTickets(updatedTickets)
      localStorage.setItem("cinema-tickets", JSON.stringify(updatedTickets))

      toast({
        title: "Entrada eliminada",
        description: "La entrada ha sido eliminada correctamente.",
      })

      setIsDeleteDialogOpen(false)
      setTicketToDelete(null)
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="entradas" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-900">
              <TabsTrigger value="entradas" className="data-[state=active]:bg-red-600">
                Mis Entradas
              </TabsTrigger>
              <TabsTrigger value="preferencias" className="data-[state=active]:bg-red-600">
                Preferencias
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="entradas">
            <h1 className="text-3xl font-bold text-white mb-8">Mis Entradas</h1>

            {tickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-white">{ticket.movieTitle}</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(ticket.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-transparent"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="h-4 w-4 mr-2 text-red-600" />
                          <span>{ticket.date}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-2 text-red-600" />
                          <span>{ticket.time}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 text-red-600" />
                          <span>{ticket.room}</span>
                        </div>
                        <div className="flex items-start text-gray-300">
                          <Film className="h-4 w-4 mr-2 text-red-600 mt-1" />
                          <div>
                            <span className="block">Butacas:</span>
                            <ul className="list-disc list-inside ml-2">
                              {ticket.seats.map((seat, index) => (
                                <li key={index}>
                                  Fila {seat.row}, Asiento {seat.number} (
                                  {seat.section === "left" ? "Izq." : seat.section === "center" ? "Centro" : "Der."})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                        <div className="text-sm text-gray-400">
                          Comprada el{" "}
                          {new Date(ticket.purchaseDate).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                        <div className="font-bold text-white">Total: {ticket.totalPrice.toFixed(2)}€</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-400 mb-4">No tienes entradas compradas</h3>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/">Ver cartelera</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preferencias">
            <h1 className="text-3xl font-bold text-white mb-8">Preferencias</h1>
            <Card className="bg-gray-900 border-gray-800">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Tema</h2>
                <ThemeSelector />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo de confirmación para eliminar */}
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
    </main>
  )
}

function ThemeSelector() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    // Obtener tema actual
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light"
    setTheme(currentTheme as "dark" | "light")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Aplicar tema
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    }

    // Guardar preferencia
    localStorage.setItem("theme", newTheme)
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">Cambiar entre tema oscuro y claro</span>
      <Button onClick={toggleTheme} variant="outline" className="border-red-600 text-red-600">
        Cambiar a tema {theme === "dark" ? "claro" : "oscuro"}
      </Button>
    </div>
  )
}
