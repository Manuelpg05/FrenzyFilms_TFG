"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ModalPrivacidad() {
  return (
    <Dialog>
      <DialogTrigger className="text-gray-400 hover:text-white text-left">Política de Privacidad</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Política de Privacidad</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-300">
          FrenzyFilms respeta tu privacidad y protege tus datos personales según la legislación vigente (RGPD). 
          Recopilamos datos para gestionar tu cuenta y mejorar la experiencia. Nunca compartimos tu información 
          sin consentimiento, salvo cuando sea requerido por la ley. Puedes ejercer tus derechos de acceso, 
          rectificación y eliminación de datos contactándonos a través de nuestro correo electrónico.
        </p>
      </DialogContent>
    </Dialog>
  )
}
