"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ModalTerminos() {
    return (
        <Dialog>
            <DialogTrigger className="text-gray-400 hover:text-white text-left">Términos y Condiciones</DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Términos y Condiciones</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-300">
                    Al utilizar FrenzyFilms, aceptas los términos establecidos: uso responsable del servicio, respeto a las normas de la plataforma 
                    y cumplimiento de la legislación vigente. FrenzyFilms no se hace responsable de posibles errores en la información proporcionada 
                    ni de cambios en la cartelera. El acceso a ciertos contenidos puede requerir registro o compra de entradas. Consulta detalles en 
                    nuestra página oficial.
                </p>
            </DialogContent>
        </Dialog>
    )
}
