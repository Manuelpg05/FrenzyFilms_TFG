"use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import { deleteSesion } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function deleteSessionButton({
    sesionId,
    sesionLabel,
    onSesionEliminada,
}: {
    sesionId: number
    sesionLabel: string
    onSesionEliminada: (idEliminado: number) => void
}) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleEliminar = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No estás autenticado")

            await deleteSesion(sesionId, token)
            onSesionEliminada(sesionId)
            toast({ title: `Sesión ${sesionLabel} eliminada correctamente` })
        } catch (error: any) {
            toast({
                title: "Error al eliminar sesión",
                description: error.message || "No se pudo eliminar la sesión.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Eliminar</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                    <DialogTitle>¿Eliminar la sesión {sesionLabel}?</DialogTitle>
                </DialogHeader>
                <p className="text-red-600 text-sm font-semibold">
                    <AlertTriangle className="shrink-0 h-5 w-5" />
                    ¡ALERTA!: Esta operación afectará de manera negativa a los usuarios que hayan comprado entradas para esta sesión.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    Esta acción enviará un correo a los usuarios que tenían entradas para esta sesión.
                </p>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleEliminar} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                        {loading ? "Eliminando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
