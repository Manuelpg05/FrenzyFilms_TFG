"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users } from "lucide-react"
import { getSalas, createSala, eliminarSala, updateSala } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Sala = {
    id: number
    numSala: number
    numFilas: number
    numColumnas: number
    numAsientosTotal: number
}

export default function SalasAdmin() {
    const [salas, setSalas] = useState<Sala[]>([])
    const [loading, setLoading] = useState(true)
    const [numSala, setNumSala] = useState("")
    const [numFilas, setNumFilas] = useState("")
    const [numColumnas, setNumColumnas] = useState("")
    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")
                if (!token) throw new Error("No estás autenticado")
                const data = await getSalas(token)
                setSalas(data)
            } catch (error: any) {
                toast({ title: "Error", description: error.message })
            } finally {
                setLoading(false)
            }
        }

        fetchSalas()
    }, [])

    const handleCreateSala = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No estás autenticado")

            const nuevaSala = await createSala(
                {
                    numSala: parseInt(numSala),
                    numFilas: parseInt(numFilas),
                    numColumnas: parseInt(numColumnas),
                },
                token
            )

            setSalas((prev) => [nuevaSala, ...prev])
            toast({ title: "Sala creada", description: `Sala ${nuevaSala.numSala} añadida correctamente.` })

            setNumSala("")
            setNumFilas("")
            setNumColumnas("")
            setOpen(false)
        } catch (error: any) {
            toast({ title: "Error al crear la sala", description: error.message, variant: "destructive" })
        }
    }

    const handleEliminarSala = async (id: number, numSala: number, close: () => void) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No estás autenticado")

            await eliminarSala(id, token)
            setSalas((prev) => prev.filter((s) => s.id !== id))
            toast({ title: "Sala eliminada", description: `Sala ${numSala} eliminada correctamente.` })
            close()
        } catch (error: any) {
            toast({ title: "Error al eliminar la sala", description: error.message, variant: "destructive" })
        }
    }

    const handleUpdateSala = (salaActualizada: Sala) => {
        setSalas((prev) => prev.map((s) => (s.id === salaActualizada.id ? salaActualizada : s)))
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-center text-white mb-8">Administrar Salas</h1>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white mb-6">+ Añadir sala</Button>
                </DialogTrigger>

                <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                        <DialogTitle>Crear nueva sala</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 mt-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="numSala" className="text-gray-300 mb-1">Número de sala</Label>
                            <Input id="numSala" type="number" placeholder="Ej: 1" min={1} value={numSala} onChange={(e) => setNumSala(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="numFilas" className="text-gray-300 mb-1">Número de filas</Label>
                            <Input id="numFilas" type="number" placeholder="Ej: 10" min={1} value={numFilas} onChange={(e) => setNumFilas(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="numColumnas" className="text-gray-300 mb-1">Número de columnas</Label>
                            <Input id="numColumnas" type="number" placeholder="Ej: 12" min={1} value={numColumnas} onChange={(e) => setNumColumnas(e.target.value)} />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleCreateSala} className="bg-green-600 hover:bg-green-700 text-white">
                            Crear sala
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin h-10 w-10 text-red-600" />
                </div>
            ) : salas.length > 0 ? (
                <div className="flex flex-col space-y-6">
                    {salas.sort((a, b) => a.numSala - b.numSala).map((sala) => (
                        <SalaCard key={sala.id} sala={sala} onDelete={handleEliminarSala} onUpdate={handleUpdateSala} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-xl text-gray-400 mb-4">No hay salas disponibles</h3>
                </div>
            )}
        </div>
    )
}

function SalaCard({ sala, onDelete, onUpdate }: { sala: Sala; onDelete: (id: number, numSala: number, close: () => void) => void; onUpdate: (sala: Sala) => void }) {
    const [numSala, setNumSala] = useState(sala.numSala.toString())
    const [numFilas, setNumFilas] = useState(sala.numFilas.toString())
    const [numColumnas, setNumColumnas] = useState(sala.numColumnas.toString())

    const { toast } = useToast()

    const handleEditar = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No estás autenticado")

            const salaActualizada = await updateSala(sala.id, {
                numSala: parseInt(numSala),
                numFilas: parseInt(numFilas),
                numColumnas: parseInt(numColumnas),
            }, token)

            onUpdate(salaActualizada)
            toast({ title: "Sala actualizada", description: `Sala ${salaActualizada.numSala} modificada correctamente.` })
        } catch (error: any) {
            toast({ title: "Error al actualizar", description: error.message, variant: "destructive" })
        }
    }

    return (
        <Card className="bg-gray-900 border-gray-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <h2 className="text-4xl font-bold text-white">Sala {sala.numSala}</h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <Users className="shrink-0 h-4 w-4 text-red-600" />
                    <span>Aforo: {sala.numAsientosTotal} asientos</span>
                </div>
            </div>

            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">Editar</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader>
                            <DialogTitle>Editar sala {sala.numSala}</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 mt-4">
                            <Label>Número de sala</Label>
                            <Input type="number" value={numSala} onChange={(e) => setNumSala(e.target.value)} />
                            <Label>Número de filas</Label>
                            <Input type="number" value={numFilas} onChange={(e) => setNumFilas(e.target.value)} />
                            <Label>Número de columnas</Label>
                            <Input type="number" value={numColumnas} onChange={(e) => setNumColumnas(e.target.value)} />

                            <DialogClose asChild>
                                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white mt-4" onClick={handleEditar}>
                                    Guardar cambios
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="destructive">Eliminar</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader>
                            <DialogTitle>¿Eliminar sala {sala.numSala}?</DialogTitle>
                        </DialogHeader>
                        <div className="text-sm text-gray-400">
                            Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta sala?
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button variant="destructive" onClick={() => onDelete(sala.id, sala.numSala, () => { })}>
                                    Confirmar
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </Card>
    )
}
