"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { actualizarEstadoPelicula } from "@/lib/api"
import { Estado } from "@/lib/enums"
import { useToast } from "@/components/ui/use-toast"

type EditarEstadoProps = {
  id: number
  estadoActual: string
  onUpdate?: (nuevoEstado: string) => void
}

export default function EditarEstado({ id, estadoActual, onUpdate }: EditarEstadoProps) {
  const { toast } = useToast()

  const handleChangeEstado = async (nuevoEstado: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No estás autenticado")

      await actualizarEstadoPelicula(id, nuevoEstado, token)

      toast({
        title: "Estado actualizado",
        description: `La película ahora está "${nuevoEstado}".`,
      })

      if (onUpdate) onUpdate(nuevoEstado)
    } catch (error: any) {
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar el estado.",
        variant: "destructive",
      })
    }
  }

  return (
    <Select defaultValue={estadoActual} onValueChange={handleChangeEstado}>
      <SelectTrigger className="w-44 bg-yellow-600 text-white">
        <SelectValue placeholder="Editar estado" />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-700 text-white">
        {Object.values(Estado).map((estado) => (
          <SelectItem key={estado} value={estado}>
            {estado}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
