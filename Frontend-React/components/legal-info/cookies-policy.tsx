"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ModalCookies() {
  return (
    <Dialog>
      <DialogTrigger className="text-gray-400 hover:text-white text-left">Política de Cookies</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Política de Cookies</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-300">
          FrenzyFilms utiliza cookies para mejorar la navegación, personalizar contenido y analizar el tráfico del sitio. Al continuar navegando, aceptas el uso de cookies según nuestra política. Puedes gestionar o desactivar las cookies en la configuración de tu navegador, aunque esto puede afectar la experiencia de usuario.
        </p>
      </DialogContent>
    </Dialog>
  )
}
