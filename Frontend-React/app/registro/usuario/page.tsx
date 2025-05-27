"use client"

import { useRouter } from "next/navigation"
import AuthForm from "@/components/auth/AuthForm"
import { createUser } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"


export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: Record<string, string>) => {
    await createUser({
      username: data.username,
      password: data.password,
      email: data.email,
      telefono: data.telefono,
      nombre: data.nombre,
    })

    toast({
      title: "Cuenta creada correctamente",
      description: "Ya puedes iniciar sesión con tu nueva cuenta.",
    })

    router.push("/login")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <AuthForm
        title="Crear Cuenta"
        description="Regístrate para acceder a FrenzyFilms"
        buttonText="Registrarse"
        onSubmit={handleSubmit}
        fields={[
          { name: "username", label: "Usuario", placeholder: "Introduce tu usuario" },
          { name: "nombre", label: "Nombre completo", type: "text", placeholder: "Tu nombre completo" },
          { name: "password", label: "Contraseña", type: "password", placeholder: "••••••••" },
          { name: "email", label: "Correo electrónico", type: "email", placeholder: "tu@email.com" },
          { name: "telefono", label: "Teléfono", type: "tel", placeholder: "666 555 444" },
        ]}
      />

      <div className="flex items-center justify-center space-x-2 pt-4">
        <span className="text-gray-400 text-sm">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-red-400 hover:text-red-300 font-medium">
            Inicia sesión
          </a>
        </span>
      </div>

      <div className="text-center mt-8">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} FrenzyFilms. Todos los derechos reservados.
        </p>
      </div>
    </main>
  )
}
