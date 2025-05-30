"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Pencil } from "lucide-react"
import { format } from "date-fns"
import { updateSesion } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function EditSessionButton({
  sesion,
  onSesionActualizada,
}: {
  sesion: any
  onSesionActualizada: (sesionActualizada: any) => void
}) {
  const [open, setOpen] = useState(false)
  const [fecha, setFecha] = useState<Date | undefined>(() => {
    const [day, month, year] = sesion.fecha.split("-").map(Number)
    return new Date(year, month - 1, day)
  })
  const [hora, setHora] = useState<string>(sesion.horaInicio.slice(0, 2))
  const [minuto, setMinuto] = useState<string>(sesion.horaInicio.slice(3, 5))

  const { toast } = useToast()

  const handleActualizar = async () => {
    if (!fecha || !hora || !minuto) {
      toast({ title: "Completa todos los campos" })
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No estás autenticado")

      const sesionActualizada = {
        fecha: format(fecha, "dd-MM-yyyy"),
        horaInicio: `${hora.padStart(2, "0")}:${minuto.padStart(2, "0")}:00`,
      }

      const resultado = await updateSesion(sesion.id, sesionActualizada, token)

      onSesionActualizada({ ...sesion, ...resultado })

      setOpen(false)
      toast({ title: "Sesión actualizada correctamente" })
    } catch (error: any) {
      toast({
        title: "Error al actualizar sesión",
        description: error.message || "No se pudo actualizar la sesión.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2">
          <Pencil className="h-4 w-4" /> Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Editar sesión</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Label>Fecha</Label>
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
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleActualizar} className="bg-yellow-600 hover:bg-yellow-700">Actualizar sesión</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
