"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { eliminarPelicula } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

type EliminarPeliculaProps = {
  id: number
  titulo: string
  onDelete?: () => void
}

export default function EliminarPelicula({ id, titulo, onDelete }: EliminarPeliculaProps) {
  const { toast } = useToast()

  const handleEliminar = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No estás autenticado")

      await eliminarPelicula(id, token)

      toast({
        title: "Película eliminada",
        description: `"${titulo}" fue eliminada correctamente.`,
      })

      if (onDelete) onDelete()
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar la película.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Eliminar
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-900 border border-gray-700">
        <DialogHeader>
          <DialogTitle>¿Eliminar "{titulo}"?</DialogTitle>
        </DialogHeader>

        <div className="text-gray-400 text-sm">
          Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta película?
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="destructive" onClick={handleEliminar}>
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
