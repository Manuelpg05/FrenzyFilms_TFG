"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthForm from "@/components/auth/AuthForm"
import { createAdmin, getUserProfile } from "@/lib/api"
import { Roles } from "@/lib/enums"
import { useToast } from "@/components/ui/use-toast"

export default function AdminRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    getUserProfile(token)
      .then((profile) => {
        if (profile.rol !== Roles.ADMIN) {
          router.push("/")
        } else {
          setCheckingAuth(false)
        }
      })
      .catch(() => router.push("/"))
  }, [router])

  const handleSubmit = async (data: Record<string, string>) => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    await createAdmin({
      username: data.username,
      password: data.password,
      email: data.email,
      telefono: data.telefono,
      nombre: data.nombre,
    }, token)

    toast({
      title: "Administrador creado correctamente",
      description: "Ya puedes iniciar sesión con la nueva cuenta.",
    })

    router.push("/")
  }

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Cargando...
      </div>
    )
  }

  return (
    <main className="overflow-x-hidden min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <AuthForm
        title="Registrar a otro Admin"
        description="Crea una nueva cuenta de administrador"
        buttonText="Registrar Admin"
        onSubmit={handleSubmit}
        fields={[
          { name: "username", label: "Usuario", placeholder: "Introduce el usuario" },
          { name: "nombre", label: "Nombre completo", type: "text", placeholder: "Nombre del administrador" },
          { name: "password", label: "Contraseña", type: "password", placeholder: "••••••••" },
          { name: "email", label: "Correo electrónico", type: "email", placeholder: "admin@email.com" },
          { name: "telefono", label: "Teléfono", type: "tel", placeholder: "666 555 444" },
        ]}
      />

      <div className="text-center mt-8">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} FrenzyFilms. Todos los derechos reservados.
        </p>
      </div>
    </main>
  )
}
