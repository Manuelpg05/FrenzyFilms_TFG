"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Modificar la función handleSubmit para asegurar que el evento de storage se dispare
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      email: !formData.email ? "El email es requerido" : !/\S+@\S+\.\S+/.test(formData.email) ? "Email inválido" : "",
      password: !formData.password
        ? "La contraseña es requerida"
        : formData.password.length < 6
          ? "La contraseña debe tener al menos 6 caracteres"
          : "",
    }

    setErrors(newErrors)

    // If no errors, submit form
    if (!newErrors.email && !newErrors.password) {
      setLoading(true)

      // Simulate API call
      setTimeout(() => {
        setLoading(false)

        // Simular inicio de sesión exitoso
        // Si el email contiene "admin", asignar rol de administrador
        const isAdmin = formData.email.includes("admin")

        const user = {
          id: "user-1",
          name: isAdmin ? "Administrador" : "Usuario Demo",
          email: formData.email,
          isAdmin: isAdmin,
        }

        // Guardar en localStorage
        localStorage.setItem("cinema-user", JSON.stringify(user))

        // Disparar un evento de storage para que otros componentes se enteren
        window.dispatchEvent(new Event("storage"))

        toast({
          title: "¡Inicio de sesión exitoso!",
          description: `Bienvenido a CineMax${isAdmin ? " como Administrador" : ""}.`,
        })

        router.push("/")
      }, 1500)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md space-y-8 relative">
        {/* Decorative elements */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-xl animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-xl animate-pulse" />

        <div className="relative z-10 bg-gray-900 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <div className="bg-red-600 p-3 rounded-full">
              <Film className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">FrenzyFilms</h1>
            <p className="text-gray-400 text-sm">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`bg-gray-800 border-gray-700 text-white ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-gray-800 border-gray-700 text-white pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300">
                  Recordarme
                </Label>
              </div>
              <a href="#" className="text-sm text-red-400 hover:text-red-300">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white">
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <div className="flex items-center justify-center space-x-2 pt-4">
              <span className="text-gray-400 text-sm">
                ¿No tienes cuenta?{" "}
                <a href="#" className="text-red-400 hover:text-red-300 font-medium">
                  Regístrate
                </a>
              </span>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FrenzyFilms. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
